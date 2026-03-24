/* ============================================================
   Carnet EPS — Dual Mode
   MODE "Aujourd'hui" : Cartes (présence, tenue, comportement +/-)
   MODE "Évaluation"  : Liste/tableau avec critères en haut
   MODE "Chrono"      : Chronomètre par élève
   MODE "Compteur"    : +/- par élève
   MODE "Résumé"      : Bilan de la journée
   Onglets groupes à DROITE
   Critères personnalisés par l'enseignant
   Zoom +/-
   zonetotalsport.ca
   ============================================================ */
'use strict';

// ═══════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════
var SCALE = ['A','B','C','D','E'];

// Default "Aujourd'hui" items the teacher can toggle on/off
var TODAY_DEFAULTS = [
  { key: 'presence', label: 'Présence', type: 'presence', on: true },
  { key: 'tenue', label: 'Tenue sportive', type: 'yesno', on: true },
  { key: 'materiel', label: 'Matériel', type: 'yesno', on: false },
  { key: 'securite', label: 'Sécurité', type: 'yesno', on: false },
  { key: 'comportement', label: 'Comportement', type: 'badge', on: true },
  { key: 'effort', label: 'Effort', type: 'stars', on: false },
  { key: 'participation', label: 'Participation', type: 'stars', on: false, default: 3 },
  { key: 'ecoute', label: 'Écoute', type: 'stars', on: false },
  { key: 'fairplay', label: 'Fair-play', type: 'stars', on: false },
  { key: 'autonomie', label: 'Autonomie', type: 'stars', on: false },
];

// PFEQ — 3 compétences et leurs composantes (intentions pédagogiques)
var PFEQ_COMPETENCES = [
  { key: 'agir', label: '🏃 AGIR', desc: 'Agir dans divers contextes de pratique d\'activités physiques', items: [
    { key: 'agir_execution', label: 'Exécution d\'actions motrices' },
    { key: 'agir_principes', label: 'Application de principes liés à l\'exécution' },
    { key: 'agir_efficacite', label: 'Efficacité des actions motrices' },
    { key: 'agir_planif', label: 'Planification de sa démarche' },
    { key: 'agir_evaluation', label: 'Évaluation de sa démarche' },
    { key: 'agir_equilibre', label: 'Équilibre et coordination' },
    { key: 'agir_locomotion', label: 'Locomotion (courir, sauter, ramper)' },
    { key: 'agir_manipulation', label: 'Manipulation d\'objets' },
    { key: 'agir_securite', label: 'Respect des règles de sécurité' },
  ]},
  { key: 'interagir', label: '🤝 INTERAGIR', desc: 'Interagir dans divers contextes de pratique d\'activités physiques', items: [
    { key: 'inter_coop', label: 'Coopération avec les partenaires' },
    { key: 'inter_opp', label: 'Opposition face aux adversaires' },
    { key: 'inter_comm', label: 'Communication motrice' },
    { key: 'inter_sync', label: 'Synchronisation des actions' },
    { key: 'inter_strat', label: 'Élaboration de stratégies' },
    { key: 'inter_roles', label: 'Application des rôles (attaque/défense)' },
    { key: 'inter_ethique', label: 'Éthique sportive et fair-play' },
    { key: 'inter_eval', label: 'Évaluation de la démarche collective' },
  ]},
  { key: 'sante', label: '❤️ SANTÉ', desc: 'Adopter un mode de vie sain et actif', items: [
    { key: 'sante_condition', label: 'Condition physique' },
    { key: 'sante_habitudes', label: 'Habitudes de vie saines' },
    { key: 'sante_hygiene', label: 'Hygiène et propreté' },
    { key: 'sante_stress', label: 'Gestion du stress' },
    { key: 'sante_alimentation', label: 'Saine alimentation et hydratation' },
    { key: 'sante_securite', label: 'Sécurité dans la pratique' },
    { key: 'sante_effort', label: 'Persévérance et engagement dans l\'effort' },
    { key: 'sante_bienetre', label: 'Bien-être physique et mental' },
  ]},
];

var COUNTER_ITEMS = [
  { key: 'score', label: 'Score' },
  { key: 'reussites', label: 'Réussites' },
  { key: 'tentatives', label: 'Tentatives' },
];

var QUICK_CRITERIA = [
  'Lancer précis','Attraper','Dribbler','Frapper','Équilibre','Course','Sauter',
  'Réception','Passe','Tir au but','Feinte','Démarquage','Communication',
  'Stratégie','Créativité','Persévérance','Respect des règles','Entraide',
];

// ═══════════════════════════════════
// STATE
// ═══════════════════════════════════
var _groupId = null;
var _mode = 'aujourdhui';
var _sessionDate = todayStr();
var _selectedColor = 'cyan';
var _editingGroupId = null;
var _chronos = {};
var _voiceRecorders = {};
var _zoomLevel = 100;

function todayStr() { return new Date().toISOString().slice(0,10); }
function esc(s) { var d=document.createElement('div');d.textContent=s;return d.innerHTML; }

// ═══════════════════════════════════
// STORAGE
// ═══════════════════════════════════
function getGroups(){try{return JSON.parse(localStorage.getItem('carneteps-groups')||'[]');}catch(e){return[];}}
function setGroups(g){localStorage.setItem('carneteps-groups',JSON.stringify(g));}
function getData(){try{return JSON.parse(localStorage.getItem('carneteps-data')||'{}');}catch(e){return{};}}
function setData(d){localStorage.setItem('carneteps-data',JSON.stringify(d));}
function getPhotos(){try{return JSON.parse(localStorage.getItem('carneteps-photos')||'{}');}catch(e){return{};}}
function setPhotos(p){localStorage.setItem('carneteps-photos',JSON.stringify(p));}
function getVoice(){try{return JSON.parse(localStorage.getItem('carneteps-voice')||'{}');}catch(e){return{};}}
function setVoice(v){localStorage.setItem('carneteps-voice',JSON.stringify(v));}
function getCustomCriteria(){try{return JSON.parse(localStorage.getItem('carneteps-custom')||'[]');}catch(e){return[];}}
function setCustomCriteria(c){localStorage.setItem('carneteps-custom',JSON.stringify(c));}
function getTodayToggles(){try{return JSON.parse(localStorage.getItem('carneteps-toggles')||'null');}catch(e){return null;}}
function setTodayToggles(t){localStorage.setItem('carneteps-toggles',JSON.stringify(t));}
function getPfeqSelected(){try{return JSON.parse(localStorage.getItem('carneteps-pfeq')||'[]');}catch(e){return[];}}
function setPfeqSelected(arr){localStorage.setItem('carneteps-pfeq',JSON.stringify(arr));}
// Évaluation labels per group+date: { groupId: { date: "Dribbler" } }
function getEvalLabels(){try{return JSON.parse(localStorage.getItem('carneteps-evallabels')||'{}');}catch(e){return{};}}
function setEvalLabels(o){localStorage.setItem('carneteps-evallabels',JSON.stringify(o));}
function getEvalLabel(gid,date){var o=getEvalLabels();return(o[gid]&&o[gid][date])||'';}
function setEvalLabel(gid,date,label){var o=getEvalLabels();if(!o[gid])o[gid]={};o[gid][date]=label;setEvalLabels(o);}

function getVal(sid,key){
  var d=getData();
  try{return d[_groupId][_sessionDate][sid][key];}catch(e){return undefined;}
}
function setVal(sid,key,val){
  var d=getData();
  if(!d[_groupId])d[_groupId]={};
  if(!d[_groupId][_sessionDate])d[_groupId][_sessionDate]={};
  if(!d[_groupId][_sessionDate][sid])d[_groupId][_sessionDate][sid]={};
  d[_groupId][_sessionDate][sid][key]=val;
  setData(d);
}

// ═══════════════════════════════════
// INIT
// ═══════════════════════════════════
document.addEventListener('DOMContentLoaded', function(){
  _groupId = localStorage.getItem('carneteps-lastgroup')||null;
  _mode = localStorage.getItem('carneteps-mode')||'aujourdhui';
  _zoomLevel = parseInt(localStorage.getItem('carneteps-zoom')||'100');
  applyZoom();

  var t=document.getElementById('course-title');
  var saved=localStorage.getItem('carneteps-title');
  if(saved&&t)t.textContent=saved;
  if(t)t.addEventListener('input',function(){localStorage.setItem('carneteps-title',t.textContent);});

  renderAll();
});

// ═══════════════════════════════════
// RENDER ALL
// ═══════════════════════════════════
function renderAll(){
  var groups=getGroups();
  var emptyEl=document.getElementById('hero-section');
  var nb=document.getElementById('notebook');
  var mt=document.getElementById('mode-tabs');

  var hdr=document.querySelector('.top-header');
  if(groups.length===0){
    if(emptyEl)emptyEl.classList.remove('hidden');
    if(nb)nb.style.display='none';
    if(mt)mt.style.display='none';
    if(hdr)hdr.style.display='none';
    return;
  }
  if(emptyEl)emptyEl.classList.add('hidden');
  if(nb)nb.style.display='';
  if(mt)mt.style.display='';
  if(hdr)hdr.style.display='';

  if(!_groupId||!groups.find(function(g){return g.id===_groupId;})){
    _groupId=groups[0].id;
  }

  renderGroupTabs();
  renderDateSelect();
  setActiveMode(_mode);
  renderContent();
}

