/* ============================================================
   EvalEPS — Carnet de Notes (Notebook Style)
   zonetotalsport.ca
   ============================================================ */
'use strict';

// ─── i18n ───
var I18N = {
  fr: {
    greeting: 'BONJOUR COACH!',
    groups: 'Groupes', students: 'Élèves', evals: 'Évaluations',
    newGroup: 'NOUVEAU GROUPE', editGroup: 'MODIFIER LE GROUPE',
    selectGroup: '-- Groupe --', today: "Aujourd'hui", session: 'Séance',
    save: 'SAUVEGARDER', cancel: 'ANNULER', import: 'IMPORTER',
    delete: 'SUPPRIMER', deleteConfirm: 'Supprimer ce groupe ?',
    saved: 'SAUVEGARDÉ!', deleted: 'SUPPRIMÉ!', exported: 'PDF GÉNÉRÉ!',
    addCriteria: 'Nom du critère :', noCriteria: 'Ajoute des critères (📚 PFEQ ou 📝 Critère)',
    comment: 'Note...', noData: 'Aucune donnée',
    emptyCreate: 'Crée ton premier groupe pour commencer',
    namePN: 'P.N', nameNP: 'N.P',
  },
  en: {
    greeting: 'HELLO COACH!',
    groups: 'Groups', students: 'Students', evals: 'Assessments',
    newGroup: 'NEW GROUP', editGroup: 'EDIT GROUP',
    selectGroup: '-- Group --', today: 'Today', session: 'Session',
    save: 'SAVE', cancel: 'CANCEL', import: 'IMPORT',
    delete: 'DELETE', deleteConfirm: 'Delete this group?',
    saved: 'SAVED!', deleted: 'DELETED!', exported: 'PDF GENERATED!',
    addCriteria: 'Criterion name:', noCriteria: 'Add criteria (📚 PFEQ or 📝 Criterion)',
    comment: 'Note...', noData: 'No data',
    emptyCreate: 'Create your first group to start',
    namePN: 'F.L', nameNP: 'L.F',
  }
};
var _lang = 'fr';
function t(k) { return (I18N[_lang] && I18N[_lang][k]) || I18N.fr[k] || k; }
function setLang(l) {
  _lang = l; localStorage.setItem('evaleps-lang', l);
  var s = document.getElementById('lang-select'); if (s) s.value = l;
  renderAll();
}

