/* ============================================================
   EvalEPS — Pop Art Comic Book Edition
   4 modules: Hub, Plan de classe, Carnet, Resultats
   ============================================================ */
'use strict';

// ─── i18n ───
const I18N = {
  fr: {
    greeting: 'BONJOUR COACH!',
    groups: 'Groupes', students: 'Eleves', evals: 'Evaluations',
    myGroups: 'MES GROUPES', newGroup: 'NOUVEAU GROUPE',
    startClass: 'COMMENCER LE COURS', editGroup: 'MODIFIER LE GROUPE',
    selectGroup: '-- Groupe --', today: 'Aujourd\'hui', session: 'Seance',
    save: 'SAUVEGARDER', cancel: 'ANNULER', import: 'IMPORTER',
    delete: 'SUPPRIMER', deleteConfirm: 'Supprimer ce groupe ?',
    saved: 'SAUVEGARDE!', deleted: 'SUPPRIME!', exported: 'PDF GENERE!',
    addCriteria: 'Nom du critere :', noCriteria: 'Ajoute des criteres pour evaluer',
    prev: 'PRECEDENT', next: 'SUIVANT', comment: 'Ajouter une note...',
    noData: 'Aucune donnee',
  },
  en: {
    greeting: 'HELLO COACH!',
    groups: 'Groups', students: 'Students', evals: 'Assessments',
    myGroups: 'MY GROUPS', newGroup: 'NEW GROUP',
    startClass: 'START CLASS', editGroup: 'EDIT GROUP',
    selectGroup: '-- Group --', today: 'Today', session: 'Session',
    save: 'SAVE', cancel: 'CANCEL', import: 'IMPORT',
    delete: 'DELETE', deleteConfirm: 'Delete this group?',
    saved: 'SAVED!', deleted: 'DELETED!', exported: 'PDF GENERATED!',
    addCriteria: 'Criterion name:', noCriteria: 'Add criteria to start grading',
    prev: 'PREVIOUS', next: 'NEXT', comment: 'Add a note...',
    noData: 'No data',
  }
};
let _lang = 'fr';
function t(k) { return (I18N[_lang] && I18N[_lang][k]) || I18N.fr[k] || k; }
function setLang(l) {
  _lang = l; localStorage.setItem('evaleps-lang', l);
  var s = document.getElementById('lang-select'); if (s) s.value = l;
  refreshAll();
}

// ─── LEXIQUE PFEQ ───
const LEXIQUE_PFEQ = [
  { competence: 'Comp. 1 — Agir', competence_en: 'Comp. 1 — To act', composantes: [
    { nom: 'Actions motrices', nom_en: 'Motor actions', criteres: [
      { fr: 'Courir a differentes vitesses', en: 'Run at different speeds' },
      { fr: 'Sauter de differentes facons', en: 'Jump in different ways' },
      { fr: 'Lancer avec precision', en: 'Throw accurately' },
      { fr: 'Attraper un objet en mouvement', en: 'Catch a moving object' },
      { fr: 'Frapper avec main/pied/outil', en: 'Strike with hand/foot/tool' },
      { fr: 'Dribler de facon controlee', en: 'Dribble in controlled way' },
      { fr: 'Maintenir son equilibre', en: 'Maintain balance' },
      { fr: 'Roulades et rotations', en: 'Rolls and rotations' },
      { fr: 'Se recevoir securitairement', en: 'Land safely' },
    ]},
    { nom: 'Planification et evaluation', nom_en: 'Planning and evaluation', criteres: [
      { fr: 'Choisit les actions appropriees', en: 'Chooses appropriate actions' },
      { fr: 'Identifie ses ajustements', en: 'Identifies adjustments needed' },
      { fr: 'Reconnait reussites et difficultes', en: 'Recognizes successes and difficulties' },
    ]},
  ]},
  { competence: 'Comp. 2 — Interagir', competence_en: 'Comp. 2 — To interact', composantes: [
    { nom: 'Cooperation et opposition', nom_en: 'Cooperation and opposition', criteres: [
      { fr: 'Synchronise avec partenaires', en: 'Synchronizes with partners' },
      { fr: 'Se demarque pour recevoir', en: 'Gets open to receive' },
      { fr: 'Utilise des feintes', en: 'Uses feints' },
      { fr: 'Anticipe l\'adversaire', en: 'Anticipates opponent' },
      { fr: 'Passe avec precision', en: 'Passes accurately' },
      { fr: 'Pression defensive', en: 'Defensive pressure' },
    ]},
    { nom: 'Ethique sportive', nom_en: 'Sports ethics', criteres: [
      { fr: 'Accepte victoire et defaite', en: 'Accepts victory and defeat' },
      { fr: 'Respecte les adversaires', en: 'Respects opponents' },
      { fr: 'Joue selon les regles', en: 'Plays within rules' },
      { fr: 'Encourage ses partenaires', en: 'Encourages partners' },
    ]},
  ]},
  { competence: 'Comp. 3 — Mode de vie sain', competence_en: 'Comp. 3 — Healthy lifestyle', composantes: [
    { nom: 'Habitudes', nom_en: 'Habits', criteres: [
      { fr: 'S\'engage activement', en: 'Actively engages' },
      { fr: 'Echauffement et retour au calme', en: 'Warm-up and cool-down' },
      { fr: 'Securite', en: 'Safety' },
      { fr: 'Hydratation', en: 'Hydration' },
    ]},
  ]},
];
const QUICK_ASSESS = [
  { fr: 'Comportement', en: 'Behavior' },
  { fr: 'Effort', en: 'Effort' },
  { fr: 'Participation', en: 'Participation' },
  { fr: 'Ecoute', en: 'Listening' },
  { fr: 'Respect des pairs', en: 'Peer respect' },
  { fr: 'Esprit sportif', en: 'Sportsmanship' },
  { fr: 'Securite', en: 'Safety' },
  { fr: 'Autonomie', en: 'Autonomy' },
];