// ═══════════════════════════════════
// GROUP TABS (RIGHT)
// ═══════════════════════════════════
function renderGroupTabs(){
  var c=document.getElementById('group-tabs');if(!c)return;
  var groups=getGroups();
  var html='';
  groups.forEach(function(g){
    var color=g.color||'cyan';
    var active=g.id===_groupId?' active':'';
    var lbl=g.name.length>10?g.name.substring(0,9)+'..':g.name;
    html+='<div class="group-tab gt-'+color+active+'" onclick="selectGroup(\''+g.id+'\')" title="'+esc(g.name)+'" ondblclick="event.stopPropagation();editGroup(\''+g.id+'\')">';
    html+=esc(lbl);
    html+='<span class="gt-edit">✏️</span>';
    html+='</div>';
  });
  c.innerHTML=html;
}

function selectGroup(id){
  _groupId=id;localStorage.setItem('carneteps-lastgroup',id);
  stopAllChronos();renderAll();
}

// ═══════════════════════════════════
// DATE
// ═══════════════════════════════════
function renderDateSelect(){
  var sel=document.getElementById('date-select');if(!sel)return;
  var dates=getAvailableDates().sort().reverse();
  var html='';
  dates.forEach(function(d){
    var lbl=d===todayStr()?"Aujourd'hui":d;
    html+='<option value="'+d+'"'+(d===_sessionDate?' selected':'')+'>'+lbl+'</option>';
  });
  sel.innerHTML=html;
}
function getAvailableDates(){
  var d=getData(),dates={};
  if(d[_groupId])Object.keys(d[_groupId]).forEach(function(dt){dates[dt]=true;});
  dates[todayStr()]=true;
  return Object.keys(dates);
}
function onDateChange(){_sessionDate=document.getElementById('date-select').value;stopAllChronos();renderContent();}
function prevDate(){
  var dates=getAvailableDates().sort(),i=dates.indexOf(_sessionDate);
  if(i>0){_sessionDate=dates[i-1];document.getElementById('date-select').value=_sessionDate;stopAllChronos();renderContent();}
}
function nextDate(){
  var dates=getAvailableDates().sort(),i=dates.indexOf(_sessionDate);
  if(i<dates.length-1){_sessionDate=dates[i+1];document.getElementById('date-select').value=_sessionDate;stopAllChronos();renderContent();}
}

// ═══════════════════════════════════
// MODE SWITCHING
// ═══════════════════════════════════
function switchMode(m){_mode=m;localStorage.setItem('carneteps-mode',m);setActiveMode(m);renderContent();}
function setActiveMode(m){
  document.querySelectorAll('.mtab').forEach(function(t){t.classList.toggle('active',t.getAttribute('data-mode')===m);});
}

// ═══════════════════════════════════
// RENDER CONTENT (dispatch by mode)
// ═══════════════════════════════════
function renderContent(){
  var area=document.getElementById('content-area');
  var toolbar=document.getElementById('today-toolbar');
  var critbar=document.getElementById('criteria-bar');
  if(!area)return;

  // Show/hide toolbars
  toolbar.classList.toggle('hidden',_mode!=='aujourdhui');
  critbar.classList.toggle('hidden',_mode!=='evaluation');

  switch(_mode){
    case 'aujourdhui': renderTodayToolbar(); renderTodayCards(area); break;
    case 'evaluation': renderCriteriaBar(); renderEvalTable(area); break;
    case 'chrono': renderChronoTable(area); break;
    case 'compteur': renderCounterTable(area); break;
    case 'resume': renderResume(area); break;
  }
}

// ═══════════════════════════════════
// GET ACTIVE TODAY ITEMS
// ═══════════════════════════════════
function getActiveTodayItems(){
  var toggles=getTodayToggles();
  var items=TODAY_DEFAULTS.map(function(d){
    var on=d.on;
    if(toggles&&toggles[d.key]!==undefined)on=toggles[d.key];
    return {key:d.key,label:d.label,type:d.type,on:on};
  });
  // Add custom criteria
  var custom=getCustomCriteria();
  custom.forEach(function(c){
    var on=true;
    if(toggles&&toggles[c.key]!==undefined)on=toggles[c.key];
    items.push({key:c.key,label:c.label,type:c.type||'stars',on:on});
  });
  return items;
}

function toggleTodayItem(key){
  var toggles=getTodayToggles()||{};
  var items=getActiveTodayItems();
  var item=items.find(function(i){return i.key===key;});
  if(item)toggles[key]=!item.on;
  setTodayToggles(toggles);
  renderContent();
}

// ═══════════════════════════════════
// TODAY TOOLBAR (what to observe)
// ═══════════════════════════════════
function renderTodayToolbar(){
  var container=document.getElementById('today-checks');if(!container)return;
  var items=getActiveTodayItems();
  var html='';
  items.forEach(function(item){
    html+='<button class="today-chip'+(item.on?' on':'')+'" onclick="toggleTodayItem(\''+item.key+'\')">'+esc(item.label)+'</button>';
  });
  container.innerHTML=html;
}

// ═══════════════════════════════════
// MODE 1: AUJOURD'HUI — CARD GRID
// ═══════════════════════════════════
function renderTodayCards(area){
  var group=getGroups().find(function(g){return g.id===_groupId;});
  if(!group){area.innerHTML='';return;}

  var items=getActiveTodayItems().filter(function(i){return i.on;});
  var photos=getPhotos();
  var voice=getVoice();
  var gv=(voice[_groupId]&&voice[_groupId][_sessionDate])||{};
  var color=group.color||'cyan';

  var html='<div class="card-grid">';
  group.students.forEach(function(s,i){
    var photoSrc=photos[s.id];
    var hasVoice=!!gv[s.id];

    html+='<div class="scard" data-color="'+color+'">';
    var isSttActive=!!_sttRecognitions[s.id];
    html+='<button class="scard-voice'+(hasVoice?' has-note':'')+(isSttActive?' stt-active':'')+'" onclick="toggleVoiceNote(\''+s.id+'\')" oncontextmenu="event.preventDefault();startStt(\''+s.id+'\')" title="Clic=audio, Clic droit=texte">'+(isSttActive?'✍️':hasVoice?'🔊':'🎙️')+'</button>';

    // Header
    html+='<div class="scard-head">';
    html+='<div class="scard-avatar" onclick="addPhoto(\''+s.id+'\')">';
    html+=(photoSrc?'<img src="'+photoSrc+'" />':'👤');
    html+='</div>';
    html+='<div class="scard-name">'+esc(s.name)+renderSparkline(s.id)+'</div>';
    html+='<div class="scard-num">'+(i+1)+'</div>';
    html+='</div>';

    // Body — active items
    html+='<div class="scard-body">';
    items.forEach(function(item){
      html+=renderCardItem(s.id,item);
    });
    // Color evaluation buttons
    html+=renderColorEvalButtons(s.id);
    // STT note display
    var sttNote=getSttNote(s.id);
    if(sttNote)html+='<div class="stt-text">📝 '+esc(sttNote)+'</div>';
    html+='</div>';

    // Color strip at bottom
    var colorEv=getColorEval(s.id);
    if(colorEv)html+='<div class="scard-color-strip strip-'+colorEv+'"></div>';

    html+='</div>';
  });
  html+='</div>';
  area.innerHTML=html;
}

function renderCardItem(sid,item){
  var html='<div class="scard-row">';
  html+='<span class="scard-label">'+esc(item.label)+'</span>';

  if(item.type==='presence'){
    var v=getVal(sid,'check_presence')||'';
    html+='<div class="scard-btns">';
    html+=tbtn(sid,'presence','present','P',v);
    html+=tbtn(sid,'presence','absent','A',v);
    html+=tbtn(sid,'presence','retard','R',v);
    html+='</div>';
  } else if(item.type==='yesno'){
    var v=getVal(sid,'check_'+item.key)||'';
    html+='<div class="scard-btns">';
    html+=tbtn(sid,item.key,'oui','✓',v);
    html+=tbtn(sid,item.key,'non','✗',v);
    html+='</div>';
  } else if(item.type==='badge'){
    var pos=getVal(sid,'obs_'+item.key+'_pos')||0;
    var neg=getVal(sid,'obs_'+item.key+'_neg')||0;
    html+='<div class="scard-obs">';
    html+='<button class="obs-btn obs-plus" onclick="addObs(\''+sid+'\',\''+item.key+'\',1)">+1</button>';
    html+='<span class="obs-val" style="color:var(--green-dk);">+'+pos+'</span>';
    html+='<span class="obs-val" style="color:var(--red);">−'+neg+'</span>';
    html+='<button class="obs-btn obs-minus" onclick="addObs(\''+sid+'\',\''+item.key+'\',-1)">−1</button>';
    html+='</div>';
  } else if(item.type==='stars'){
    var v=getVal(sid,'eval_'+item.key);
    if(v===undefined && item.default) v=item.default;
    v=v||0;
    html+='<div class="scard-stars">';
    for(var i=1;i<=5;i++){
      html+='<button class="scard-star'+(i<=v?' on':'')+'" onclick="setEval(\''+sid+'\',\''+item.key+'\','+i+')">⭐</button>';
    }
    html+='</div>';
  } else if(item.type==='grade'){
    var v=getVal(sid,'grade_'+item.key)||'';
    var cls=v?'g-'+v:'g-empty';
    html+='<button class="grade-btn '+cls+'" onclick="cycleGrade(\''+sid+'\',\''+item.key+'\')">'+(v||'—')+'</button>';
  }

  html+='</div>';
  return html;
}

