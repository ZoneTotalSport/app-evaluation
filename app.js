/* ============================================================
   EvalEPS — Carnet de Notes Complet
   5 types: grade, check, rating, badge, counter
   + Chronos, Scores, Notes vocales
   zonetotalsport.ca
   ============================================================ */
'use strict';

// ─── i18n ───
var I18N = {
  fr: {
    greeting: 'BONJOUR COACH!',
    newGroup: 'NOUVEAU GROUPE', editGroup: 'MODIFIER LE GROUPE',
    save: 'SAUVEGARDER', cancel: 'ANNULER', import: 'IMPORTER',
    delete: 'SUPPRIMER', deleteConfirm: 'Supprimer ce groupe ?',
    saved: 'SAUVEGARDÉ!', deleted: 'SUPPRIMÉ!', exported: 'PDF GÉNÉRÉ!',
    noCriteria: 'Ajoute des critères (📚 PFEQ ou 📝 Critère)',
    today: "Aujourd'hui", namePN: 'P.N', nameNP: 'N.P',
    present: 'Présent', absent: 'Absent', late: 'Retard',
    oui: 'Oui', non: 'Non',
    recording: 'Enregistrement...', voiceSaved: 'Note vocale sauvegardée',
  },
  en: {
    greeting: 'HELLO COACH!',
    newGroup: 'NEW GROUP', editGroup: 'EDIT GROUP',
    save: 'SAVE', cancel: 'CANCEL', import: 'IMPORT',
    delete: 'DELETE', deleteConfirm: 'Delete this group?',
    saved: 'SAVED!', deleted: 'DELETED!', exported: 'PDF GENERATED!',
    noCriteria: 'Add criteria (📚 PFEQ or 📝 Criterion)',
    today: 'Today', namePN: 'F.L', nameNP: 'L.F',
    present: 'Present', absent: 'Absent', late: 'Late',
    oui: 'Yes', non: 'No',
    recording: 'Recording...', voiceSaved: 'Voice note saved',
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
      { fr: 'Courir à différentes vitesses', en: 'Run at different speeds', type: 'rating' },
      { fr: 'Sauter de différentes façons', en: 'Jump in different ways', type: 'rating' },
      { fr: 'Lancer avec précision', en: 'Throw accurately', type: 'rating' },
      { fr: 'Attraper un objet en mouvement', en: 'Catch a moving object', type: 'rating' },
      { fr: 'Frapper avec main/pied/outil', en: 'Strike with hand/foot/tool', type: 'rating' },
      { fr: 'Dribler de façon contrôlée', en: 'Dribble in controlled way', type: 'rating' },
      { fr: 'Maintenir son équilibre', en: 'Maintain balance', type: 'rating' },
      { fr: 'Roulades et rotations', en: 'Rolls and rotations', type: 'rating' },
      { fr: 'Se recevoir sécuritairement', en: 'Land safely', type: 'check' },
    ]},
    { nom: 'Planification et évaluation', nom_en: 'Planning and evaluation', criteres: [
      { fr: 'Choisit les actions appropriées', en: 'Chooses appropriate actions', type: 'rating' },
      { fr: 'Identifie ses ajustements', en: 'Identifies adjustments needed', type: 'grade' },
      { fr: 'Reconnaît réussites et difficultés', en: 'Recognizes successes/difficulties', type: 'grade' },
    ]},
  ]},
  { competence: 'Comp. 2 — Interagir', competence_en: 'Comp. 2 — To interact', composantes: [
    { nom: 'Coopération et opposition', nom_en: 'Cooperation and opposition', criteres: [
      { fr: 'Synchronise avec partenaires', en: 'Synchronizes with partners', type: 'rating' },
      { fr: 'Se démarque pour recevoir', en: 'Gets open to receive', type: 'rating' },
      { fr: 'Utilise des feintes', en: 'Uses feints', type: 'rating' },
      { fr: "Anticipe l'adversaire", en: 'Anticipates opponent', type: 'rating' },
      { fr: 'Passe avec précision', en: 'Passes accurately', type: 'rating' },
      { fr: 'Pression défensive', en: 'Defensive pressure', type: 'rating' },
    ]},
    { nom: 'Éthique sportive', nom_en: 'Sports ethics', criteres: [
      { fr: 'Accepte victoire et défaite', en: 'Accepts victory and defeat', type: 'badge' },
      { fr: 'Respecte les adversaires', en: 'Respects opponents', type: 'badge' },
      { fr: 'Joue selon les règles', en: 'Plays within rules', type: 'check' },
      { fr: 'Encourage ses partenaires', en: 'Encourages partners', type: 'badge' },
    ]},
  ]},
  { competence: 'Comp. 3 — Mode de vie sain', competence_en: 'Comp. 3 — Healthy lifestyle', composantes: [
    { nom: 'Habitudes', nom_en: 'Habits', criteres: [
      { fr: "S'engage activement", en: 'Actively engages', type: 'rating' },
      { fr: 'Échauffement et retour au calme', en: 'Warm-up and cool-down', type: 'check' },
      { fr: 'Sécurité', en: 'Safety', type: 'check' },
      { fr: 'Hydratation', en: 'Hydration', type: 'check' },
    ]},
  ]},
];
var QUICK_ASSESS = [
  { fr: 'Présence', en: 'Attendance', type: 'check', subtype: 'presence' },
  { fr: 'Tenue sportive', en: 'Sportswear', type: 'check' },
  { fr: 'Comportement', en: 'Behavior', type: 'badge' },
  { fr: 'Effort', en: 'Effort', type: 'rating' },
  { fr: 'Participation', en: 'Participation', type: 'rating' },
  { fr: 'Écoute', en: 'Listening', type: 'badge' },
  { fr: 'Respect des pairs', en: 'Peer respect', type: 'badge' },
  { fr: 'Esprit sportif', en: 'Sportsmanship', type: 'badge' },
  { fr: 'Sécurité', en: 'Safety', type: 'check' },
  { fr: 'Autonomie', en: 'Autonomy', type: 'rating' },
  { fr: 'Tirs réussis', en: 'Successful shots', type: 'counter' },
  { fr: 'Passes consécutives', en: 'Consecutive passes', type: 'counter' },
  { fr: 'Avertissements', en: 'Warnings', type: 'counter' },
];