// ─── SCALES ───
const SCALE = ['A', 'B', 'C', 'D', 'E'];
const SCALE_COLORS = { A: 'grade-a', B: 'grade-b', C: 'grade-c', D: 'grade-d', E: 'grade-e' };

// ─── STATE ───
let _groupId = null;
let _sessionDate = todayStr();
let _carnetIdx = 0;
let _carnetCritIdx = 0;
let _selectedColor = 'cyan-blue';

function todayStr() { return new Date().toISOString().slice(0, 10); }

// ─── STORAGE ───
function getGroups() { try { return JSON.parse(localStorage.getItem('evaleps-groups') || '[]'); } catch { return []; } }
function setGroups(g) { localStorage.setItem('evaleps-groups', JSON.stringify(g)); }
function getCriteria() { try { return JSON.parse(localStorage.getItem('evaleps-criteria') || '[]'); } catch { return []; } }
function setCriteria(c) { localStorage.setItem('evaleps-criteria', JSON.stringify(c)); }
function getEvals() { try { return JSON.parse(localStorage.getItem('evaleps-evals') || '{}'); } catch { return {}; } }
function setEvals(e) { localStorage.setItem('evaleps-evals', JSON.stringify(e)); }
function getPhotos() { try { return JSON.parse(localStorage.getItem('evaleps-photos') || '{}'); } catch { return {}; } }
function setPhotos(p) { localStorage.setItem('evaleps-photos', JSON.stringify(p)); }
function getAttendance() { try { return JSON.parse(localStorage.getItem('evaleps-attendance') || '{}'); } catch { return {}; } }
function setAttendance(a) { localStorage.setItem('evaleps-attendance', JSON.stringify(a)); }
function getBehavior() { try { return JSON.parse(localStorage.getItem('evaleps-behavior') || '{}'); } catch { return {}; } }
function setBehavior(b) { localStorage.setItem('evaleps-behavior', JSON.stringify(b)); }

// ─── NAVIGATION ───
function switchScreen(name) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  var screen = document.getElementById('screen-' + name);
  if (screen) screen.classList.add('active');
  document.querySelectorAll('.tab').forEach(function(t) {
    t.classList.toggle('active', t.dataset.screen === name);
  });
  if (name === 'hub') renderHub();
  if (name === 'plan') initPlanScreen();
  if (name === 'carnet') initCarnetScreen();
  if (name === 'results') initResultsScreen();
}