function tbtn(sid,key,state,label,curVal){
  var cls='tbtn '+(curVal===state?'tbtn-'+state[0]:'tbtn-off');
  return '<button class="'+cls+'" onclick="setCheck(\''+sid+'\',\''+key+'\',\''+state+'\')">'+label+'</button>';
}

function setCheck(sid,key,val){
  var cur=getVal(sid,'check_'+key);
  setVal(sid,'check_'+key,cur===val?'':val);
  renderContent();
}
function setEval(sid,key,val){
  var cur=getVal(sid,'eval_'+key)||0;
  setVal(sid,'eval_'+key,cur===val?0:val);
  renderContent();
}
function addObs(sid,key,amount){
  var k=amount>0?'obs_'+key+'_pos':'obs_'+key+'_neg';
  var val=getVal(sid,k)||0;
  setVal(sid,k,Math.max(0,val+1));
  renderContent();
}
function cycleGrade(sid,key){
  var cur=getVal(sid,'grade_'+key)||'';
  var idx=SCALE.indexOf(cur);
  setVal(sid,'grade_'+key,idx<0?SCALE[0]:(idx>=SCALE.length-1?'':SCALE[idx+1]));
  renderContent();
}

// ═══════════════════════════════════
// MODE 2: ÉVALUATION — TABLE LIST
// ═══════════════════════════════════
function renderCriteriaBar(){
  var bar=document.getElementById('criteria-bar');if(!bar)return;
  var group=getGroups().find(function(g){return g.id===_groupId;});

  // Ligne 1: nom du groupe centré + bouton critères
  var html='<div class="crit-bar-top">';
  html+='<span class="crit-group-name">'+esc(group?group.name:'')+'</span>';
  html+='<button class="today-add-btn" onclick="openCriteriaManager()">📝 CRITÈRES</button>';
  html+='</div>';

  // Ligne 2: onglets des moyens d'action évalués (un par date avec données)
  var dates=getAvailableDates().sort();
  var evalLabels=getEvalLabels();
  var gLabels=(evalLabels[_groupId])||{};
  var evalDates=[];
  dates.forEach(function(dt){
    var label=gLabels[dt]||'';
    var d=getData();
    var hasData=d[_groupId]&&d[_groupId][dt]&&Object.keys(d[_groupId][dt]).length>0;
    if(label||hasData) evalDates.push({date:dt,label:label});
  });

  html+='<div class="crit-bar-tabs">';
  evalDates.forEach(function(ed){
    var isCurrent=ed.date===_sessionDate;
    var tabLabel=ed.label||ed.date;
    html+='<button class="crit-tab'+(isCurrent?' crit-tab-active':'')+'" onclick="switchEvalDate(\''+ed.date+'\')" ondblclick="editEvalTab(\''+ed.date+'\')" title="'+ed.date+' — Double-cliquer pour renommer">';
    html+=esc(tabLabel);
    html+='</button>';
  });
  // New eval button
  if(!evalDates.find(function(ed){return ed.date===_sessionDate;})){
    html+='<button class="crit-tab crit-tab-active" ondblclick="editEvalTab(\''+_sessionDate+'\')" title="Double-cliquer pour nommer">+ Nouvelle éval.</button>';
  }
  html+='</div>';

  bar.innerHTML=html;
}

function switchEvalDate(date){
  _sessionDate=date;
  document.getElementById('date-select').value=date;
  renderContent();
}

function editEvalTab(date){
  var cur=getEvalLabel(_groupId,date)||'';
  var val=prompt('Nom du moyen d\'action évalué :',cur);
  if(val!==null){
    setEvalLabel(_groupId,date,val.trim());
    renderContent();
  }
}

function onEvalLabelChange(val){
  setEvalLabel(_groupId,_sessionDate,val.trim());
  renderCriteriaBar();
}

function getAllEvalCriteria(){
  // PFEQ items selected by the teacher
  var selected=getPfeqSelected();
  var items=[];
  selected.forEach(function(key){
    PFEQ_COMPETENCES.forEach(function(comp){
      comp.items.forEach(function(it){
        if(it.key===key){items.push({key:'pfeq_'+it.key,label:it.label,type:'grade',_source:'pfeq',_pfeqKey:it.key});}
      });
    });
  });
  // Custom criteria
  var custom=getCustomCriteria();
  custom.forEach(function(c,i){items.push({key:'eval_'+c.key,label:c.label,type:c.type||'stars',_source:'custom',_customIdx:i});});
  return items;
}

function removeEvalCriterion(key,source){
  if(source==='pfeq'){
    // Remove from PFEQ selected
    var pfeqKey=key.replace('pfeq_','');
    var selected=getPfeqSelected();
    var idx=selected.indexOf(pfeqKey);
    if(idx>=0){selected.splice(idx,1);setPfeqSelected(selected);}
  } else if(source==='custom'){
    // Remove from custom criteria by matching key
    var cKey=key.replace('eval_','');
    var custom=getCustomCriteria();
    custom=custom.filter(function(c){return c.key!==cKey;});
    setCustomCriteria(custom);
  }
  renderContent();
}

function renderEvalTable(area){
  var group=getGroups().find(function(g){return g.id===_groupId;});
  if(!group){area.innerHTML='';return;}

  var items=getAllEvalCriteria();
  if(!items.length){
    area.innerHTML='<div style="text-align:center;padding:40px 20px;"><div style="font-size:3rem;margin-bottom:12px;">📝</div><div style="font-family:Bangers;font-size:1.4rem;color:#666;letter-spacing:1px;">AUCUN CRITÈRE SÉLECTIONNÉ</div><div style="font-size:1rem;color:#999;margin:8px 0 16px;">Ajoute des critères PFEQ ou personnalisés pour commencer l\'évaluation.</div><button class="export-btn export-pdf" onclick="openCriteriaManager()" style="font-size:1.1rem;">📝 CHOISIR MES CRITÈRES</button></div>';
    return;
  }
  var voice=getVoice();
  var gv=(voice[_groupId]&&voice[_groupId][_sessionDate])||{};
  var color=group.color||'cyan';
  var nCols=items.length;

  var html='<table class="eval-table" id="eval-table-main">';

  // Colgroup for resizable columns
  html+='<colgroup>';
  html+='<col class="col-eleve" />';
  for(var c=0;c<nCols;c++) html+='<col class="col-crit" />';
  html+='<col class="col-actions" />';
  html+='</colgroup>';

  // THEAD row 1: criteria names + ✕ + add button
  html+='<thead><tr>';
  html+='<th class="th-eleve" rowspan="1">ÉLÈVE</th>';
  items.forEach(function(c,idx){
    html+='<th draggable="true" class="th-draggable th-resizable" data-crit-idx="'+idx+'" ondragstart="onCritDragStart(event,'+idx+')" ondragover="onCritDragOver(event)" ondrop="onCritDrop(event,'+idx+')">';
    html+='<div class="th-crit">';
    html+='<span>'+esc(c.label)+'</span>';
    html+='<button class="th-remove" onclick="removeEvalCriterion(\''+c.key+'\',\''+c._source+'\')" title="Retirer">✕</button>';
    html+='</div>';
    html+='<div class="th-resize-handle" onmousedown="startColResize(event,'+idx+')"></div>';
    html+='</th>';
  });
  html+='<th class="th-actions"><button class="th-add-btn" onclick="openCriteriaManager()" title="Ajouter un critère">+</button> 🎙️</th>';
  html+='</tr></thead><tbody>';

  group.students.forEach(function(s,i){
    var hasVoice=!!gv[s.id];
    html+='<tr class="row-'+color+'">';
    var colorEv=getColorEval(s.id);
    var colorBg=colorEv?'background:'+COLOR_EVAL_HEX[colorEv]+'22;':'';
    html+='<td class="td-eleve" style="'+colorBg+'"><div class="sid-cell">';
    html+='<span class="sid-num">'+(i+1)+'</span>';
    if(colorEv)html+='<span class="spark-dot sd-'+colorEv+'" style="flex-shrink:0;" title="'+esc(getColorMeanings()[colorEv])+'"></span>';
    html+='<span class="sid-photo" title="Photo">👤</span>';
    html+='<span class="sid-name">'+esc(s.name)+'</span>';
    html+=renderSparkline(s.id);
    html+='</div></td>';

    items.forEach(function(c){
      html+='<td>';
      if(c.type==='grade'){
        var v=getVal(s.id,c.key)||'';
        var cls=v?'g-'+v:'g-empty';
        html+='<button class="grade-btn '+cls+'" onclick="cycleEvalGrade(\''+s.id+'\',\''+c.key+'\')"> '+(v||'—')+'</button>';
      } else if(c.type==='stars'){
        var v=getVal(s.id,c.key)||0;
        html+='<div class="stars-cell">';
        for(var j=1;j<=5;j++){
          html+='<button class="scard-star'+(j<=v?' on':'')+'" onclick="setEvalVal(\''+s.id+'\',\''+c.key+'\','+j+')">⭐</button>';
        }
        html+='</div>';
      } else if(c.type==='check'){
        var v=getVal(s.id,c.key)||'';
        html+='<div class="scard-btns">';
        html+=evalTbtn(s.id,c.key,'oui','✓',v);
        html+=evalTbtn(s.id,c.key,'non','✗',v);
        html+='</div>';
      } else if(c.type==='badge'){
        var pos=getVal(s.id,c.key+'_pos')||0;
        var neg=getVal(s.id,c.key+'_neg')||0;
        html+='<div class="scard-obs">';
        html+='<button class="obs-btn obs-plus" onclick="addEvalObs(\''+s.id+'\',\''+c.key+'\',1)" style="width:28px;height:28px;font-size:0.85rem;">+</button>';
        html+='<span class="obs-val" style="font-size:0.9rem;">'+pos+'</span>';
        html+='<span class="obs-val" style="font-size:0.9rem;color:var(--red);">'+neg+'</span>';
        html+='<button class="obs-btn obs-minus" onclick="addEvalObs(\''+s.id+'\',\''+c.key+'\',-1)" style="width:28px;height:28px;font-size:0.85rem;">−</button>';
        html+='</div>';
      }
      html+='</td>';
    });

    html+='<td class="td-actions"><button class="voice-btn'+(hasVoice?' has-note':'')+'" onclick="toggleVoiceNote(\''+s.id+'\')">'+(hasVoice?'🔊':'🎙️')+'</button></td>';
    html+='</tr>';
  });

  html+='</tbody></table>';
  area.innerHTML=html;
}