// ─── LEXIQUE PFEQ ───
var LEXIQUE_PFEQ = [
  { competence: 'Comp. 1 — Agir', competence_en: 'Comp. 1 — To act', composantes: [
    { nom: 'Actions motrices', nom_en: 'Motor actions', criteres: [
      { fr: 'Courir à différentes vitesses', en: 'Run at different speeds' },
      { fr: 'Sauter de différentes façons', en: 'Jump in different ways' },
      { fr: 'Lancer avec précision', en: 'Throw accurately' },
      { fr: 'Attraper un objet en mouvement', en: 'Catch a moving object' },
      { fr: 'Frapper avec main/pied/outil', en: 'Strike with hand/foot/tool' },
      { fr: 'Dribler de façon contrôlée', en: 'Dribble in controlled way' },
      { fr: 'Maintenir son équilibre', en: 'Maintain balance' },
      { fr: 'Roulades et rotations', en: 'Rolls and rotations' },
      { fr: 'Se recevoir sécuritairement', en: 'Land safely' },
    ]},
    { nom: 'Planification et évaluation', nom_en: 'Planning and evaluation', criteres: [
      { fr: 'Choisit les actions appropriées', en: 'Chooses appropriate actions' },
      { fr: 'Identifie ses ajustements', en: 'Identifies adjustments needed' },
      { fr: 'Reconnaît réussites et difficultés', en: 'Recognizes successes and difficulties' },
    ]},
  ]},
  { competence: 'Comp. 2 — Interagir', competence_en: 'Comp. 2 — To interact', composantes: [
    { nom: 'Coopération et opposition', nom_en: 'Cooperation and opposition', criteres: [
      { fr: 'Synchronise avec partenaires', en: 'Synchronizes with partners' },
      { fr: 'Se démarque pour recevoir', en: 'Gets open to receive' },
      { fr: 'Utilise des feintes', en: 'Uses feints' },
      { fr: "Anticipe l'adversaire", en: 'Anticipates opponent' },
      { fr: 'Passe avec précision', en: 'Passes accurately' },
      { fr: 'Pression défensive', en: 'Defensive pressure' },
    ]},
    { nom: 'Éthique sportive', nom_en: 'Sports ethics', criteres: [
      { fr: 'Accepte victoire et défaite', en: 'Accepts victory and defeat' },
      { fr: 'Respecte les adversaires', en: 'Respects opponents' },
      { fr: 'Joue selon les règles', en: 'Plays within rules' },
      { fr: 'Encourage ses partenaires', en: 'Encourages partners' },
    ]},
  ]},
  { competence: 'Comp. 3 — Mode de vie sain', competence_en: 'Comp. 3 — Healthy lifestyle', composantes: [
    { nom: 'Habitudes', nom_en: 'Habits', criteres: [
      { fr: "S'engage activement", en: 'Actively engages' },
      { fr: 'Échauffement et retour au calme', en: 'Warm-up and cool-down' },
      { fr: 'Sécurité', en: 'Safety' },
      { fr: 'Hydratation', en: 'Hydration' },
    ]},
  ]},
];
var QUICK_ASSESS = [
  { fr: 'Comportement', en: 'Behavior' },
  { fr: 'Effort', en: 'Effort' },
  { fr: 'Participation', en: 'Participation' },
  { fr: 'Écoute', en: 'Listening' },
  { fr: 'Respect des pairs', en: 'Peer respect' },
  { fr: 'Esprit sportif', en: 'Sportsmanship' },
  { fr: 'Sécurité', en: 'Safety' },
  { fr: 'Autonomie', en: 'Autonomy' },
];

// ─── SCALES ───
var SCALE = ['A', 'B', 'C', 'D', 'E'];
var SCALE_BG = { A: '#2E7D32', B: '#66BB6A', C: '#FFD600', D: '#FF8C00', E: '#D32F2F' };

// ─── STATE ───
var _groupId = null;
var _sessionDate = todayStr();
var _selectedColor = 'c-blue';
var _nameOrder = 'pn'; // 'pn' = Prénom Nom, 'np' = Nom Prénom

function todayStr() { return new Date().toISOString().slice(0, 10); }

// ─── STORAGE ───
function getGroups() { try { return JSON.parse(localStorage.getItem('evaleps-groups') || '[]'); } catch(e) { return []; } }
function setGroups(g) { localStorage.setItem('evaleps-groups', JSON.stringify(g)); }
function getCriteria() { try { return JSON.parse(localStorage.getItem('evaleps-criteria') || '[]'); } catch(e) { return []; } }
function setCriteria(c) { localStorage.setItem('evaleps-criteria', JSON.stringify(c)); }
function getEvals() { try { return JSON.parse(localStorage.getItem('evaleps-evals') || '{}'); } catch(e) { return {}; } }
function setEvals(e) { localStorage.setItem('evaleps-evals', JSON.stringify(e)); }
function getPhotos() { try { return JSON.parse(localStorage.getItem('evaleps-photos') || '{}'); } catch(e) { return {}; } }
function setPhotos(p) { localStorage.setItem('evaleps-photos', JSON.stringify(p)); }

// ═══════════════════════════════════
// RENDER ALL
// ═══════════════════════════════════
function renderAll() {
  var groups = getGroups();

  // Show empty state or notebook
  var emptyEl = document.getElementById('empty-state');
  var notebook = document.querySelector('.notebook');
  if (groups.length === 0) {
    if (emptyEl) emptyEl.classList.remove('hidden');
    if (notebook) notebook.style.display = 'none';
    return;
  } else {
    if (emptyEl) emptyEl.classList.add('hidden');
    if (notebook) notebook.style.display = '';
  }

  renderGroupTabs();
  renderCriteriaTabs();
  renderStudentList();
  renderGradeGrid();
  renderDateSelect();
  renderNameOrderBtn();
}