// ─── SCALES & TYPES ───
var SCALE = ['A', 'B', 'C', 'D', 'E'];
var SCALE_BG = { A: '#2E7D32', B: '#66BB6A', C: '#FFD600', D: '#FF8C00', E: '#D32F2F' };
var TYPE_ICONS = { grade: '🔤', check: '✅', rating: '⭐', badge: '🏷️', counter: '🔢' };

// Criterion types:
// grade: A-E (click to cycle)
// check: present/absent/late OR oui/non (click to cycle)
// rating: 1-5 stars (click star to set)
// badge: +1/-1 behavioral (positive/negative buttons)
// counter: incremental +/- number

// ─── STATE ───
var _groupId = null;
var _sessionDate = todayStr();
var _selectedColor = 'c-blue';
var _nameOrder = 'pn';
var _selectedCritType = 'grade';

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
function getVoiceNotes() { try { return JSON.parse(localStorage.getItem('evaleps-voice') || '{}'); } catch(e) { return {}; } }
function setVoiceNotes(v) { localStorage.setItem('evaleps-voice', JSON.stringify(v)); }

// ═══════════════════════════════════
// RENDER ALL
// ═══════════════════════════════════
function renderAll() {
  var groups = getGroups();
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
    var display = text.length > 16 ? text.substring(0, 14) + '..' : text;
    var typeIcon = TYPE_ICONS[c.type || 'grade'] || '🔤';
    html += '<div class="criteria-tab" title="' + esc(text) + ' (' + (c.type || 'grade') + ')">';
    html += '<span class="crit-type-icon">' + typeIcon + '</span>';
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
  if (!container || !_groupId) { if (container) container.innerHTML = ''; return; }

  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _groupId; });
  if (!group) { container.innerHTML = ''; return; }

  var photos = getPhotos();
  var voiceNotes = getVoiceNotes();
  var groupVoice = (voiceNotes[_groupId] && voiceNotes[_groupId][_sessionDate]) || {};
  var html = '';
  group.students.forEach(function(s, i) {
    var photoSrc = photos[s.id];
    var displayName = formatName(s.name);
    var hasVoice = !!groupVoice[s.id];
    html += '<div class="student-row" data-sid="' + s.id + '">';
    html += '<span class="student-num">' + (i + 1) + '</span>';
    html += '<div class="student-photo" onclick="addStudentPhoto(\'' + s.id + '\')">';
    if (photoSrc) html += '<img src="' + photoSrc + '" />';
    else html += '📷';
    html += '</div>';
    html += '<span class="student-name">' + esc(displayName) + '</span>';
    html += '<button class="student-voice-btn' + (hasVoice ? ' has-note' : '') + '" onclick="toggleVoiceNote(\'' + s.id + '\')" title="Note vocale">';
    html += hasVoice ? '🔊' : '🎙️';
    html += '</button>';
    html += '</div>';
  });
  container.innerHTML = html;
}