// ═══════════════════════════════════
// HUB — AUJOURD'HUI
// ═══════════════════════════════════
function renderHub() {
  // Greeting
  document.getElementById('hub-greeting-text').textContent = t('greeting');
  var opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('hub-date-text').textContent =
    new Date().toLocaleDateString(_lang === 'en' ? 'en-CA' : 'fr-CA', opts);

  // Stats
  var groups = getGroups();
  var totalStudents = groups.reduce(function(sum, g) { return sum + g.students.length; }, 0);
  var evals = getEvals();
  var totalEvals = Object.keys(evals).reduce(function(sum, gid) {
    return sum + Object.keys(evals[gid] || {}).length;
  }, 0);
  document.getElementById('stat-groups').textContent = groups.length;
  document.getElementById('stat-students').textContent = totalStudents;
  document.getElementById('stat-evals').textContent = totalEvals;

  // Group cards
  var container = document.getElementById('hub-groups');
  var photos = getPhotos();

  if (groups.length === 0) {
    container.innerHTML = '<p class="empty-msg">Aucun groupe. Cree ton premier groupe!</p>';
    return;
  }

  var html = '';
  groups.forEach(function(g) {
    var color = g.color || 'cyan-blue';
    html += '<div class="group-card ' + color + '" data-id="' + g.id + '">';
    html += '<div class="group-card-actions">';
    html += '<button class="group-card-btn" onclick="event.stopPropagation();editGroup(\'' + g.id + '\')">✏️</button>';
    html += '</div>';
    html += '<div class="group-card-name">' + esc(g.name) + '</div>';
    html += '<div class="group-card-count">' + g.students.length + ' ' + t('students').toLowerCase() + '</div>';

    // Student avatars preview (max 8)
    html += '<div class="group-card-students">';
    var maxShow = 8;
    g.students.slice(0, maxShow).forEach(function(s) {
      var p = photos[s.id];
      html += '<div class="group-card-avatar">';
      if (p) html += '<img src="' + p + '" />';
      else html += s.name.charAt(0).toUpperCase();
      html += '</div>';
    });
    if (g.students.length > maxShow) {
      html += '<span class="group-card-more">+' + (g.students.length - maxShow) + '</span>';
    }
    html += '</div>';

    html += '<button class="start-btn" onclick="event.stopPropagation();startClass(\'' + g.id + '\')">' + t('startClass') + '</button>';
    html += '</div>';
  });
  container.innerHTML = html;
}

function startClass(id) {
  _groupId = id;
  localStorage.setItem('evaleps-lastgroup', id);
  switchScreen('plan');
}

// ═══════════════════════════════════
// PLAN DE CLASSE
// ═══════════════════════════════════
function initPlanScreen() {
  populateGroupSelects();
  var sel = document.getElementById('plan-group-select');
  if (sel && _groupId) sel.value = _groupId;
  populatePlanDateSelect();
  renderPlanGrid();
}

function onPlanGroupChange() {
  _groupId = document.getElementById('plan-group-select').value || null;
  if (_groupId) localStorage.setItem('evaleps-lastgroup', _groupId);
  _sessionDate = todayStr();
  populatePlanDateSelect();
  renderPlanGrid();
}

function onPlanDateChange() {
  _sessionDate = document.getElementById('plan-date-select').value || todayStr();
  renderPlanGrid();
}

function populatePlanDateSelect() {
  var sel = document.getElementById('plan-date-select');
  if (!sel) return;
  var att = getAttendance();
  var groupAtt = _groupId ? (att[_groupId] || {}) : {};
  var dates = Object.keys(groupAtt).sort().reverse();
  var today = todayStr();
  sel.innerHTML = '<option value="' + today + '">' + t('today') + ' (' + today + ')</option>';
  dates.forEach(function(d) {
    if (d === today) return;
    sel.innerHTML += '<option value="' + d + '"' + (d === _sessionDate ? ' selected' : '') + '>' + t('session') + ' ' + d + '</option>';
  });
}