// Column resize by dragging
var _resizeCol=null,_resizeStartX=0,_resizeStartW=0;
function startColResize(e,colIdx){
  e.preventDefault();e.stopPropagation();
  var table=document.getElementById('eval-table-main');if(!table)return;
  var cols=table.querySelectorAll('colgroup col.col-crit');
  if(!cols[colIdx])return;
  var th=table.querySelectorAll('thead th.th-draggable')[colIdx];
  _resizeCol=cols[colIdx];
  _resizeStartX=e.clientX;
  _resizeStartW=th.offsetWidth;
  document.addEventListener('mousemove',doColResize);
  document.addEventListener('mouseup',stopColResize);
}
function doColResize(e){
  if(!_resizeCol)return;
  var diff=e.clientX-_resizeStartX;
  var newW=Math.max(80,_resizeStartW+diff);
  _resizeCol.style.width=newW+'px';
}
function stopColResize(){
  _resizeCol=null;
  document.removeEventListener('mousemove',doColResize);
  document.removeEventListener('mouseup',stopColResize);
}

// Drag-and-drop criteria columns reorder
var _dragCritIdx=null;
function onCritDragStart(e,idx){_dragCritIdx=idx;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',idx);}
function onCritDragOver(e){e.preventDefault();e.dataTransfer.dropEffect='move';}
function onCritDrop(e,targetIdx){
  e.preventDefault();
  if(_dragCritIdx===null||_dragCritIdx===targetIdx)return;
  // Reorder: move item from _dragCritIdx to targetIdx
  // We need to reorder both pfeq and custom lists
  var items=getAllEvalCriteria();
  if(_dragCritIdx<0||_dragCritIdx>=items.length||targetIdx<0||targetIdx>=items.length)return;

  // Build combined ordered key list
  var ordered=items.map(function(c){return{source:c._source,key:c._source==='pfeq'?c._pfeqKey:c.key.replace('eval_','')};});
  var moved=ordered.splice(_dragCritIdx,1)[0];
  ordered.splice(targetIdx,0,moved);

  // Rebuild pfeq and custom lists from new order
  var newPfeq=[];
  var newCustom=[];
  var oldCustom=getCustomCriteria();
  ordered.forEach(function(o){
    if(o.source==='pfeq'){newPfeq.push(o.key);}
    else{
      var found=oldCustom.find(function(c){return c.key===o.key;});
      if(found)newCustom.push(found);
    }
  });
  setPfeqSelected(newPfeq);
  setCustomCriteria(newCustom);
  _dragCritIdx=null;
  renderContent();
}

function cycleEvalGrade(sid,key){
  var cur=getVal(sid,key)||'';
  var idx=SCALE.indexOf(cur);
  setVal(sid,key,idx<0?SCALE[0]:(idx>=SCALE.length-1?'':SCALE[idx+1]));
  renderContent();
}
function setEvalVal(sid,key,val){
  var cur=getVal(sid,key)||0;
  setVal(sid,key,cur===val?0:val);
  renderContent();
}
function evalTbtn(sid,key,state,label,curVal){
  var cls='tbtn '+(curVal===state?'tbtn-'+state[0]:'tbtn-off');
  return '<button class="'+cls+'" onclick="setEvalCheck(\''+sid+'\',\''+key+'\',\''+state+'\')">'+label+'</button>';
}
function setEvalCheck(sid,key,val){
  var cur=getVal(sid,key);
  setVal(sid,key,cur===val?'':val);
  renderContent();
}
function addEvalObs(sid,key,amount){
  var k=amount>0?key+'_pos':key+'_neg';
  var val=getVal(sid,k)||0;
  setVal(sid,k,Math.max(0,val+1));
  renderContent();
}

// ═══════════════════════════════════
// MODE 3: CHRONO
// ═══════════════════════════════════
function renderChronoTable(area){
  var group=getGroups().find(function(g){return g.id===_groupId;});
  if(!group){area.innerHTML='';return;}
  var color=group.color||'cyan';

  // Global chrono display
  var gc=_chronos['_global']||{running:false,elapsed:0};
  var globalDisplay=formatTime(gc.running?(gc.elapsed+(Date.now()-gc.startTime)):gc.elapsed);
  var isRunning=gc.running;

  var html='<div style="display:flex;align-items:center;justify-content:center;gap:12px;padding:10px;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);">';
  html+='<span style="font-family:Bangers;font-size:2.2rem;color:#fff;letter-spacing:2px;" id="chrono-_global">'+globalDisplay+'</span>';
  if(!isRunning){
    html+='<button class="chrono-btn c-start" onclick="chronoStartAll()" style="font-size:1.1rem;padding:8px 20px;">▶ START TOUS</button>';
  } else {
    html+='<button class="chrono-btn c-stop" onclick="chronoStopAll()" style="font-size:1.1rem;padding:8px 20px;">⏸ STOP TOUS</button>';
  }
  html+='<button class="chrono-btn c-reset" onclick="chronoResetAll()" style="font-size:1.1rem;padding:8px 16px;">↺ RESET</button>';
  html+='</div>';

  // Find max laps for column headers
  var maxLaps=0;
  group.students.forEach(function(s){
    var laps=_chronos['laps_'+s.id]||[];
    if(laps.length>maxLaps)maxLaps=laps.length;
  });
  var displayCols=Math.max(maxLaps,3); // minimum 3 columns visible

  // Per-student laps in labeled columns
  html+='<table class="eval-table"><thead><tr><th>ÉLÈVE</th><th>🏁 LAP</th>';
  for(var c=1;c<=displayCols;c++){
    html+='<th>Tour '+c+'</th>';
  }
  html+='</tr></thead><tbody>';

  group.students.forEach(function(s,i){
    var laps=_chronos['laps_'+s.id]||[];

    html+='<tr class="row-'+color+'">';
    html+='<td><div class="sid-cell"><span class="sid-num">'+(i+1)+'</span><span class="sid-name">'+esc(s.name)+'</span></div></td>';

    // Lap button
    html+='<td style="text-align:center;">';
    if(isRunning){
      html+='<button class="chrono-btn c-lap" onclick="chronoLapStudent(\''+s.id+'\')" style="font-size:1rem;padding:6px 16px;">🏁 TOUR!</button>';
    } else {
      html+='<span style="color:#999;">—</span>';
    }
    html+='</td>';

    // One cell per tour column
    for(var c=0;c<displayCols;c++){
      html+='<td style="text-align:center;font-family:Bangers;font-size:0.95rem;">';
      if(c<laps.length){
        var prev=c>0?laps[c-1]:0;
        var split=laps[c]-prev;
        html+='<div style="line-height:1.3;">'+formatTime(laps[c])+'</div>';
        html+='<div style="font-size:0.75rem;color:#666;font-family:sans-serif;">('+formatTime(split)+')</div>';
      } else {
        html+='<span style="color:#ccc;">—</span>';
      }
      html+='</td>';
    }
    html+='</tr>';
  });
  html+='</tbody></table>';
  area.innerHTML=html;
  updateAllChronoDisplays();
}

// Global chrono for all students
function chronoStartAll(){
  if(!_chronos['_global'])_chronos['_global']={running:false,elapsed:0};
  _chronos['_global'].running=true;
  _chronos['_global'].startTime=Date.now();
  startChronoTick();
  renderContent();
}

function chronoStopAll(){
  var gc=_chronos['_global'];
  if(gc&&gc.running){gc.elapsed+=Date.now()-gc.startTime;gc.running=false;}
  // Save final time for all students
  var group=getGroups().find(function(g){return g.id===_groupId;});
  if(group&&gc){
    group.students.forEach(function(s){setVal(s.id,'chrono_time',gc.elapsed);});
  }
  renderContent();
}

function chronoResetAll(){
  _chronos['_global']={running:false,elapsed:0};
  var group=getGroups().find(function(g){return g.id===_groupId;});
  if(group){
    group.students.forEach(function(s){
      _chronos['laps_'+s.id]=[];
      setVal(s.id,'chrono_time',0);
      setVal(s.id,'chrono_laps',[]);
    });
  }
  renderContent();
}

function chronoLapStudent(sid){
  var gc=_chronos['_global'];
  if(!gc||!gc.running)return;
  var currentTime=gc.elapsed+(Date.now()-gc.startTime);
  if(!_chronos['laps_'+sid])_chronos['laps_'+sid]=[];
  _chronos['laps_'+sid].push(currentTime);
  setVal(sid,'chrono_laps',_chronos['laps_'+sid].map(formatTime));
  renderContent();
}

function formatTime(ms){var s=Math.floor(ms/1000),m=Math.floor(s/60);s%=60;var t=Math.floor((ms%1000)/100);return(m<10?'0':'')+m+':'+(s<10?'0':'')+s+'.'+t;}
function stopAllChronos(){var gc=_chronos['_global'];if(gc&&gc.running){gc.elapsed+=Date.now()-gc.startTime;gc.running=false;}}
var _chronoTick=null;
function startChronoTick(){if(_chronoTick)return;_chronoTick=setInterval(updateAllChronoDisplays,100);}
function updateAllChronoDisplays(){
  var gc=_chronos['_global'];
  if(gc&&gc.running){
    var el=document.getElementById('chrono-_global');
    if(el)el.textContent=formatTime(gc.elapsed+(Date.now()-gc.startTime));
  } else if(_chronoTick){clearInterval(_chronoTick);_chronoTick=null;}
}

// ═══════════════════════════════════
// MODE 4: COMPTEUR
// ═══════════════════════════════════
function renderCounterTable(area){
  var group=getGroups().find(function(g){return g.id===_groupId;});
  if(!group){area.innerHTML='';return;}
  var color=group.color||'cyan';

  var html='<table class="eval-table"><thead><tr><th>ÉLÈVE</th>';
  COUNTER_ITEMS.forEach(function(c){html+='<th>'+c.label+'</th>';});
  html+='</tr></thead><tbody>';

  group.students.forEach(function(s,i){
    html+='<tr class="row-'+color+'">';
    html+='<td><div class="sid-cell"><span class="sid-num">'+(i+1)+'</span><span class="sid-name">'+esc(s.name)+'</span></div></td>';
    COUNTER_ITEMS.forEach(function(c){
      var v=getVal(s.id,'num_'+c.key)||0;
      html+='<td><div class="counter-cell">';
      html+='<button class="ctr-btn ctr-minus" onclick="addNum(\''+s.id+'\',\''+c.key+'\',-1)">−</button>';
      html+='<span class="ctr-val">'+v+'</span>';
      html+='<button class="ctr-btn ctr-plus" onclick="addNum(\''+s.id+'\',\''+c.key+'\',1)">+</button>';
      html+='</div></td>';
    });
    html+='</tr>';
  });
  html+='</tbody></table>';
  area.innerHTML=html;
}
function addNum(sid,key,amount){var v=getVal(sid,'num_'+key)||0;setVal(sid,'num_'+key,Math.max(0,v+amount));renderContent();}

// ═══════════════════════════════════
// MODE 5: RÉSUMÉ
// ═══════════════════════════════════
function renderResume(area){
  var group=getGroups().find(function(g){return g.id===_groupId;});
  if(!group){area.innerHTML='';return;}

  var dates=getAvailableDates().sort().reverse();

  var html='<div class="resume-wrap">';

  // Dates
  html+='<div class="resume-section"><h3>📅 JOURNÉES ('+dates.length+')</h3><ul class="resume-list">';
  dates.forEach(function(d){
    var lbl=d===todayStr()?"Aujourd'hui — "+d:d;
    var cur=d===_sessionDate;
    html+='<li'+(cur?' style="font-weight:bold;background:rgba(0,212,255,0.1);"':'')+'>';
    html+='<button class="tbtn'+(cur?' tbtn-p':' tbtn-off')+'" onclick="_sessionDate=\''+d+'\';document.getElementById(\'date-select\').value=\''+d+'\';renderContent();" style="font-size:0.8rem;padding:3px 10px;">'+lbl+'</button>';
    html+='</li>';
  });
  html+='</ul></div>';

  // Summary for current date
  html+='<div class="resume-section"><h3>📋 RÉSUMÉ — '+(_sessionDate===todayStr()?"AUJOURD'HUI":_sessionDate)+'</h3>';
  var pres=0,abs=0,ret=0;
  group.students.forEach(function(s){var v=getVal(s.id,'check_presence')||'';if(v==='present')pres++;else if(v==='absent')abs++;else if(v==='retard')ret++;});
  html+='<p style="margin:6px 0;">☑️ <strong>Présences:</strong> <span class="resume-badge" style="background:var(--green);">'+pres+' P</span> <span class="resume-badge" style="background:var(--red);color:#fff;">'+abs+' A</span> <span class="resume-badge" style="background:var(--orange);">'+ret+' R</span> / '+group.students.length+'</p>';
  html+='</div>';

  // Per student detail
  html+='<div class="resume-section"><h3>👥 DÉTAIL PAR ÉLÈVE</h3><ul class="resume-list">';
  group.students.forEach(function(s,i){
    var p=getVal(s.id,'check_presence')||'';
    var details=[];
    if(p){var bg=p==='present'?'var(--green)':p==='absent'?'var(--red)':'var(--orange)';var col=p==='absent'?'#fff':'#000';details.push('<span class="resume-badge" style="background:'+bg+';color:'+col+';">'+p.charAt(0).toUpperCase()+'</span>');}

    // Collect all eval/obs data
    var allItems=getActiveTodayItems().filter(function(x){return x.on;});
    allItems.forEach(function(item){
      if(item.type==='stars'){var v=getVal(s.id,'eval_'+item.key);if(v)details.push(item.label+':'+v+'★');}
      if(item.type==='badge'){var pos=getVal(s.id,'obs_'+item.key+'_pos')||0;var neg=getVal(s.id,'obs_'+item.key+'_neg')||0;if(pos||neg)details.push(item.label+':<span style="color:var(--green-dk);">+'+pos+'</span>/<span style="color:var(--red);">−'+neg+'</span>');}
    });

    // Show selected PFEQ criteria in resume
    getPfeqSelected().forEach(function(key){
      var v=getVal(s.id,'pfeq_'+key);
      if(v) details.push(key.replace(/_/g,' ')+':'+v);
    });

    html+='<li><strong>'+(i+1)+'. '+esc(s.name)+'</strong>';
    if(details.length)html+=' — '+details.join(' ');
    html+='</li>';
  });
  html+='</ul></div></div>';
  area.innerHTML=html;
}

// ═══════════════════════════════════
// VOICE NOTES
// ═══════════════════════════════════
function toggleVoiceNote(sid){
  if(_voiceRecorders[sid]){_voiceRecorders[sid].stop();return;}
  var voice=getVoice();
  var existing=voice[_groupId]&&voice[_groupId][_sessionDate]&&voice[_groupId][_sessionDate][sid];
  if(existing){new Audio(existing).play();return;}
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){toast('Micro non disponible');return;}
  navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
    var rec=new MediaRecorder(stream),chunks=[];
    rec.ondataavailable=function(e){chunks.push(e.data);};
    rec.onstop=function(){stream.getTracks().forEach(function(t){t.stop();});var blob=new Blob(chunks,{type:'audio/webm'});var reader=new FileReader();reader.onloadend=function(){var v=getVoice();if(!v[_groupId])v[_groupId]={};if(!v[_groupId][_sessionDate])v[_groupId][_sessionDate]={};v[_groupId][_sessionDate][sid]=reader.result;setVoice(v);delete _voiceRecorders[sid];toast('Note vocale sauvegardée!');renderContent();};reader.readAsDataURL(blob);};
    rec.start();_voiceRecorders[sid]=rec;
    setTimeout(function(){if(_voiceRecorders[sid])_voiceRecorders[sid].stop();},10000);
    toast('Enregistrement... (10s)');
  }).catch(function(){toast('Accès micro refusé');});
}