function formatName(name) {
  if (_nameOrder === 'np') {
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      var last = parts.pop();
      return last + ', ' + parts.join(' ');
    }
  }
  return name;
}

// ═══════════════════════════════════
// GRADE GRID (CENTER) — Multi-type cells
// ═══════════════════════════════════
function renderGradeGrid() {
  var container = document.getElementById('grade-grid');
  if (!container || !_groupId) { if (container) container.innerHTML = ''; return; }

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
      var type = c.type || 'grade';
      var val = sd['c' + ci];
      html += '<div class="grade-cell" data-type="' + type + '">';
      html += renderCell(type, val, s.id, ci, c);
      html += '</div>';
    });
    html += '</div>';
  });
  container.innerHTML = html;
  syncScroll();
}

function renderCell(type, val, sid, ci, crit) {
  if (type === 'grade') {
    if (val) return '<span class="grade-badge g-' + val + '" onclick="cycleGrade(\'' + sid + '\',' + ci + ')">' + val + '</span>';
    return '<span class="grade-empty" onclick="cycleGrade(\'' + sid + '\',' + ci + ')"></span>';
  }
  if (type === 'check') {
    var isPresence = crit && crit.subtype === 'presence';
    if (isPresence) {
      var states = ['present', 'absent', 'late'];
      var labels = { present: t('present'), absent: t('absent'), late: t('late') };
      var st = val || '';
      if (st) return '<span class="check-badge ' + st + '" onclick="cycleCheck(\'' + sid + '\',' + ci + ',true)">' + labels[st] + '</span>';
      return '<span class="grade-empty" onclick="cycleCheck(\'' + sid + '\',' + ci + ',true)"></span>';
    } else {
      if (val === 'oui') return '<span class="check-badge oui" onclick="cycleCheck(\'' + sid + '\',' + ci + ',false)">' + t('oui') + '</span>';
      if (val === 'non') return '<span class="check-badge non" onclick="cycleCheck(\'' + sid + '\',' + ci + ',false)">' + t('non') + '</span>';
      return '<span class="grade-empty" onclick="cycleCheck(\'' + sid + '\',' + ci + ',false)"></span>';
    }
  }
  if (type === 'rating') {
    var rating = parseInt(val) || 0;
    var html = '<div class="stars-container">';
    for (var i = 1; i <= 5; i++) {
      html += '<span class="star' + (i <= rating ? ' filled' : '') + '" onclick="setRating(\'' + sid + '\',' + ci + ',' + i + ')">★</span>';
    }
    html += '</div>';
    return html;
  }
  if (type === 'badge') {
    var bval = parseInt(val) || 0;
    var html = '<div class="badge-container">';
    html += '<button class="badge-btn positive" onclick="addBadge(\'' + sid + '\',' + ci + ',1)">+</button>';
    if (bval !== 0) {
      html += '<span class="badge-count ' + (bval > 0 ? 'pos' : 'neg') + '">' + (bval > 0 ? '+' : '') + bval + '</span>';
    }
    html += '<button class="badge-btn negative" onclick="addBadge(\'' + sid + '\',' + ci + ',-1)">−</button>';
    html += '</div>';
    return html;
  }
  if (type === 'counter') {
    var cval = parseInt(val) || 0;
    var html = '<div class="counter-container">';
    html += '<button class="counter-btn" onclick="addCounter(\'' + sid + '\',' + ci + ',-1)">−</button>';
    html += '<span class="counter-num">' + cval + '</span>';
    html += '<button class="counter-btn" onclick="addCounter(\'' + sid + '\',' + ci + ',1)">+</button>';
    html += '</div>';
    return html;
  }
  return '<span class="grade-empty"></span>';
}