function renderPlanGrid() {
  var container = document.getElementById('plan-grid');
  if (!container || !_groupId) {
    if (container) container.innerHTML = '<p class="empty-msg">' + t('selectGroup') + '</p>';
    return;
  }
  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _groupId; });
  if (!group) return;

  var photos = getPhotos();
  var att = getAttendance();
  var groupAtt = (att[_groupId] && att[_groupId][_sessionDate]) || {};
  var beh = getBehavior();
  var groupBeh = (beh[_groupId] && beh[_groupId][_sessionDate]) || {};

  var html = '';
  group.students.forEach(function(s) {
    var status = groupAtt[s.id] || 'present';
    var score = groupBeh[s.id] || 0;
    var photoSrc = photos[s.id];

    html += '<div class="plan-student ' + status + '" data-id="' + s.id + '" ontouchstart="planTouchStart(event,\'' + s.id + '\')" ontouchend="planTouchEnd(event,\'' + s.id + '\')" ontouchmove="planTouchMove(event,\'' + s.id + '\')" onclick="planTap(\'' + s.id + '\')">';

    // Badge
    if (score !== 0) {
      html += '<div class="plan-student-badge ' + (score > 0 ? 'positive' : 'negative') + '">' + (score > 0 ? '+' : '') + score + '</div>';
    }

    // Photo
    html += '<div class="plan-student-photo" onclick="event.stopPropagation();addStudentPhoto(\'' + s.id + '\')">';
    if (photoSrc) html += '<img src="' + photoSrc + '" />';
    else html += '📷';
    html += '</div>';

    html += '<div class="plan-student-name">' + esc(s.name) + '</div>';
    html += '</div>';
  });

  container.innerHTML = html;
}

// Tap = cycle: present > absent > late > present
var _planTapTimer = null;
var _planTouchY = null;
function planTap(sid) {
  if (_planTapTimer) return; // swipe handled
  var att = getAttendance();
  if (!att[_groupId]) att[_groupId] = {};
  if (!att[_groupId][_sessionDate]) att[_groupId][_sessionDate] = {};
  var cur = att[_groupId][_sessionDate][sid] || 'present';
  var next = cur === 'present' ? 'absent' : cur === 'absent' ? 'late' : 'present';
  att[_groupId][_sessionDate][sid] = next;
  setAttendance(att);
  renderPlanGrid();
}

function planTouchStart(e, sid) {
  _planTouchY = e.touches[0].clientY;
  _planTapTimer = null;
}
function planTouchMove(e, sid) {
  if (_planTouchY === null) return;
  var dy = _planTouchY - e.touches[0].clientY;
  if (Math.abs(dy) > 30) {
    e.preventDefault();
    _planTapTimer = true;
    var beh = getBehavior();
    if (!beh[_groupId]) beh[_groupId] = {};
    if (!beh[_groupId][_sessionDate]) beh[_groupId][_sessionDate] = {};
    var cur = beh[_groupId][_sessionDate][sid] || 0;
    beh[_groupId][_sessionDate][sid] = dy > 0 ? cur + 1 : cur - 1;
    setBehavior(beh);
    _planTouchY = null;
    renderPlanGrid();
  }
}
function planTouchEnd(e, sid) { _planTouchY = null; }

// ═══════════════════════════════════
// CARNET DE NOTES
// ═══════════════════════════════════
function initCarnetScreen() {
  populateGroupSelects();
  var sel = document.getElementById('carnet-group-select');
  if (sel && _groupId) sel.value = _groupId;
  renderCriteriaTags();
  renderCarnetCard();
}

function onCarnetGroupChange() {
  _groupId = document.getElementById('carnet-group-select').value || null;
  if (_groupId) localStorage.setItem('evaleps-lastgroup', _groupId);
  _carnetIdx = 0;
  renderCarnetCard();
}

function renderCriteriaTags() {
  var container = document.getElementById('carnet-criteria-tags');
  if (!container) return;
  var criteria = getCriteria();
  if (criteria.length === 0) {
    container.innerHTML = '';
    return;
  }
  var html = '';
  criteria.forEach(function(c, i) {
    var text = _lang === 'en' && c.en ? c.en : c.fr;
    html += '<span class="criteria-tag' + (i === _carnetCritIdx ? ' active' : '') + '" onclick="selectCriterion(' + i + ')">' +
      esc(text.length > 20 ? text.substring(0, 18) + '..' : text) +
      '<span class="tag-x" onclick="event.stopPropagation();removeCriteria(' + i + ')">✕</span></span>';
  });
  container.innerHTML = html;
}

function selectCriterion(idx) {
  _carnetCritIdx = idx;
  renderCriteriaTags();
  renderCarnetCard();
}