// ═══════════════════════════════════
// GROUP TABS (RIGHT)
// ═══════════════════════════════════
function renderGroupTabs() {
  var container = document.getElementById('group-tabs');
  if (!container) return;
  var groups = getGroups();
  var html = '';
  groups.forEach(function(g) {
    var color = g.color || 'c-blue';
    var active = g.id === _groupId ? ' active' : '';
    html += '<div class="group-tab ' + color + active + '" onclick="selectGroup(\'' + g.id + '\')" title="' + esc(g.name) + '">';
    html += '<span class="tab-edit" onclick="event.stopPropagation();editGroup(\'' + g.id + '\')">✏️</span>';
    html += esc(g.name.length > 14 ? g.name.substring(0, 12) + '..' : g.name);
    html += '</div>';
  });
  container.innerHTML = html;
}

function selectGroup(id) {
  _groupId = id;
  localStorage.setItem('evaleps-lastgroup', id);
  _sessionDate = todayStr();
  renderAll();
}

// ═══════════════════════════════════
// CRITERIA TABS (TOP)
// ═══════════════════════════════════
function renderCriteriaTabs() {
  var container = document.getElementById('criteria-tabs');
  if (!container) return;
  var criteria = getCriteria();
  if (criteria.length === 0) {
    container.innerHTML = '<div class="criteria-empty">' + t('noCriteria') + '</div>';
    return;
  }
  var html = '';
  criteria.forEach(function(c, i) {
    var text = _lang === 'en' && c.en ? c.en : c.fr;
    var display = text.length > 18 ? text.substring(0, 16) + '..' : text;
    html += '<div class="criteria-tab" title="' + esc(text) + '">';
    html += esc(display);
    html += '<span class="crit-x" onclick="removeCriteria(' + i + ')">✕</span>';
    html += '</div>';
  });
  container.innerHTML = html;
}

// ═══════════════════════════════════
// STUDENT LIST (LEFT)
// ═══════════════════════════════════
function renderStudentList() {
  var container = document.getElementById('student-list');
  if (!container) return;
  if (!_groupId) { container.innerHTML = ''; return; }

  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _groupId; });
  if (!group) { container.innerHTML = ''; return; }

  var photos = getPhotos();
  var html = '';
  group.students.forEach(function(s, i) {
    var photoSrc = photos[s.id];
    var displayName = formatName(s.name);
    html += '<div class="student-row" data-sid="' + s.id + '">';
    html += '<span class="student-num">' + (i + 1) + '</span>';
    html += '<div class="student-photo" onclick="addStudentPhoto(\'' + s.id + '\')">';
    if (photoSrc) html += '<img src="' + photoSrc + '" />';
    else html += '📷';
    html += '</div>';
    html += '<span class="student-name">' + esc(displayName) + '</span>';
    html += '</div>';
  });
  container.innerHTML = html;
}

function formatName(name) {
  if (_nameOrder === 'np') {
    // Try to reverse "Prénom Nom" → "Nom, Prénom"
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      var last = parts.pop();
      return last + ', ' + parts.join(' ');
    }
  }
  return name;
}