// ─── Cell interactions ───
function getEvalPath(sid, ci) {
  var evals = getEvals();
  if (!evals[_groupId]) evals[_groupId] = {};
  if (!evals[_groupId][_sessionDate]) evals[_groupId][_sessionDate] = {};
  if (!evals[_groupId][_sessionDate][sid]) evals[_groupId][_sessionDate][sid] = {};
  return evals;
}

function cycleGrade(sid, ci) {
  var evals = getEvalPath(sid, ci);
  var cur = evals[_groupId][_sessionDate][sid]['c' + ci] || '';
  var idx = SCALE.indexOf(cur);
  var next = idx < 0 ? SCALE[0] : (idx + 1 >= SCALE.length ? '' : SCALE[idx + 1]);
  if (next) evals[_groupId][_sessionDate][sid]['c' + ci] = next;
  else delete evals[_groupId][_sessionDate][sid]['c' + ci];
  setEvals(evals);
  renderGradeGrid();
}

function cycleCheck(sid, ci, isPresence) {
  var evals = getEvalPath(sid, ci);
  var cur = evals[_groupId][_sessionDate][sid]['c' + ci] || '';
  if (isPresence) {
    var states = ['present', 'absent', 'late', ''];
    var idx = states.indexOf(cur);
    var next = states[(idx + 1) % states.length];
    if (next) evals[_groupId][_sessionDate][sid]['c' + ci] = next;
    else delete evals[_groupId][_sessionDate][sid]['c' + ci];
  } else {
    var states2 = ['oui', 'non', ''];
    var idx2 = states2.indexOf(cur);
    var next2 = states2[(idx2 + 1) % states2.length];
    if (next2) evals[_groupId][_sessionDate][sid]['c' + ci] = next2;
    else delete evals[_groupId][_sessionDate][sid]['c' + ci];
  }
  setEvals(evals);
  renderGradeGrid();
}

function setRating(sid, ci, stars) {
  var evals = getEvalPath(sid, ci);
  var cur = parseInt(evals[_groupId][_sessionDate][sid]['c' + ci]) || 0;
  if (cur === stars) {
    delete evals[_groupId][_sessionDate][sid]['c' + ci];
  } else {
    evals[_groupId][_sessionDate][sid]['c' + ci] = String(stars);
  }
  setEvals(evals);
  renderGradeGrid();
}

function addBadge(sid, ci, delta) {
  var evals = getEvalPath(sid, ci);
  var cur = parseInt(evals[_groupId][_sessionDate][sid]['c' + ci]) || 0;
  var next = cur + delta;
  if (next === 0) delete evals[_groupId][_sessionDate][sid]['c' + ci];
  else evals[_groupId][_sessionDate][sid]['c' + ci] = String(next);
  setEvals(evals);
  renderGradeGrid();
}