// ═══════════════════════════════════
// PHOTO
// ═══════════════════════════════════
function addPhoto(sid){
  var input=document.createElement('input');input.type='file';input.accept='image/*';input.capture='environment';
  input.onchange=function(){var file=input.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(e){var img=new Image();img.onload=function(){var c=document.createElement('canvas'),sz=120;c.width=sz;c.height=sz;var ctx=c.getContext('2d');var mn=Math.min(img.width,img.height);ctx.drawImage(img,(img.width-mn)/2,(img.height-mn)/2,mn,mn,0,0,sz,sz);var photos=getPhotos();photos[sid]=c.toDataURL('image/jpeg',0.7);setPhotos(photos);renderContent();};img.src=e.target.result;};reader.readAsDataURL(file);};
  input.click();
}

// ═══════════════════════════════════
// ZOOM
// ═══════════════════════════════════
function applyZoom(){document.documentElement.style.fontSize=(_zoomLevel/100*15)+'px';var el=document.getElementById('zoom-level');if(el)el.textContent=_zoomLevel+'%';}
function zoomIn(){_zoomLevel=Math.min(200,_zoomLevel+10);localStorage.setItem('carneteps-zoom',_zoomLevel);applyZoom();}
function zoomOut(){_zoomLevel=Math.max(60,_zoomLevel-10);localStorage.setItem('carneteps-zoom',_zoomLevel);applyZoom();}