// ═══════════════════════════════════
// GRADE GRID (CENTER)
// ═══════════════════════════════════
function renderGradeGrid() {
  var container = document.getElementById('grade-grid');
  if (!container) return;
  if (!_groupId) { container.innerHTML = ''; return; }

  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _groupId; });
  if (!group) { container.innerHTML = ''; return; }

  var criteria = getCriteria();
  if (criteria.length === 0) { container.innerHTML = ''; return; }

  var evals = getEvals();
  var sessionEvals = (evals[_groupId] && evals[_groupId][_sessionDate]) || {};

  var html = '';
  group.students.forEach(function(s) {
    var sd = sessionEvals[s.id] || {};
    html += '<div class="grade-row" data-sid="' + s.id + '">';
    criteria.forEach(function(c, ci) {
      var val = sd['c' + ci] || '';
      html += '<div class="grade-cell" onclick="cycleGrade(\'' + s.id + '\',' + ci + ')">';
      if (val) {
        html += '<span class="grade-badge g-' + val + '">' + val + '</span>';
      } else {
        html += '<span class="grade-empty"></span>';
      }
      html += '</div>';
    });
    html += '</div>';
  });
  container.innerHTML = html;

  // Sync scroll between student list and grade grid
  syncScroll();
}

function cycleGrade(sid, critIdx) {
  var evals = getEvals();
  if (!evals[_groupId]) evals[_groupId] = {};
  if (!evals[_groupId][_sessionDate]) evals[_groupId][_sessionDate] = {};
  if (!evals[_groupId][_sessionDate][sid]) evals[_groupId][_sessionDate][sid] = {};

  var cur = evals[_groupId][_sessionDate][sid]['c' + critIdx] || '';
  var idx = SCALE.indexOf(cur);
  var next = idx < 0 ? SCALE[0] : (idx + 1 >= SCALE.length ? '' : SCALE[idx + 1]);

  if (next) {
    evals[_groupId][_sessionDate][sid]['c' + critIdx] = next;
  } else {
    delete evals[_groupId][_sessionDate][sid]['c' + critIdx];
  }
  setEvals(evals);
  renderGradeGrid();
}

// Sync vertical scroll between student list and grade grid
function syncScroll() {
  var studentList = document.getElementById('student-list');
  var gradeGrid = document.getElementById('grade-grid');
  if (!studentList || !gradeGrid) return;

  // Remove old listeners by replacing elements... use a flag instead
  gradeGrid.onscroll = function() {
    studentList.scrollTop = gradeGrid.scrollTop;
  };
  studentList.onscroll = function() {
    gradeGrid.scrollTop = studentList.scrollTop;
  };
}

// ═══════════════════════════════════
// DATE SELECT
// ═══════════════════════════════════
function renderDateSelect() {
  var sel = document.getElementById('date-select');
  if (!sel) return;
  var evals = getEvals();
  var groupEvals = _groupId ? (evals[_groupId] || {}) : {};
  var dates = Object.keys(groupEvals).sort().reverse();
  var today = todayStr();

  sel.innerHTML = '<option value="' + today + '">' + t('today') + '</option>';
  dates.forEach(function(d) {
    if (d === today) return;
    sel.innerHTML += '<option value="' + d + '"' + (d === _sessionDate ? ' selected' : '') + '>' + d + '</option>';
  });
}

function onDateChange() {
  _sessionDate = document.getElementById('date-select').value || todayStr();
  renderGradeGrid();
}

// ═══════════════════════════════════
// NAME ORDER
// ═══════════════════════════════════
function renderNameOrderBtn() {
  var btn = document.getElementById('name-order-btn');
  if (!btn) return;
  btn.textContent = _nameOrder === 'pn' ? t('namePN') : t('nameNP');
}

function toggleNameOrder() {
  _nameOrder = _nameOrder === 'pn' ? 'np' : 'pn';
  localStorage.setItem('evaleps-nameorder', _nameOrder);
  renderStudentList();
  renderNameOrderBtn();
}

// ═══════════════════════════════════
// GROUPS CRUD
// ═══════════════════════════════════
var _editingGroupId = null;

function createGroup() {
  _editingGroupId = null;
  _selectedColor = 'c-blue';
  document.getElementById('group-name-input').value = '';
  document.getElementById('group-students-input').value = '';
  document.getElementById('group-modal-title').textContent = t('newGroup');
  document.getElementById('delete-group-btn').style.display = 'none';
  resetColorPicker();
  document.getElementById('group-modal').classList.remove('hidden');
  document.getElementById('group-name-input').focus();
}