function addCounter(sid, ci, delta) {
  var evals = getEvalPath(sid, ci);
  var cur = parseInt(evals[_groupId][_sessionDate][sid]['c' + ci]) || 0;
  var next = Math.max(0, cur + delta);
  if (next === 0) delete evals[_groupId][_sessionDate][sid]['c' + ci];
  else evals[_groupId][_sessionDate][sid]['c' + ci] = String(next);
  setEvals(evals);
  renderGradeGrid();
}

// Sync scroll
function syncScroll() {
  var studentList = document.getElementById('student-list');
  var gradeGrid = document.getElementById('grade-grid');
  if (!studentList || !gradeGrid) return;
  gradeGrid.onscroll = function() { studentList.scrollTop = gradeGrid.scrollTop; };
  studentList.onscroll = function() { gradeGrid.scrollTop = studentList.scrollTop; };
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
  renderStudentList();
}

// ═══════════════════════════════════
// NAME ORDER
// ═══════════════════════════════════
function renderNameOrderBtn() {
  var btn = document.getElementById('name-order-btn');
  if (btn) btn.textContent = _nameOrder === 'pn' ? t('namePN') : t('nameNP');
}
function toggleNameOrder() {
  _nameOrder = _nameOrder === 'pn' ? 'np' : 'pn';
  localStorage.setItem('evaleps-nameorder', _nameOrder);
  renderStudentList();
  renderNameOrderBtn();
}

// ═══════════════════════════════════
// VOICE NOTES
// ═══════════════════════════════════
var _currentRecording = null;
var _mediaRecorder = null;

function toggleVoiceNote(sid) {
  var voiceNotes = getVoiceNotes();
  var groupVoice = (voiceNotes[_groupId] && voiceNotes[_groupId][_sessionDate]) || {};

  // If already has a note, play it or delete
  if (groupVoice[sid]) {
    if (confirm('Écouter la note vocale ?\n(Annuler pour supprimer)')) {
      var audio = new Audio(groupVoice[sid]);
      audio.play();
    } else {
      delete voiceNotes[_groupId][_sessionDate][sid];
      setVoiceNotes(voiceNotes);
      renderStudentList();
    }
    return;
  }

  // Start recording
  if (_mediaRecorder && _mediaRecorder.state === 'recording') {
    _mediaRecorder.stop();
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
    _mediaRecorder = new MediaRecorder(stream);
    var chunks = [];
    _currentRecording = sid;

    _mediaRecorder.ondataavailable = function(e) { chunks.push(e.data); };
    _mediaRecorder.onstop = function() {
      stream.getTracks().forEach(function(t) { t.stop(); });
      var blob = new Blob(chunks, { type: 'audio/webm' });
      var reader = new FileReader();
      reader.onload = function(ev) {
        var vn = getVoiceNotes();
        if (!vn[_groupId]) vn[_groupId] = {};
        if (!vn[_groupId][_sessionDate]) vn[_groupId][_sessionDate] = {};
        vn[_groupId][_sessionDate][sid] = ev.target.result;
        setVoiceNotes(vn);
        _currentRecording = null;
        renderStudentList();
        showToast(t('voiceSaved'));
      };
      reader.readAsDataURL(blob);
    };

    _mediaRecorder.start();
    showToast(t('recording'));
    renderStudentList();

    // Auto-stop after 10 seconds
    setTimeout(function() {
      if (_mediaRecorder && _mediaRecorder.state === 'recording') {
        _mediaRecorder.stop();
      }
    }, 10000);
  }).catch(function(err) {
    showToast('Micro non disponible');
  });
}