// ═══════════════════════════════════
// CUSTOM CRITERIA MANAGER
// ═══════════════════════════════════
function openCriteriaManager(){renderPfeqSections();renderCriteriaList();renderQuickCriteria();document.getElementById('criteria-modal').classList.remove('hidden');document.getElementById('new-criterion-input').focus();}
function closeCriteriaManager(){document.getElementById('criteria-modal').classList.add('hidden');renderContent();}

function renderPfeqSections(){
  var container=document.getElementById('pfeq-sections');if(!container)return;
  var selected=getPfeqSelected();
  var html='';
  PFEQ_COMPETENCES.forEach(function(comp){
    var colors={agir:'#2979FF',interagir:'#FF9100',sante:'#E91E63'};
    var color=colors[comp.key]||'#333';
    html+='<div class="pfeq-section" style="border-left:4px solid '+color+';margin-bottom:12px;padding:10px 14px;background:rgba(255,255,255,0.5);border-radius:8px;">';
    html+='<div class="pfeq-section-title" style="font-family:Bangers;font-size:1.2rem;color:'+color+';letter-spacing:1px;margin-bottom:4px;">'+comp.label+'</div>';
    html+='<div style="font-size:0.8rem;color:#666;margin-bottom:8px;">'+esc(comp.desc)+'</div>';
    comp.items.forEach(function(item){
      var checked=selected.indexOf(item.key)>=0;
      html+='<label class="pfeq-check-label" style="display:flex;align-items:center;gap:8px;padding:4px 0;cursor:pointer;font-size:0.92rem;">';
      html+='<input type="checkbox" class="pfeq-check" data-key="'+item.key+'" '+(checked?'checked':'')+' onchange="togglePfeqItem(\''+item.key+'\')" />';
      html+='<span>'+esc(item.label)+'</span>';
      html+='</label>';
    });
    html+='</div>';
  });
  container.innerHTML=html;
}

function togglePfeqItem(key){
  var selected=getPfeqSelected();
  var idx=selected.indexOf(key);
  if(idx>=0){selected.splice(idx,1);}else{selected.push(key);}
  setPfeqSelected(selected);
}

function addCustomCriterion(){
  var input=document.getElementById('new-criterion-input');
  var name=input.value.trim();if(!name)return;
  var type=document.getElementById('new-criterion-type').value;
  var criteria=getCustomCriteria();
  criteria.push({key:'c'+Date.now(),label:name,type:type});
  setCustomCriteria(criteria);
  input.value='';renderCriteriaList();toast('"'+name+'" ajouté!');
}

function addQuickCriterion(name){
  var criteria=getCustomCriteria();
  if(criteria.find(function(c){return c.label===name;})){toast('Déjà ajouté!');return;}
  criteria.push({key:'c'+Date.now(),label:name,type:'stars'});
  setCustomCriteria(criteria);renderCriteriaList();renderQuickCriteria();toast('"'+name+'" ajouté!');
}

function removeCustomCriterion(idx){var c=getCustomCriteria();c.splice(idx,1);setCustomCriteria(c);renderCriteriaList();}

function renderCriteriaList(){
  var container=document.getElementById('custom-criteria-list');if(!container)return;
  var criteria=getCustomCriteria();
  if(!criteria.length){container.innerHTML='<div class="no-crit-msg">Aucun critère. Ajoute-en!</div>';return;}
  var html='';
  var typeLabels={stars:'⭐',check:'☑️',badge:'👀 +/-',grade:'🔤 A-E'};
  criteria.forEach(function(c,i){
    html+='<div class="custom-crit-item"><span class="cn">'+(typeLabels[c.type]||'⭐')+' '+esc(c.label)+'</span><span class="ct">('+c.type+')</span>';
    html+='<button class="cx" onclick="removeCustomCriterion('+i+')">✕</button></div>';
  });
  container.innerHTML=html;
}

function renderQuickCriteria(){
  var container=document.getElementById('quick-criteria');if(!container)return;
  var existing=getCustomCriteria().map(function(c){return c.label;});
  var html='';
  QUICK_CRITERIA.forEach(function(name){
    if(existing.indexOf(name)>=0)return;
    html+='<button class="qc-btn" onclick="addQuickCriterion(\''+name+'\')">+ '+name+'</button>';
  });
  container.innerHTML=html;
}

// ═══════════════════════════════════
// GROUP MANAGEMENT
// ═══════════════════════════════════
function createGroup(){_editingGroupId=null;document.getElementById('group-modal-title').textContent='NOUVEAU GROUPE';document.getElementById('group-name-input').value='';document.getElementById('group-students-input').value='';document.getElementById('delete-group-btn').style.display='none';pickColor('cyan');document.getElementById('group-modal').classList.remove('hidden');}
function editGroup(id){var g=getGroups().find(function(g){return g.id===id;});if(!g)return;_editingGroupId=g.id;document.getElementById('group-modal-title').textContent='MODIFIER';document.getElementById('group-name-input').value=g.name;document.getElementById('group-students-input').value=g.students.map(function(s){return s.name;}).join('\n');document.getElementById('delete-group-btn').style.display='';pickColor(g.color||'cyan');document.getElementById('group-modal').classList.remove('hidden');}
function closeGroupModal(){document.getElementById('group-modal').classList.add('hidden');}
function pickColor(c){_selectedColor=c;document.querySelectorAll('.color-swatch').forEach(function(s){s.classList.toggle('active',s.getAttribute('data-color')===c);});}

function saveGroup(){
  var name=document.getElementById('group-name-input').value.trim();if(!name){toast('Nom requis!');return;}
  var lines=document.getElementById('group-students-input').value.split('\n').map(function(l){return l.trim();}).filter(function(l){return l.length>0;});
  var groups=getGroups();
  if(_editingGroupId){
    var idx=groups.findIndex(function(g){return g.id===_editingGroupId;});
    if(idx>=0){var ex=groups[idx].students;groups[idx].name=name;groups[idx].color=_selectedColor;groups[idx].students=lines.map(function(n){var f=ex.find(function(s){return s.name===n;});return f||{id:'st-'+Date.now()+'-'+Math.random().toString(36).substr(2,5),name:n};});}
  } else {
    var ng={id:'grp-'+Date.now(),name:name,color:_selectedColor,students:lines.map(function(n){return{id:'st-'+Date.now()+'-'+Math.random().toString(36).substr(2,5),name:n};})};
    groups.push(ng);_groupId=ng.id;localStorage.setItem('carneteps-lastgroup',_groupId);
  }
  setGroups(groups);closeGroupModal();toast('Sauvegardé!');renderAll();
}

function deleteCurrentGroup(){if(!confirm('Supprimer ce groupe?'))return;var groups=getGroups().filter(function(g){return g.id!==_editingGroupId;});setGroups(groups);_groupId=groups.length?groups[0].id:null;localStorage.setItem('carneteps-lastgroup',_groupId||'');closeGroupModal();toast('Supprimé!');renderAll();}