function editGroup(id) {
  var groups = getGroups();
  var g = groups.find(function(x) { return x.id === id; });
  if (!g) return;
  _editingGroupId = id;
  _selectedColor = g.color || 'c-blue';
  document.getElementById('group-name-input').value = g.name;
  document.getElementById('group-students-input').value = g.students.map(function(s) { return s.name; }).join('\n');
  document.getElementById('group-modal-title').textContent = t('editGroup');
  document.getElementById('delete-group-btn').style.display = 'inline-block';
  resetColorPicker();
  document.getElementById('group-modal').classList.remove('hidden');
}

function pickColor(c) {
  _selectedColor = c;
  resetColorPicker();
}

function resetColorPicker() {
  document.querySelectorAll('.color-swatch').forEach(function(s) {
    s.classList.toggle('active', s.dataset.color === _selectedColor);
  });
}

function saveGroup() {
  var name = document.getElementById('group-name-input').value.trim();
  var text = document.getElementById('group-students-input').value.trim();
  if (!name) return;
  var names = text.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
  var groups = getGroups();

  if (_editingGroupId) {
    var idx = groups.findIndex(function(g) { return g.id === _editingGroupId; });
    if (idx >= 0) {
      var existing = groups[idx].students;
      groups[idx].name = name;
      groups[idx].color = _selectedColor;
      groups[idx].students = names.map(function(n) {
        var found = existing.find(function(e) { return e.name === n; });
        return found || { id: genId(), name: n };
      });
    }
  } else {
    var ng = { id: genId(), name: name, color: _selectedColor,
      students: names.map(function(n) { return { id: genId(), name: n }; })
    };
    groups.push(ng);
    _groupId = ng.id;
    localStorage.setItem('evaleps-lastgroup', _groupId);
  }
  setGroups(groups);
  closeGroupModal();
  renderAll();
  showToast(t('saved'));
}

function deleteCurrentGroup() {
  if (!_editingGroupId) return;
  if (!confirm(t('deleteConfirm'))) return;
  var groups = getGroups().filter(function(g) { return g.id !== _editingGroupId; });
  setGroups(groups);
  var evals = getEvals(); delete evals[_editingGroupId]; setEvals(evals);
  if (_groupId === _editingGroupId) {
    _groupId = groups.length > 0 ? groups[0].id : null;
    if (_groupId) localStorage.setItem('evaleps-lastgroup', _groupId);
    else localStorage.removeItem('evaleps-lastgroup');
  }
  closeGroupModal();
  renderAll();
  showToast(t('deleted'));
}

function closeGroupModal() {
  document.getElementById('group-modal').classList.add('hidden');
  _editingGroupId = null;
}

function importStudentList() {
  var input = document.createElement('input');
  input.type = 'file'; input.accept = '.csv,.txt';
  input.addEventListener('change', function(e) {
    var file = e.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      var lines = ev.target.result.split(/[\n\r]+/)
        .map(function(l) {
          var p = l.split(',');
          return p.length === 2 && p[0].trim() && p[1].trim()
            ? p[1].trim() + ' ' + p[0].trim() : l.trim();
        })
        .filter(function(n) { return n && n.length > 1; });
      var ta = document.getElementById('group-students-input');
      var ex = ta.value.trim();
      ta.value = ex ? ex + '\n' + lines.join('\n') : lines.join('\n');
      showToast(lines.length + ' élèves');
    };
    reader.readAsText(file);
  });
  input.click();
}