// ═══════════════════════════════════
// CRITERIA
// ═══════════════════════════════════
function openAddCriterionModal() {
  _selectedCritType = 'grade';
  document.getElementById('criterion-name-input').value = '';
  document.querySelectorAll('.type-option').forEach(function(o) {
    o.classList.toggle('active', o.dataset.type === 'grade');
  });
  document.getElementById('criterion-modal').classList.remove('hidden');
  document.getElementById('criterion-name-input').focus();
}

function closeCriterionModal() {
  document.getElementById('criterion-modal').classList.add('hidden');
}

function pickCritType(type) {
  _selectedCritType = type;
  document.querySelectorAll('.type-option').forEach(function(o) {
    o.classList.toggle('active', o.dataset.type === type);
  });
}

function saveCriterion() {
  var name = document.getElementById('criterion-name-input').value.trim();
  if (!name) return;
  var criteria = getCriteria();
  criteria.push({ fr: name, en: name, type: _selectedCritType, custom: true });
  setCriteria(criteria);
  closeCriterionModal();
  renderAll();
  showToast(t('saved'));
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

  html += '<h3 class="lexique-comp-title">⚡ Évaluation rapide</h3>';
  html += '<div class="lexique-items">';
  QUICK_ASSESS.forEach(function(qa) {
    var text = _lang === 'en' ? qa.en : qa.fr;
    var s = sel.indexOf(qa.fr) >= 0;
    var icon = TYPE_ICONS[qa.type] || '🔤';
    html += '<div class="lexique-item' + (s ? ' selected' : '') + '" data-fr="' + esc(qa.fr) + '" data-en="' + esc(qa.en) + '" data-type="' + qa.type + '" data-subtype="' + (qa.subtype || '') + '">' +
      '<span class="lexique-item-check">✓</span><span class="lexique-item-text">' + icon + ' ' + esc(text) + '</span></div>';
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
        var icon = TYPE_ICONS[crit.type || 'grade'] || '🔤';
        html += '<div class="lexique-item' + (s ? ' selected' : '') + '" data-fr="' + esc(crit.fr) + '" data-en="' + esc(crit.en) + '" data-type="' + (crit.type || 'grade') + '">' +
          '<span class="lexique-item-check">✓</span><span class="lexique-item-text">' + icon + ' ' + esc(text) + '</span></div>';
      });
      html += '</div>';
    });
  });

  container.innerHTML = html;
  container.querySelectorAll('.lexique-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var fr = item.dataset.fr, en = item.dataset.en;
      var type = item.dataset.type || 'grade';
      var subtype = item.dataset.subtype || '';
      var criteria = getCriteria();
      var idx = criteria.findIndex(function(c) { return c.fr === fr; });
      if (idx >= 0) { criteria.splice(idx, 1); item.classList.remove('selected'); }
      else {
        var entry = { fr: fr, en: en, type: type };
        if (subtype) entry.subtype = subtype;
        criteria.push(entry);
        item.classList.add('selected');
      }
      setCriteria(criteria);
    });
  });
}

// ═══════════════════════════════════
// CHRONOS & SCORES
// ═══════════════════════════════════
var _chronoIndivInterval = null;
var _chronoIndivStart = 0;
var _chronoIndivElapsed = 0;

function toggleChronoPanel() {
  document.getElementById('chrono-panel').classList.toggle('hidden');
}

function chronoIndivStart() {
  if (_chronoIndivInterval) return;
  _chronoIndivStart = Date.now() - _chronoIndivElapsed;
  _chronoIndivInterval = setInterval(function() {
    _chronoIndivElapsed = Date.now() - _chronoIndivStart;
    var s = Math.floor(_chronoIndivElapsed / 1000);
    var ms = Math.floor((_chronoIndivElapsed % 1000) / 100);
    var m = Math.floor(s / 60);
    s = s % 60;
    document.getElementById('chrono-indiv-display').textContent =
      String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + ms;
  }, 100);
}

function chronoIndivStop() {
  clearInterval(_chronoIndivInterval);
  _chronoIndivInterval = null;
}