function renderCarnetCard() {
  var container = document.getElementById('carnet-card-container');
  var counter = document.getElementById('carnet-counter');
  if (!container) return;

  if (!_groupId) {
    container.innerHTML = '<p class="empty-msg">' + t('selectGroup') + '</p>';
    if (counter) counter.textContent = '0/0';
    return;
  }

  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _groupId; });
  if (!group || group.students.length === 0) {
    container.innerHTML = '<p class="empty-msg">' + t('noData') + '</p>';
    return;
  }

  var criteria = getCriteria();
  if (criteria.length === 0) {
    container.innerHTML = '<p class="empty-msg">' + t('noCriteria') + '</p>';
    return;
  }

  if (_carnetIdx >= group.students.length) _carnetIdx = 0;
  if (_carnetCritIdx >= criteria.length) _carnetCritIdx = 0;
  var student = group.students[_carnetIdx];
  var crit = criteria[_carnetCritIdx];
  var critText = _lang === 'en' && crit.en ? crit.en : crit.fr;

  var photos = getPhotos();
  var evals = getEvals();
  var sessionEvals = (evals[_groupId] && evals[_groupId][_sessionDate]) || {};
  var sd = sessionEvals[student.id] || {};
  var currentVal = sd['c' + _carnetCritIdx] || '';
  var currentComment = sd._comment || '';

  var color = (groups.find(function(g) { return g.id === _groupId; }) || {}).color || 'cyan-blue';
  var photoSrc = photos[student.id];

  var html = '<div class="carnet-card ' + color + '">';

  // Photo
  html += '<div class="carnet-card-photo" onclick="addStudentPhoto(\'' + student.id + '\')">';
  if (photoSrc) html += '<img src="' + photoSrc + '" />';
  else html += '📷';
  html += '</div>';

  html += '<div class="carnet-card-name">' + esc(student.name) + '</div>';
  html += '<div class="carnet-card-criterion">' + esc(critText) + '</div>';

  // Grade buttons
  html += '<div class="grade-buttons">';
  SCALE.forEach(function(grade) {
    html += '<button class="grade-btn ' + SCALE_COLORS[grade] + (currentVal === grade ? ' selected' : '') +
      '" onclick="gradeStudent(\'' + student.id + '\',' + _carnetCritIdx + ',\'' + grade + '\')">' + grade + '</button>';
  });
  html += '</div>';

  // Comment
  html += '<input type="text" class="carnet-comment" value="' + esc(currentComment) + '" placeholder="' + t('comment') + '" onchange="saveCarnetComment(\'' + student.id + '\',this.value)" />';

  html += '</div>';
  container.innerHTML = html;

  if (counter) counter.textContent = (_carnetIdx + 1) + '/' + group.students.length;
}

function gradeStudent(sid, critIdx, grade) {
  var evals = getEvals();
  if (!evals[_groupId]) evals[_groupId] = {};
  if (!evals[_groupId][_sessionDate]) evals[_groupId][_sessionDate] = {};
  if (!evals[_groupId][_sessionDate][sid]) evals[_groupId][_sessionDate][sid] = {};

  var cur = evals[_groupId][_sessionDate][sid]['c' + critIdx];
  if (cur === grade) {
    delete evals[_groupId][_sessionDate][sid]['c' + critIdx];
  } else {
    evals[_groupId][_sessionDate][sid]['c' + critIdx] = grade;
  }
  setEvals(evals);

  // Auto-advance after short delay
  setTimeout(function() {
    carnetNext();
  }, 300);
}

function saveCarnetComment(sid, comment) {
  var evals = getEvals();
  if (!evals[_groupId]) evals[_groupId] = {};
  if (!evals[_groupId][_sessionDate]) evals[_groupId][_sessionDate] = {};
  if (!evals[_groupId][_sessionDate][sid]) evals[_groupId][_sessionDate][sid] = {};
  evals[_groupId][_sessionDate][sid]._comment = comment;
  setEvals(evals);
}

function carnetPrev() {
  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _groupId; });
  if (!group) return;
  _carnetIdx = (_carnetIdx - 1 + group.students.length) % group.students.length;
  renderCarnetCard();
}

function carnetNext() {
  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _groupId; });
  if (!group) return;
  _carnetIdx = (_carnetIdx + 1) % group.students.length;
  renderCarnetCard();
}