// ═══════════════════════════════════
// PHOTOS
// ═══════════════════════════════════
function addStudentPhoto(studentId) {
  var input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*'; input.capture = 'environment';
  input.addEventListener('change', function(e) {
    var file = e.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var sz = 150, w = img.width, h = img.height;
        if (w > h) { h = sz * h / w; w = sz; } else { w = sz * w / h; h = sz; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        var photos = getPhotos();
        photos[studentId] = canvas.toDataURL('image/jpeg', 0.7);
        setPhotos(photos);
        renderStudentList();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
  input.click();
}

// ═══════════════════════════════════
// CRITERIA
// ═══════════════════════════════════
function addColumnPrompt() {
  var name = prompt(t('addCriteria'));
  if (!name || !name.trim()) return;
  var criteria = getCriteria();
  criteria.push({ fr: name.trim(), en: name.trim(), custom: true });
  setCriteria(criteria);
  renderAll();
}

function removeCriteria(idx) {
  var criteria = getCriteria();
  criteria.splice(idx, 1);
  setCriteria(criteria);
  renderAll();
}

// ─── LEXIQUE ───
function openLexiqueModal() {
  renderLexique();
  document.getElementById('lexique-modal').classList.remove('hidden');
}
function closeLexiqueModal() {
  document.getElementById('lexique-modal').classList.add('hidden');
  renderAll();
}

function renderLexique() {
  var container = document.getElementById('lexique-content');
  var sel = getCriteria().map(function(c) { return c.fr; });
  var html = '';

  html += '<h3 class="lexique-comp-title">⚡ ' + (_lang === 'en' ? 'Quick Assessment' : 'Évaluation rapide') + '</h3>';
  html += '<div class="lexique-items">';
  QUICK_ASSESS.forEach(function(qa) {
    var text = _lang === 'en' ? qa.en : qa.fr;
    var s = sel.indexOf(qa.fr) >= 0;
    html += '<div class="lexique-item' + (s ? ' selected' : '') + '" data-fr="' + esc(qa.fr) + '" data-en="' + esc(qa.en) + '">' +
      '<span class="lexique-item-check">✓</span><span class="lexique-item-text">' + esc(text) + '</span></div>';
  });
  html += '</div>';

  LEXIQUE_PFEQ.forEach(function(comp) {
    html += '<h3 class="lexique-comp-title">' + esc(_lang === 'en' ? comp.competence_en : comp.competence) + '</h3>';
    comp.composantes.forEach(function(compo) {
      html += '<h4 class="lexique-category">' + esc(_lang === 'en' ? compo.nom_en : compo.nom) + '</h4>';
      html += '<div class="lexique-items">';
      compo.criteres.forEach(function(crit) {
        var text = _lang === 'en' ? crit.en : crit.fr;
        var s = sel.indexOf(crit.fr) >= 0;
        html += '<div class="lexique-item' + (s ? ' selected' : '') + '" data-fr="' + esc(crit.fr) + '" data-en="' + esc(crit.en) + '">' +
          '<span class="lexique-item-check">✓</span><span class="lexique-item-text">' + esc(text) + '</span></div>';
      });
      html += '</div>';
    });
  });

  container.innerHTML = html;
  container.querySelectorAll('.lexique-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var fr = item.dataset.fr, en = item.dataset.en;
      var criteria = getCriteria();
      var idx = criteria.findIndex(function(c) { return c.fr === fr; });
      if (idx >= 0) { criteria.splice(idx, 1); item.classList.remove('selected'); }
      else { criteria.push({ fr: fr, en: en }); item.classList.add('selected'); }
      setCriteria(criteria);
    });
  });
}