// ═══════════════════════════════════
// EXPORT PDF
// ═══════════════════════════════════
function exportPDF(){
  var group=getGroups().find(function(g){return g.id===_groupId;});if(!group)return;
  var title=document.getElementById('course-title').textContent||'Carnet EPS';
  var css='body{font-family:Arial;margin:20px;color:#1a1a1a;}h1{font-size:24px;text-align:center;margin-bottom:4px;}h2{font-size:14px;text-align:center;color:#666;margin-bottom:10px;}h3{font-size:13px;margin:12px 0 4px;border-bottom:2px solid #00D4FF;padding-bottom:3px;}table{width:100%;border-collapse:collapse;margin-bottom:10px;}th,td{border:1px solid #333;padding:4px 6px;text-align:center;font-size:11px;}th{background:#00D4FF;font-weight:bold;}tr:nth-child(even){background:#f5f5f5;}.footer{text-align:center;margin-top:16px;font-size:10px;color:#888;}';

  var html='<html><head><style>'+css+'</style></head><body>';
  html+='<h1>'+esc(title)+'</h1><h2>'+esc(group.name)+' — '+_sessionDate+'</h2>';

  // Présences
  html+='<h3>☑️ Présences</h3><table><tr><th>#</th><th>Élève</th><th>Présence</th><th>Tenue</th><th>Matériel</th></tr>';
  group.students.forEach(function(s,i){
    html+='<tr><td>'+(i+1)+'</td><td style="text-align:left;">'+esc(s.name)+'</td>';
    html+='<td>'+(getVal(s.id,'check_presence')||'—')+'</td>';
    html+='<td>'+(getVal(s.id,'check_tenue')||'—')+'</td>';
    html+='<td>'+(getVal(s.id,'check_materiel')||'—')+'</td></tr>';
  });
  html+='</table>';

  // Evaluations
  var allEval=getAllEvalCriteria();
  if(allEval.length){
    html+='<h3>⭐ Évaluations</h3><table><tr><th>#</th><th>Élève</th>';
    allEval.forEach(function(c){html+='<th>'+c.label+'</th>';});
    html+='</tr>';
    group.students.forEach(function(s,i){
      html+='<tr><td>'+(i+1)+'</td><td style="text-align:left;">'+esc(s.name)+'</td>';
      allEval.forEach(function(c){
        var v=getVal(s.id,c.key)||'—';
        html+='<td>'+v+'</td>';
      });
      html+='</tr>';
    });
    html+='</table>';
  }

  html+='<div class="footer">zonetotalsport.ca — Carnet EPS</div></body></html>';
  var win=window.open('','_blank');win.document.write(html);win.document.close();setTimeout(function(){win.print();},500);toast('PDF prêt!');
}