function chronoIndivReset() {
  chronoIndivStop();
  _chronoIndivElapsed = 0;
  document.getElementById('chrono-indiv-display').textContent = '00:00.0';
}

// Group timer (countdown)
var _chronoGroupInterval = null;
var _chronoGroupRemaining = 300; // 5 min default
var _chronoGroupTotal = 300;

function chronoGroupUpdateDisplay() {
  var m = Math.floor(Math.abs(_chronoGroupRemaining) / 60);
  var s = Math.abs(_chronoGroupRemaining) % 60;
  var prefix = _chronoGroupRemaining < 0 ? '-' : '';
  document.getElementById('chrono-group-display').textContent =
    prefix + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function chronoGroupStart() {
  if (_chronoGroupInterval) return;
  _chronoGroupInterval = setInterval(function() {
    _chronoGroupRemaining--;
    chronoGroupUpdateDisplay();
    if (_chronoGroupRemaining === 0) {
      // Beep at zero
      try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator();
        osc.frequency.value = 880;
        osc.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      } catch(e) {}
    }
  }, 1000);
}

function chronoGroupStop() {
  clearInterval(_chronoGroupInterval);
  _chronoGroupInterval = null;
}

function chronoGroupAdjust(delta) {
  _chronoGroupRemaining += delta;
  if (_chronoGroupRemaining < 0 && !_chronoGroupInterval) _chronoGroupRemaining = 0;
  _chronoGroupTotal = Math.max(_chronoGroupTotal, _chronoGroupRemaining);
  chronoGroupUpdateDisplay();
}

// Engagement chrono
var _engageInterval = null;
var _engageActive = 0;
var _engageInactive = 0;
var _engageIsActive = false;
var _engageStartTime = 0;

function chronoEngageToggle() {
  var btn = document.getElementById('chrono-engage-btn');
  if (!_engageIsActive) {
    _engageIsActive = true;
    _engageStartTime = Date.now();
    btn.textContent = '⏸ EN MOUVEMENT';
    btn.classList.add('stop');
    btn.classList.remove('start');
    if (!_engageInterval) {
      _engageInterval = setInterval(updateEngageDisplay, 1000);
    }
  } else {
    _engageIsActive = false;
    _engageActive += (Date.now() - _engageStartTime);
    _engageStartTime = Date.now();
    btn.textContent = '▶ EN MOUVEMENT';
    btn.classList.add('start');
    btn.classList.remove('stop');
  }
}

function updateEngageDisplay() {
  var now = Date.now();
  var active = _engageActive + (_engageIsActive ? now - _engageStartTime : 0);
  var total = active + _engageInactive + (!_engageIsActive && _engageStartTime ? now - _engageStartTime - _engageActive : 0);
  if (total === 0) total = 1;
  var activeS = Math.floor(active / 1000);
  var m = Math.floor(activeS / 60);
  var s = activeS % 60;
  document.getElementById('chrono-engage-display').textContent =
    String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  var pct = Math.round(active / (active + (now - _engageStartTime - (_engageIsActive ? 0 : active))) * 100) || 0;
  document.getElementById('engage-stats').textContent =
    'Actif: ' + pct + '% — Inactif: ' + (100 - pct) + '%';
}

function chronoEngageReset() {
  clearInterval(_engageInterval);
  _engageInterval = null;
  _engageActive = 0;
  _engageInactive = 0;
  _engageIsActive = false;
  _engageStartTime = 0;
  document.getElementById('chrono-engage-display').textContent = '00:00';
  document.getElementById('engage-stats').textContent = 'Actif: 0% — Inactif: 0%';
  var btn = document.getElementById('chrono-engage-btn');
  btn.textContent = '▶ EN MOUVEMENT';
  btn.classList.add('start');
  btn.classList.remove('stop');
}

// Team scores
var _teamScores = { a: 0, b: 0 };