// ═══════════════════════════════════
// RESULTATS
// ═══════════════════════════════════
function initResultsScreen() {
  populateGroupSelects();
  var sel = document.getElementById('results-group-select');
  if (sel && _groupId) sel.value = _groupId;
  renderResultsGrid();
}

function onResultsGroupChange() {
  _groupId = document.getElementById('results-group-select').value || null;
  renderResultsGrid();
}

function renderResultsGrid() {
  var wrapper = document.getElementById('results-grid-wrapper');
  if (!wrapper || !_groupId) {
    if (wrapper) wrapper.innerHTML = '<p class="empty-msg">' + t('noData') + '</p>';
    return;
  }
  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _groupId; });
  if (!group) return;

  var criteria = getCriteria();
  var evals = getEvals();
  var groupEvals = evals[_groupId] || {};
  var dates = Object.keys(groupEvals).sort().reverse();

  if (dates.length === 0 || criteria.length === 0) {
    wrapper.innerHTML = '<p class="empty-msg">' + t('noData') + '</p>';
    return;
  }

  var html = '<table class="results-table"><thead><tr>';
  html += '<th>' + t('students') + '</th>';
  criteria.forEach(function(c) {
    var text = _lang === 'en' && c.en ? c.en : c.fr;
    html += '<th>' + esc(text.length > 18 ? text.substring(0, 16) + '..' : text) + '</th>';
  });
  html += '</tr></thead><tbody>';

  group.students.forEach(function(s) {
    html += '<tr><td>' + esc(s.name) + '</td>';
    criteria.forEach(function(c, ci) {
      // Latest eval for this criterion
      var val = '';
      for (var i = 0; i < dates.length; i++) {
        var sd = groupEvals[dates[i]][s.id];
        if (sd && sd['c' + ci]) { val = sd['c' + ci]; break; }
      }
      if (val) {
        html += '<td><span class="result-badge ' + SCALE_COLORS[val] + '">' + val + '</span></td>';
      } else {
        html += '<td>-</td>';
      }
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  wrapper.innerHTML = html;
}

// ═══════════════════════════════════
// GROUPS CRUD
// ═══════════════════════════════════
var _editingGroupId = null;

function createGroup() {
  _editingGroupId = null;
  _selectedColor = 'cyan-blue';
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
  _selectedColor = g.color || 'cyan-blue';
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
  refreshAll();
  showToast(t('saved'));
}

function deleteCurrentGroup() {
  if (!_editingGroupId) return;
  if (!confirm(t('deleteConfirm'))) return;
  var groups = getGroups().filter(function(g) { return g.id !== _editingGroupId; });
  setGroups(groups);
  var evals = getEvals(); delete evals[_editingGroupId]; setEvals(evals);
  var att = getAttendance(); delete att[_editingGroupId]; setAttendance(att);
  var beh = getBehavior(); delete beh[_editingGroupId]; setBehavior(beh);
  if (_groupId === _editingGroupId) { _groupId = null; localStorage.removeItem('evaleps-lastgroup'); }
  closeGroupModal();
  refreshAll();
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
        .map(function(l) { var p = l.split(','); return p.length === 2 && p[0].trim() && p[1].trim() ? p[1].trim() + ' ' + p[0].trim() : l.trim(); })
        .filter(function(n) { return n && n.length > 1; });
      var ta = document.getElementById('group-students-input');
      var ex = ta.value.trim();
      ta.value = ex ? ex + '\n' + lines.join('\n') : lines.join('\n');
      showToast(lines.length + ' eleves');
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
        refreshCurrentScreen();
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
  renderCriteriaTags();
  renderCarnetCard();
}

function removeCriteria(idx) {
  var criteria = getCriteria();
  criteria.splice(idx, 1);
  setCriteria(criteria);
  if (_carnetCritIdx >= criteria.length) _carnetCritIdx = Math.max(0, criteria.length - 1);
  renderCriteriaTags();
  renderCarnetCard();
}

// ─── LEXIQUE ───
function openLexiqueModal() {
  renderLexique();
  document.getElementById('lexique-modal').classList.remove('hidden');
}
function closeLexiqueModal() {
  document.getElementById('lexique-modal').classList.add('hidden');
  renderCriteriaTags();
  renderCarnetCard();
}

function renderLexique() {
  var container = document.getElementById('lexique-content');
  var sel = getCriteria().map(function(c) { return c.fr; });
  var html = '';

  // Quick assess
  html += '<h3 class="lexique-comp-title">⚡ ' + (_lang === 'en' ? 'Quick Assessment' : 'Evaluation rapide') + '</h3>';
  html += '<div class="lexique-items">';
  QUICK_ASSESS.forEach(function(qa) {
    var text = _lang === 'en' ? qa.en : qa.fr;
    var s = sel.includes(qa.fr);
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
        var s = sel.includes(crit.fr);
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
    'th{background:#0077CC;color:#fff;padding:6px;border:2px solid #0066b3;font-family:Bangers,cursive;font-size:0.8rem;text-align:center;}' +
    'th:first-child{text-align:left;}td{padding:5px;border:1px solid #ddd;text-align:center;}' +
    'td:first-child{text-align:left;font-weight:700;}.g{padding:2px 8px;border-radius:4px;border:2px solid #0077CC;font-family:Bangers,cursive;}' +
    '.footer{text-align:center;margin-top:20px;font-size:0.8rem;color:#999;}' +
    '@media print{@page{margin:10mm;}}</style></head><body>';
  html += '<h1>' + esc(group.name) + ' — EVALEPS</h1>';

  dates.forEach(function(date) {
    var sd = groupEvals[date] || {};
    html += '<h2>' + date + '</h2><table><thead><tr><th>Eleve</th>';
    criteria.forEach(function(c) {
      var tx = _lang === 'en' && c.en ? c.en : c.fr;
      html += '<th>' + esc(tx.length > 18 ? tx.substring(0, 16) + '..' : tx) + '</th>';
    });
    html += '<th>Note</th></tr></thead><tbody>';
    group.students.forEach(function(s) {
      var d = sd[s.id] || {};
      html += '<tr><td>' + esc(s.name) + '</td>';
      criteria.forEach(function(c, ci) {
        var v = d['c' + ci] || '';
        html += v ? '<td><span class="g" style="background:' + gradeColor(v) + ';">' + v + '</span></td>' : '<td></td>';
      });
      html += '<td style="font-size:0.75rem;">' + esc(d._comment || '') + '</td></tr>';
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
  var lines = [['Date', 'Eleve'].concat(criteria.map(function(c) { return c.fr; })).concat(['Commentaire']).join(',')];
  Object.keys(groupEvals).sort().forEach(function(date) {
    var sd = groupEvals[date];
    group.students.forEach(function(s) {
      var d = sd[s.id] || {};
      var row = [date, '"' + s.name + '"'];
      criteria.forEach(function(c, ci) { row.push(d['c' + ci] || ''); });
      row.push('"' + (d._comment || '') + '"');
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
function populateGroupSelects() {
  var groups = getGroups();
  ['plan-group-select', 'carnet-group-select', 'results-group-select'].forEach(function(id) {
    var sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = '<option value="">' + t('selectGroup') + '</option>';
    groups.forEach(function(g) {
      sel.innerHTML += '<option value="' + g.id + '"' + (g.id === _groupId ? ' selected' : '') + '>' + esc(g.name) + ' (' + g.students.length + ')</option>';
    });
  });
}

function refreshAll() {
  var activeScreen = document.querySelector('.screen.active');
  var id = activeScreen ? activeScreen.id.replace('screen-', '') : 'hub';
  switchScreen(id);
}

function refreshCurrentScreen() {
  var activeScreen = document.querySelector('.screen.active');
  if (!activeScreen) return;
  var id = activeScreen.id.replace('screen-', '');
  if (id === 'hub') renderHub();
  if (id === 'plan') renderPlanGrid();
  if (id === 'carnet') renderCarnetCard();
  if (id === 'results') renderResultsGrid();
}

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function esc(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''; }
function gradeColor(v) {
  var c = { A:'#00C853', B:'#66ff99', C:'#FFD600', D:'#FF6D00', E:'#FF1744' };
  return c[v] || '#999';
}
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

  var lastGroup = localStorage.getItem('evaleps-lastgroup');
  var groups = getGroups();
  if (lastGroup && groups.some(function(g) { return g.id === lastGroup; })) {
    _groupId = lastGroup;
  } else if (groups.length > 0) {
    _groupId = groups[0].id;
  }

  switchScreen('hub');
});