// ═══════════════════════════════════
// EXPORT CSV
// ═══════════════════════════════════
function exportCSV(){
  var group=getGroups().find(function(g){return g.id===_groupId;});if(!group)return;
  var allEval=getAllEvalCriteria();
  var headers=['#','Élève','Présence','Tenue','Matériel'];
  allEval.forEach(function(c){headers.push(c.label);});
  headers.push('Comport+','Comport−');
  COUNTER_ITEMS.forEach(function(c){headers.push(c.label);});
  headers.push('Chrono');

  var rows=[headers.join(',')];
  group.students.forEach(function(s,i){
    var row=[(i+1),'"'+s.name+'"',getVal(s.id,'check_presence')||'',getVal(s.id,'check_tenue')||'',getVal(s.id,'check_materiel')||''];
    allEval.forEach(function(c){row.push(getVal(s.id,c.key)||'');});
    row.push(getVal(s.id,'obs_comportement_pos')||0,getVal(s.id,'obs_comportement_neg')||0);
    COUNTER_ITEMS.forEach(function(c){row.push(getVal(s.id,'num_'+c.key)||0);});
    row.push(formatTime(getVal(s.id,'chrono_time')||0));
    rows.push(row.join(','));
  });

  var blob=new Blob(['\ufeff'+rows.join('\n')],{type:'text/csv;charset=utf-8;'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');a.href=url;a.download='carnet-eps-'+group.name.replace(/\s+/g,'-')+'-'+_sessionDate+'.csv';a.click();URL.revokeObjectURL(url);toast('CSV exporté!');
}

// ═══════════════════════════════════
// TOAST
// ═══════════════════════════════════
function toast(msg){var el=document.getElementById('toast');el.textContent=msg;el.classList.remove('hidden');clearTimeout(el._timer);el._timer=setTimeout(function(){el.classList.add('hidden');},2500);}

// ═══════════════════════════════════════════════════════
// KILLER FEATURE 1: COLOR EVALUATION SYSTEM
// ═══════════════════════════════════════════════════════
var COLOR_EVAL_COLORS = ['green','yellow','red','purple'];
var COLOR_EVAL_HEX = {green:'#4CAF50',yellow:'#FFD600',red:'#F44336',purple:'#9C27B0'};

function getColorMeanings(){
  try{return JSON.parse(localStorage.getItem('carneteps-colormeanings')||'null')||{green:'Excellent',yellow:'En progrès',red:'Difficulté',purple:'À observer'};}
  catch(e){return{green:'Excellent',yellow:'En progrès',red:'Difficulté',purple:'À observer'};}
}
function setColorMeanings(m){localStorage.setItem('carneteps-colormeanings',JSON.stringify(m));}

function getColorEval(sid){return getVal(sid,'color_eval')||'';}
function setColorEval(sid,color){
  var cur=getVal(sid,'color_eval')||'';
  setVal(sid,'color_eval',cur===color?'':color);
  renderContent();
}

function renderColorEvalButtons(sid){
  var cur=getColorEval(sid);
  var meanings=getColorMeanings();
  var html='<div class="color-eval-row">';
  COLOR_EVAL_COLORS.forEach(function(c){
    html+='<button class="color-eval-btn ce-'+c+(cur===c?' active':'')+'" onclick="setColorEval(\''+sid+'\',\''+c+'\')" title="'+esc(meanings[c])+'"></button>';
  });
  html+='</div>';
  return html;
}

function openColorSettings(){
  var m=getColorMeanings();
  document.getElementById('cm-green').value=m.green;
  document.getElementById('cm-yellow').value=m.yellow;
  document.getElementById('cm-red').value=m.red;
  document.getElementById('cm-purple').value=m.purple;
  document.getElementById('color-settings-modal').classList.remove('hidden');
}
function closeColorSettings(){document.getElementById('color-settings-modal').classList.add('hidden');}
function saveColorMeanings(){
  var m={
    green:document.getElementById('cm-green').value.trim()||'Excellent',
    yellow:document.getElementById('cm-yellow').value.trim()||'En progrès',
    red:document.getElementById('cm-red').value.trim()||'Difficulté',
    purple:document.getElementById('cm-purple').value.trim()||'À observer'
  };
  setColorMeanings(m);
  closeColorSettings();
  toast('Couleurs sauvegardées!');
  renderContent();
}

// ═══════════════════════════════════════════════════════
// KILLER FEATURE 2: RANDOM STUDENT PICKER
// ═══════════════════════════════════════════════════════
var _pickerTimer=null;
function openPicker(){
  var group=getGroups().find(function(g){return g.id===_groupId;});
  if(!group||!group.students.length){toast('Aucun élève!');return;}

  var overlay=document.getElementById('picker-overlay');
  var nameEl=document.getElementById('picker-name');
  overlay.classList.remove('hidden');
  overlay.classList.add('picker-spinning');

  var students=group.students.slice();
  var count=0;
  var total=20+Math.floor(Math.random()*10);
  var speed=50;

  clearInterval(_pickerTimer);
  _pickerTimer=setInterval(function(){
    nameEl.textContent=students[Math.floor(Math.random()*students.length)].name;
    count++;
    if(count>=total){
      clearInterval(_pickerTimer);
      var winner=students[Math.floor(Math.random()*students.length)];
      nameEl.textContent=winner.name;
      overlay.classList.remove('picker-spinning');
    }
  },speed);
}
function closePicker(){
  clearInterval(_pickerTimer);
  document.getElementById('picker-overlay').classList.add('hidden');
}

// ═══════════════════════════════════════════════════════
// KILLER FEATURE 3: TEAM GENERATOR WITH CONFLICTS
// ═══════════════════════════════════════════════════════
var _teamCount=2;
function getConflicts(){try{return JSON.parse(localStorage.getItem('carneteps-conflicts-'+_groupId)||'[]');}catch(e){return[];}}
function setConflicts(c){localStorage.setItem('carneteps-conflicts-'+_groupId,JSON.stringify(c));}

function openTeamModal(){
  var group=getGroups().find(function(g){return g.id===_groupId;});
  if(!group){toast('Aucun groupe!');return;}
  _teamCount=2;
  document.getElementById('team-count').textContent=_teamCount;
  populateConflictSelects();
  renderConflictList();
  document.getElementById('team-results').innerHTML='';
  document.getElementById('team-modal').classList.remove('hidden');
}
function closeTeamModal(){document.getElementById('team-modal').classList.add('hidden');}

function changeTeamCount(d){
  _teamCount=Math.max(2,Math.min(12,_teamCount+d));
  document.getElementById('team-count').textContent=_teamCount;
}

function populateConflictSelects(){
  var group=getGroups().find(function(g){return g.id===_groupId;});
  if(!group)return;
  var html='<option value="">— Choisir —</option>';
  group.students.forEach(function(s){html+='<option value="'+s.id+'">'+esc(s.name)+'</option>';});
  document.getElementById('conflict-a').innerHTML=html;
  document.getElementById('conflict-b').innerHTML=html;
}

function addConflict(){
  var a=document.getElementById('conflict-a').value;
  var b=document.getElementById('conflict-b').value;
  if(!a||!b||a===b){toast('Choisis 2 élèves différents');return;}
  var conflicts=getConflicts();
  if(conflicts.find(function(c){return(c[0]===a&&c[1]===b)||(c[0]===b&&c[1]===a);})){toast('Déjà ajouté!');return;}
  conflicts.push([a,b]);
  setConflicts(conflicts);
  renderConflictList();
}

function removeConflict(idx){var c=getConflicts();c.splice(idx,1);setConflicts(c);renderConflictList();}

function renderConflictList(){
  var container=document.getElementById('conflict-list');
  var conflicts=getConflicts();
  var group=getGroups().find(function(g){return g.id===_groupId;});
  if(!conflicts.length){container.innerHTML='<div style="font-size:0.85rem;color:#999;">Aucun conflit défini</div>';return;}
  var html='';
  conflicts.forEach(function(c,i){
    var nameA='?',nameB='?';
    if(group){
      var sa=group.students.find(function(s){return s.id===c[0];});
      var sb=group.students.find(function(s){return s.id===c[1];});
      if(sa)nameA=sa.name;if(sb)nameB=sb.name;
    }
    html+='<span class="conflict-tag">'+esc(nameA)+' ≠ '+esc(nameB)+' <button onclick="removeConflict('+i+')">✕</button></span>';
  });
  container.innerHTML=html;
}

function generateTeams(){
  var group=getGroups().find(function(g){return g.id===_groupId;});
  if(!group)return;
  var conflicts=getConflicts();
  var students=group.students.slice();

  // Shuffle
  for(var i=students.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=students[i];students[i]=students[j];students[j]=t;}

  var teams=[];
  for(var i=0;i<_teamCount;i++)teams.push([]);

  // Distribute with conflict avoidance (best effort)
  students.forEach(function(s){
    var bestTeam=0,bestSize=Infinity;
    for(var t=0;t<_teamCount;t++){
      var hasConflict=false;
      teams[t].forEach(function(member){
        conflicts.forEach(function(c){
          if((c[0]===s.id&&c[1]===member.id)||(c[0]===member.id&&c[1]===s.id))hasConflict=true;
        });
      });
      if(!hasConflict&&teams[t].length<bestSize){bestSize=teams[t].length;bestTeam=t;}
    }
    teams[bestTeam].push(s);
  });

  // Render results
  var teamColors=['var(--cyan)','var(--green)','var(--orange)','var(--yellow)','var(--pink)','var(--blue)','#9C27B0','#795548','#607D8B','#E91E63','#00BCD4','#8BC34A'];
  var html='';
  teams.forEach(function(team,i){
    html+='<div class="team-result-card" style="border-left:5px solid '+teamColors[i%teamColors.length]+';">';
    html+='<h4>ÉQUIPE '+(i+1)+' ('+team.length+')</h4><ul>';
    team.forEach(function(s){html+='<li>'+esc(s.name)+'</li>';});
    html+='</ul></div>';
  });
  document.getElementById('team-results').innerHTML=html;
}

// ═══════════════════════════════════════════════════════
// KILLER FEATURE 4: GAMIFIED FEEDBACK
// ═══════════════════════════════════════════════════════
function showFelicitations(){
  var overlay=document.getElementById('felicitations-overlay');
  overlay.classList.remove('hidden');
  launchConfetti();
  setTimeout(function(){overlay.classList.add('hidden');},3000);
}

function launchConfetti(){
  var container=document.getElementById('confetti-container');
  container.innerHTML='';
  var colors=['#FF4081','#FFD600','#00E676','#2979FF','#FF9100','#00D4FF','#9C27B0','#F44336'];
  for(var i=0;i<60;i++){
    var c=document.createElement('div');
    c.className='confetti';
    c.style.left=Math.random()*100+'%';
    c.style.background=colors[Math.floor(Math.random()*colors.length)];
    c.style.width=(6+Math.random()*8)+'px';
    c.style.height=(6+Math.random()*8)+'px';
    c.style.animationDuration=(1.5+Math.random()*2)+'s';
    c.style.animationDelay=(Math.random()*0.5)+'s';
    container.appendChild(c);
  }
}

var _calmeTimer=null;
function startCalme(){
  var overlay=document.getElementById('calme-overlay');
  var numEl=document.getElementById('calme-number');
  overlay.classList.remove('hidden');
  var count=5;
  numEl.textContent=count;
  clearInterval(_calmeTimer);
  _calmeTimer=setInterval(function(){
    count--;
    if(count<=0){
      clearInterval(_calmeTimer);
      numEl.textContent='✓';
      setTimeout(function(){overlay.classList.add('hidden');},1200);
    } else {
      numEl.textContent=count;
    }
  },1000);
}

// ═══════════════════════════════════════════════════════
// KILLER FEATURE 5: VOICE-TO-TEXT (Speech Recognition)
// ═══════════════════════════════════════════════════════
function getSttNotes(){try{return JSON.parse(localStorage.getItem('carneteps-stt')||'{}');}catch(e){return{};}}
function setSttNotes(n){localStorage.setItem('carneteps-stt',JSON.stringify(n));}
function getSttNote(sid){
  var notes=getSttNotes();
  try{return notes[_groupId]&&notes[_groupId][_sessionDate]&&notes[_groupId][_sessionDate][sid]||'';}catch(e){return'';}
}
function setSttNote(sid,text){
  var notes=getSttNotes();
  if(!notes[_groupId])notes[_groupId]={};
  if(!notes[_groupId][_sessionDate])notes[_groupId][_sessionDate]={};
  notes[_groupId][_sessionDate][sid]=text;
  setSttNotes(notes);
}

var _sttRecognitions={};
function startStt(sid){
  var SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRecognition){toast('Reconnaissance vocale non disponible');return;}

  if(_sttRecognitions[sid]){_sttRecognitions[sid].stop();delete _sttRecognitions[sid];renderContent();return;}

  var recognition=new SpeechRecognition();
  recognition.lang='fr-CA';
  recognition.continuous=false;
  recognition.interimResults=false;
  recognition.maxAlternatives=1;
  _sttRecognitions[sid]=recognition;

  recognition.onresult=function(event){
    var transcript=event.results[0][0].transcript;
    var existing=getSttNote(sid);
    setSttNote(sid,(existing?existing+' ':'')+transcript);
    delete _sttRecognitions[sid];
    toast('Note ajoutée!');
    renderContent();
  };
  recognition.onerror=function(){delete _sttRecognitions[sid];toast('Erreur micro');renderContent();};
  recognition.onend=function(){delete _sttRecognitions[sid];renderContent();};
  recognition.start();
  toast('Parle maintenant...');
  renderContent();
}

// ═══════════════════════════════════════════════════════
// KILLER FEATURE 6: SPARKLINE PROGRESSION (3 dots)
// ═══════════════════════════════════════════════════════
function renderSparkline(sid){
  var d=getData();
  if(!d[_groupId])return'';
  var dates=Object.keys(d[_groupId]).sort().reverse();
  // Get last 3 dates (excluding today if no data)
  var recentDates=[];
  dates.forEach(function(dt){
    if(recentDates.length>=3)return;
    var studentData=d[_groupId][dt]&&d[_groupId][dt][sid];
    if(studentData&&Object.keys(studentData).length>0)recentDates.push(dt);
  });
  if(recentDates.length===0)return'';

  recentDates.reverse(); // oldest first

  var html='<div class="sparkline-dots" title="Dernières évaluations">';
  recentDates.forEach(function(dt){
    var studentData=d[_groupId][dt][sid];
    var score=calcDayScore(studentData);
    var cls=score>=3?'sd-green':score>=2?'sd-yellow':'sd-red';
    html+='<span class="spark-dot '+cls+'" title="'+dt+'"></span>';
  });
  // Pad with gray dots if fewer than 3
  for(var i=recentDates.length;i<3;i++){
    html+='<span class="spark-dot sd-gray"></span>';
  }
  html+='</div>';
  return html;
}

function calcDayScore(data){
  if(!data)return 0;
  var total=0,count=0;
  Object.keys(data).forEach(function(k){
    // Stars (1-5)
    if(k.indexOf('eval_')===0||k.indexOf('pfeq_')===0){
      var v=data[k];
      if(typeof v==='number'&&v>0){total+=v;count++;}
      else if(typeof v==='string'&&'ABCDE'.indexOf(v)>=0){total+=(5-'ABCDE'.indexOf(v));count++;}
    }
    // Presence
    if(k==='check_presence'){
      if(data[k]==='present'){total+=5;count++;}
      else if(data[k]==='retard'){total+=3;count++;}
      else if(data[k]==='absent'){total+=1;count++;}
    }
    // Color eval
    if(k==='color_eval'){
      if(data[k]==='green'){total+=5;count++;}
      else if(data[k]==='yellow'){total+=3;count++;}
      else if(data[k]==='red'){total+=1;count++;}
      else if(data[k]==='purple'){total+=2;count++;}
    }
  });
  return count>0?total/count:0;
}