// ═══════════════════════════════════
// EXPORT
// ═══════════════════════════════════
function exportPDF() {
  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _groupId; });
  if (!group) return;
  var criteria = getCriteria();
  var evals = getEvals();
  var groupEvals = evals[_groupId] || {};
  var dates = Object.keys(groupEvals).sort();
  if (dates.length === 0) return;

  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>EvalEPS — ' + esc(group.name) + '</title>' +
    '<link href="https://fonts.googleapis.com/css2?family=Bangers&family=Boogaloo&display=swap" rel="stylesheet">' +
    '<style>body{font-family:Boogaloo,sans-serif;margin:20px;color:#111;}' +
    'h1{font-family:Bangers,cursive;color:#0077CC;text-align:center;font-size:2rem;letter-spacing:3px;}' +
    'h2{font-family:Bangers,cursive;color:#0077CC;font-size:1.3rem;margin:16px 0 6px;}' +
    'table{width:100%;border-collapse:collapse;font-size:0.85rem;margin-bottom:16px;}' +
    'th{background:#0077CC;color:#fff;padding:6px;border:1px solid #0066b3;font-family:Bangers,cursive;font-size:0.8rem;text-align:center;}' +
    'th:first-child{text-align:left;}td{padding:5px;border:1px solid #ddd;text-align:center;}' +
    'td:first-child{text-align:left;font-weight:700;}' +
    '.g{padding:2px 8px;border-radius:4px;font-family:Bangers,cursive;color:#fff;}' +
    '.footer{text-align:center;margin-top:20px;font-size:0.8rem;color:#999;}' +
    '@media print{@page{margin:10mm;}}</style></head><body>';
  html += '<h1>' + esc(group.name) + ' — EVALEPS</h1>';

  dates.forEach(function(date) {
    var sd = groupEvals[date] || {};
    html += '<h2>' + date + '</h2><table><thead><tr><th>#</th><th>Élève</th>';
    criteria.forEach(function(c) {
      var tx = _lang === 'en' && c.en ? c.en : c.fr;
      html += '<th>' + esc(tx.length > 18 ? tx.substring(0, 16) + '..' : tx) + '</th>';
    });
    html += '</tr></thead><tbody>';
    group.students.forEach(function(s, i) {
      var d = sd[s.id] || {};
      html += '<tr><td>' + (i + 1) + '</td><td>' + esc(formatName(s.name)) + '</td>';
      criteria.forEach(function(c, ci) {
        var v = d['c' + ci] || '';
        html += v ? '<td><span class="g" style="background:' + (SCALE_BG[v] || '#999') + ';">' + v + '</span></td>' : '<td></td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
  });
  html += '<div class="footer">zonetotalsport.ca — EvalEPS</div></body></html>';
  var w = window.open('', '_blank'); w.document.write(html); w.document.close();
  setTimeout(function() { w.print(); }, 400);
  showToast(t('exported'));
}

function exportCSV() {
  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _groupId; });
  if (!group) return;
  var criteria = getCriteria();
  var evals = getEvals();
  var groupEvals = evals[_groupId] || {};
  var lines = [['Date', '#', 'Élève'].concat(criteria.map(function(c) { return c.fr; })).join(',')];
  Object.keys(groupEvals).sort().forEach(function(date) {
    var sd = groupEvals[date];
    group.students.forEach(function(s, i) {
      var d = sd[s.id] || {};
      var row = [date, i + 1, '"' + formatName(s.name) + '"'];
      criteria.forEach(function(c, ci) { row.push(d['c' + ci] || ''); });
      lines.push(row.join(','));
    });
  });
  var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'evaleps_' + group.name.replace(/\s+/g, '_') + '_' + todayStr() + '.csv';
  a.click();
  showToast(t('exported'));
}

function printResults() { window.print(); }

// ═══════════════════════════════════
// HELPERS
// ═══════════════════════════════════
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function esc(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''; }

function showToast(msg) {
  var el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg; el.classList.remove('hidden');
  clearTimeout(el._timer);
  el._timer = setTimeout(function() { el.classList.add('hidden'); }, 2200);
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', function() {
  var savedLang = localStorage.getItem('evaleps-lang') || 'fr';
  _lang = savedLang;
  var langSel = document.getElementById('lang-select');
  if (langSel) langSel.value = savedLang;

  _nameOrder = localStorage.getItem('evaleps-nameorder') || 'pn';

  var lastGroup = localStorage.getItem('evaleps-lastgroup');
  var groups = getGroups();
  if (lastGroup && groups.some(function(g) { return g.id === lastGroup; })) {
    _groupId = lastGroup;
  } else if (groups.length > 0) {
    _groupId = groups[0].id;
  }

  renderAll();
});