function teamScore(team, delta) {
  _teamScores[team] = Math.max(0, _teamScores[team] + delta);
  document.getElementById('team-' + team + '-score').textContent = _teamScores[team];
}

function teamScoreReset() {
  _teamScores = { a: 0, b: 0 };
  document.getElementById('team-a-score').textContent = '0';
  document.getElementById('team-b-score').textContent = '0';
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

function pickColor(c) { _selectedColor = c; resetColorPicker(); }
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
      students: names.map(function(n) { return { id: genId(), name: n }; }) };
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
  if (!_editingGroupId || !confirm(t('deleteConfirm'))) return;
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
    'h1{font-family:Bangers,cursive;color:#0077CC;text-align:center;font-size:2rem;}' +
    'h2{font-family:Bangers,cursive;color:#0077CC;font-size:1.3rem;margin:16px 0 6px;}' +
    'table{width:100%;border-collapse:collapse;font-size:0.85rem;margin-bottom:16px;}' +
    'th{background:#0077CC;color:#fff;padding:6px;border:1px solid #0066b3;font-family:Bangers,cursive;font-size:0.75rem;text-align:center;}' +
    'th:first-child{text-align:left;}td{padding:5px;border:1px solid #ddd;text-align:center;}' +
    'td:first-child{text-align:left;font-weight:700;}' +
    '.stars{color:#FFD600;}.badge-pos{color:#2E7D32;}.badge-neg{color:#FF8C00;}' +
    '.check-p{color:#2E7D32;font-weight:bold;}.check-a{color:#D32F2F;font-weight:bold;}.check-l{color:#FF8C00;font-weight:bold;}' +
    '.footer{text-align:center;margin-top:20px;font-size:0.8rem;color:#999;}' +
    '@media print{@page{margin:10mm;}}</style></head><body>';
  html += '<h1>' + esc(group.name) + ' — EVALEPS</h1>';

  dates.forEach(function(date) {
    var sd = groupEvals[date] || {};
    html += '<h2>' + date + '</h2><table><thead><tr><th>#</th><th>Élève</th>';
    criteria.forEach(function(c) {
      var tx = _lang === 'en' && c.en ? c.en : c.fr;
      var icon = TYPE_ICONS[c.type || 'grade'] || '';
      html += '<th>' + icon + ' ' + esc(tx.length > 16 ? tx.substring(0, 14) + '..' : tx) + '</th>';
    });
    html += '</tr></thead><tbody>';
    group.students.forEach(function(s, i) {
      var d = sd[s.id] || {};
      html += '<tr><td>' + (i + 1) + '</td><td>' + esc(formatName(s.name)) + '</td>';
      criteria.forEach(function(c, ci) {
        var v = d['c' + ci] || '';
        var type = c.type || 'grade';
        if (!v) { html += '<td></td>'; return; }
        if (type === 'grade') {
          html += '<td style="background:' + (SCALE_BG[v] || '#999') + ';color:#fff;font-weight:bold;">' + v + '</td>';
        } else if (type === 'check') {
          var cls = v === 'present' || v === 'oui' ? 'check-p' : v === 'absent' || v === 'non' ? 'check-a' : 'check-l';
          html += '<td class="' + cls + '">' + v + '</td>';
        } else if (type === 'rating') {
          html += '<td class="stars">' + '★'.repeat(parseInt(v)) + '☆'.repeat(5 - parseInt(v)) + '</td>';
        } else if (type === 'badge') {
          var bv = parseInt(v);
          html += '<td class="' + (bv > 0 ? 'badge-pos' : 'badge-neg') + '">' + (bv > 0 ? '+' : '') + bv + '</td>';
        } else if (type === 'counter') {
          html += '<td>' + v + '</td>';
        } else {
          html += '<td>' + v + '</td>';
        }
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
  var headers = ['Date', '#', 'Élève'].concat(criteria.map(function(c) { return c.fr + ' (' + (c.type || 'grade') + ')'; }));
  var lines = [headers.join(',')];
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
