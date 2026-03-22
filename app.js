/* ============================================================
   EvalEPS — Carnet d'evaluation
   Simple comme un cahier papier
   ============================================================ */
'use strict';

// ─── i18n ───
const I18N = {
  fr: {
    appName: 'EvalEPS',
    heroTitle: 'CARNET D\'EVALUATION<br /><span class="hero-accent">EDUCATION PHYSIQUE</span>',
    heroAccent: 'EDUCATION PHYSIQUE',
    heroDesc: 'Simple comme un cahier papier. Tape pour noter.',
    feat1: 'Grille tactile — <strong>tape pour noter</strong>',
    feat2: '<strong>Lexique PFEQ</strong> integre',
    feat3: '<strong>Tablette et ordinateur</strong>',
    feat4: '<strong>PDF et impression</strong> en un clic',
    ctaStart: 'Ouvrir mon carnet',
    selectGroup: '-- Groupe --',
    today: 'Aujourd\'hui',
    pfeq: 'PFEQ',
    addCol: 'Colonne',
    gridEmpty: 'Choisis un groupe pour ouvrir ton carnet.',
    newGroup: '👥 Nouveau groupe',
    editGroup: '✏️ Modifier le groupe',
    groupName: 'Nom du groupe',
    groupStudents: 'Eleves (un par ligne)',
    save: 'Sauvegarder',
    import: '📥 Importer',
    cancel: 'Annuler',
    lexiqueTitle: '📚 Lexique PFEQ',
    student: 'Eleve',
    abs: 'ABS',
    note: 'Note',
    saved: 'Sauvegarde !',
    deleted: 'Supprime !',
    exported: 'PDF genere !',
    confirmDelete: 'Supprimer ce groupe et toutes ses evaluations ?',
    addColPrompt: 'Nom de la colonne (critere) :',
    session: 'Seance',
    noStudents: 'Aucun eleve. Modifie le groupe pour en ajouter.',
    noCriteria: 'Ajoute des colonnes avec le bouton "+ Colonne" ou depuis le lexique PFEQ.',
    deleteGroup: 'Supprimer le groupe',
    editGrp: 'Groupe',
    howTitle: 'Comment ca marche ?',
    howStep1Title: 'Cree ton groupe',
    howStep1Desc: 'Ajoute le nom de ton groupe et entre tes eleves (un par ligne). Tu peux aussi importer un fichier CSV ou TXT.',
    howStep2Title: 'Choisis tes criteres',
    howStep2Desc: 'Ajoute des colonnes avec le bouton <strong>+ Colonne</strong> ou pioche dans le <strong>lexique PFEQ</strong> integre (3 competences, evaluation rapide).',
    howStep3Title: 'Tape pour noter',
    howStep3Desc: 'Tape sur une case pour faire defiler les notes (A > B > C > D > E > vide). Choisis ton echelle : lettres, chiffres, symboles ou coches.',
    howStep4Title: 'Exporte en un clic',
    howStep4Desc: 'Genere un <strong>PDF</strong> pour imprimer ou un <strong>CSV</strong> pour Excel. Tes donnees sont sauvegardees automatiquement sur ton appareil.',
    howExtra1: 'Change la date pour consulter ou modifier une <strong>seance precedente</strong>',
    howExtra2: 'Marque un eleve <strong>absent</strong> en tapant la colonne ABS',
    howExtra3: 'Ajoute une <strong>note</strong> personnalisee pour chaque eleve',
    howExtra4: 'Survole un en-tete de colonne pour <strong>supprimer</strong> un critere',
  },
  en: {
    appName: 'EvalPE',
    heroTitle: 'ASSESSMENT NOTEBOOK<br /><span class="hero-accent">PHYSICAL EDUCATION</span>',
    heroAccent: 'PHYSICAL EDUCATION',
    heroDesc: 'Simple as a paper notebook. Tap to grade.',
    feat1: 'Touch grid — <strong>tap to grade</strong>',
    feat2: '<strong>PFEQ Lexicon</strong> integrated',
    feat3: '<strong>Tablet and computer</strong>',
    feat4: '<strong>PDF and print</strong> in one click',
    ctaStart: 'Open my notebook',
    selectGroup: '-- Group --',
    today: 'Today',
    pfeq: 'PFEQ',
    addCol: 'Column',
    gridEmpty: 'Select a group to open your notebook.',
    newGroup: '👥 New Group',
    editGroup: '✏️ Edit Group',
    groupName: 'Group name',
    groupStudents: 'Students (one per line)',
    save: 'Save',
    import: '📥 Import',
    cancel: 'Cancel',
    lexiqueTitle: '📚 PFEQ Lexicon',
    student: 'Student',
    abs: 'ABS',
    note: 'Note',
    saved: 'Saved!',
    deleted: 'Deleted!',
    exported: 'PDF generated!',
    confirmDelete: 'Delete this group and all its assessments?',
    addColPrompt: 'Column name (criterion):',
    session: 'Session',
    noStudents: 'No students. Edit the group to add some.',
    noCriteria: 'Add columns with "+ Column" button or from the PFEQ lexicon.',
    deleteGroup: 'Delete group',
    editGrp: 'Group',
    howTitle: 'How does it work?',
    howStep1Title: 'Create your group',
    howStep1Desc: 'Add your group name and enter your students (one per line). You can also import a CSV or TXT file.',
    howStep2Title: 'Choose your criteria',
    howStep2Desc: 'Add columns with the <strong>+ Column</strong> button or pick from the built-in <strong>PFEQ lexicon</strong> (3 competencies, quick assessment).',
    howStep3Title: 'Tap to grade',
    howStep3Desc: 'Tap a cell to cycle through grades (A > B > C > D > E > empty). Choose your scale: letters, numbers, symbols or checks.',
    howStep4Title: 'Export in one click',
    howStep4Desc: 'Generate a <strong>PDF</strong> to print or a <strong>CSV</strong> for Excel. Your data is saved automatically on your device.',
    howExtra1: 'Change the date to view or edit a <strong>previous session</strong>',
    howExtra2: 'Mark a student <strong>absent</strong> by tapping the ABS column',
    howExtra3: 'Add a custom <strong>note</strong> for each student',
    howExtra4: 'Hover a column header to <strong>delete</strong> a criterion',
  }
};

let _lang = 'fr';
function t(k) { return (I18N[_lang] && I18N[_lang][k]) || (I18N.fr[k]) || k; }

function setLang(lang) {
  _lang = lang;
  localStorage.setItem('evaleps-lang', lang);
  document.getElementById('lang-select').value = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var v = t(el.getAttribute('data-i18n'));
    if (v) el.innerHTML = v;
  });
  renderGrid();
}

// ─── LEXIQUE PFEQ ───
const LEXIQUE_PFEQ = [
  {
    competence: 'Competence 1 — Agir',
    competence_en: 'Competency 1 — To act',
    composantes: [
      { nom: 'Analyser la situation', nom_en: 'Analyze the situation', criteres: [
        { fr: 'Identifie les elements de la tache (but, regles, contraintes)', en: 'Identifies task elements (goal, rules, constraints)' },
        { fr: 'Reconnait les possibilites de l\'espace de travail', en: 'Recognizes work space possibilities' },
        { fr: 'Reconnait les risques et adopte des comportements securitaires', en: 'Recognizes risks and adopts safe behaviors' },
      ]},
      { nom: 'Elaborer un plan d\'action', nom_en: 'Develop an action plan', criteres: [
        { fr: 'Choisit les actions motrices appropriees', en: 'Chooses appropriate motor actions' },
        { fr: 'Organise ses actions en sequence logique', en: 'Organizes actions in logical sequence' },
        { fr: 'Selectionne des strategies adaptees', en: 'Selects adapted strategies' },
      ]},
      { nom: 'Executer des actions motrices', nom_en: 'Execute motor actions', criteres: [
        { fr: 'Courir a differentes vitesses et directions', en: 'Run at different speeds and directions' },
        { fr: 'Sauter de differentes facons', en: 'Jump in different ways' },
        { fr: 'Lancer avec precision vers une cible', en: 'Throw accurately at a target' },
        { fr: 'Attraper un objet en mouvement', en: 'Catch a moving object' },
        { fr: 'Frapper avec la main, le pied ou un outil', en: 'Strike with hand, foot or tool' },
        { fr: 'Dribler un ballon de facon controlee', en: 'Dribble a ball in a controlled way' },
        { fr: 'Maintenir son equilibre (statique et dynamique)', en: 'Maintain balance (static and dynamic)' },
        { fr: 'Effectuer des rotations (roulades, vrilles)', en: 'Perform rotations (rolls, twists)' },
        { fr: 'Se recevoir de facon securitaire', en: 'Land safely' },
      ]},
      { nom: 'Evaluer sa demarche', nom_en: 'Evaluate process', criteres: [
        { fr: 'Compare sa performance aux criteres de reussite', en: 'Compares performance to success criteria' },
        { fr: 'Identifie les ajustements necessaires', en: 'Identifies necessary adjustments' },
        { fr: 'Reconnait ses reussites et difficultes', en: 'Recognizes successes and difficulties' },
      ]},
    ]
  },
  {
    competence: 'Competence 2 — Interagir',
    competence_en: 'Competency 2 — To interact',
    composantes: [
      { nom: 'Analyser la situation d\'interaction', nom_en: 'Analyze interaction', criteres: [
        { fr: 'Identifie le type d\'interaction (coop, opposition)', en: 'Identifies interaction type (coop, opposition)' },
        { fr: 'Tient compte de la position des partenaires/adversaires', en: 'Considers partners/opponents position' },
        { fr: 'Identifie les espaces libres', en: 'Identifies open spaces' },
      ]},
      { nom: 'Elaborer un plan en interaction', nom_en: 'Plan in interaction', criteres: [
        { fr: 'Communique ses intentions aux partenaires', en: 'Communicates intentions to partners' },
        { fr: 'Propose des strategies adaptees', en: 'Proposes adapted strategies' },
        { fr: 'Accepte les idees des autres', en: 'Accepts others\' ideas' },
      ]},
      { nom: 'Executer en interaction', nom_en: 'Execute in interaction', criteres: [
        { fr: 'Synchronise ses actions avec ses partenaires', en: 'Synchronizes actions with partners' },
        { fr: 'Se deplace pour se rendre disponible', en: 'Moves to become available' },
        { fr: 'Utilise des feintes pour tromper l\'adversaire', en: 'Uses feints to deceive opponents' },
        { fr: 'Anticipe les actions de l\'adversaire', en: 'Anticipates opponent actions' },
        { fr: 'Passe avec precision', en: 'Passes accurately' },
        { fr: 'Exerce une pression defensive appropriee', en: 'Applies appropriate defensive pressure' },
      ]},
      { nom: 'Ethique et fair-play', nom_en: 'Ethics and fair play', criteres: [
        { fr: 'Accepte la victoire et la defaite avec grace', en: 'Accepts victory and defeat gracefully' },
        { fr: 'Respecte les adversaires', en: 'Respects opponents' },
        { fr: 'Joue dans le respect des regles', en: 'Plays within the rules' },
        { fr: 'Encourage ses partenaires', en: 'Encourages partners' },
      ]},
    ]
  },
  {
    competence: 'Competence 3 — Mode de vie sain',
    competence_en: 'Competency 3 — Healthy lifestyle',
    composantes: [
      { nom: 'Habitudes de vie', nom_en: 'Lifestyle habits', criteres: [
        { fr: 'Identifie les effets de l\'activite physique sur le corps', en: 'Identifies effects of physical activity on body' },
        { fr: 'S\'engage activement dans les activites', en: 'Actively engages in activities' },
        { fr: 'Pratique l\'echauffement et le retour au calme', en: 'Practices warm-up and cool-down' },
        { fr: 'Respecte les regles de securite', en: 'Respects safety rules' },
        { fr: 'S\'hydrate adequatement', en: 'Hydrates adequately' },
      ]},
    ]
  }
];

// Quick assess items
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
const SCALES = {
  ABCDE: ['A', 'B', 'C', 'D', 'E'],
  '12345': ['5', '4', '3', '2', '1'],
  symbols: ['++', '+', '=', '-', '--'],
  check: ['ok', '~', 'no']
};

// ─── STATE ───
let _groupId = null;
let _sessionDate = todayStr();
let _scale = 'ABCDE';

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

// ─── OPEN NOTEBOOK ───
function openNotebook() {
  document.getElementById('hero-section').classList.add('hidden');
  document.getElementById('notebook').classList.remove('hidden');
  restoreScale();
  // Auto-select last used group
  var lastGroup = localStorage.getItem('evaleps-lastgroup');
  if (lastGroup) _groupId = lastGroup;
  renderGroupTabs();
  populateDateSelect();
  renderGrid();
}

// ─── GROUP TABS ───
function renderGroupTabs() {
  var container = document.getElementById('group-tabs');
  var groups = getGroups();
  var html = '';

  groups.forEach(function(g) {
    html += '<button class="group-tab' + (g.id === _groupId ? ' active' : '') + '" data-id="' + g.id + '">' +
      esc(g.name) + '<span class="tab-count">(' + g.students.length + ')</span></button>';
  });

  html += '<button class="group-tab-add" onclick="createGroup()" title="' + t('newGroup') + '">+</button>';
  container.innerHTML = html;

  // Click handlers
  container.querySelectorAll('.group-tab').forEach(function(tab) {
    tab.addEventListener('click', function() { selectGroup(tab.dataset.id); });
  });
}

function selectGroup(id) {
  _groupId = id;
  localStorage.setItem('evaleps-lastgroup', id);
  _sessionDate = todayStr();
  renderGroupTabs();
  populateDateSelect();
  renderGrid();
}

// ─── DATE SELECT ───
function populateDateSelect() {
  var sel = document.getElementById('date-select');
  var evals = getEvals();
  var groupEvals = _groupId ? (evals[_groupId] || {}) : {};
  var dates = Object.keys(groupEvals).sort().reverse();
  var today = todayStr();

  sel.innerHTML = '';
  var todayOpt = document.createElement('option');
  todayOpt.value = today;
  todayOpt.textContent = t('today') + ' (' + today + ')';
  todayOpt.selected = _sessionDate === today;
  sel.appendChild(todayOpt);

  dates.forEach(function(d) {
    if (d === today) return;
    var opt = document.createElement('option');
    opt.value = d;
    opt.textContent = t('session') + ' ' + d;
    opt.selected = d === _sessionDate;
    sel.appendChild(opt);
  });
}

function onDateChange() {
  _sessionDate = document.getElementById('date-select').value || todayStr();
  renderGrid();
}

// ─── SCALE ───
function restoreScale() {
  _scale = localStorage.getItem('evaleps-scale') || 'ABCDE';
  document.getElementById('scale-select').value = _scale;
}

function setScale(val) {
  _scale = val;
  localStorage.setItem('evaleps-scale', val);
  renderGrid();
}

// ─── THE GRID — heart of the notebook ───
function renderGrid() {
  var wrapper = document.getElementById('grid-wrapper');
  var empty = document.getElementById('grid-empty');

  if (!_groupId) {
    wrapper.innerHTML = '<p class="grid-empty">' + t('gridEmpty') + '</p>';
    return;
  }

  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _groupId; });
  if (!group || group.students.length === 0) {
    wrapper.innerHTML = '<p class="grid-empty">' + t('noStudents') + '</p>';
    return;
  }

  var criteria = getCriteria();
  if (criteria.length === 0) {
    wrapper.innerHTML = '<p class="grid-empty">' + t('noCriteria') + '</p>';
    return;
  }

  var evals = getEvals();
  var sessionEvals = (evals[_groupId] && evals[_groupId][_sessionDate]) || {};
  var photos = getPhotos();

  var html = '<table class="eval-grid"><thead><tr>';
  html += '<th>' + t('student') + '</th>';

  criteria.forEach(function(c, i) {
    var text = _lang === 'en' && c.en ? c.en : c.fr;
    var short = text.length > 25 ? text.substring(0, 23) + '..' : text;
    html += '<th title="' + esc(text) + '">' + esc(short) +
      '<span class="th-delete" onclick="removeCriteria(' + i + ')">✕</span></th>';
  });

  html += '<th>' + t('abs') + '</th>';
  html += '<th>' + t('note') + '</th>';
  html += '</tr></thead><tbody>';

  group.students.forEach(function(s) {
    var sd = sessionEvals[s.id] || {};
    var isAbs = sd._absent || false;

    html += '<tr' + (isAbs ? ' class="absent"' : '') + '>';
    var photoSrc = photos[s.id];
    html += '<td><div class="student-cell">';
    if (photoSrc) {
      html += '<img src="' + photoSrc + '" class="student-photo" onclick="addStudentPhoto(\'' + s.id + '\')" />';
    } else {
      html += '<span class="student-photo-placeholder" onclick="addStudentPhoto(\'' + s.id + '\')">📷</span>';
    }
    html += '<span>' + esc(s.name) + '</span></div></td>';

    criteria.forEach(function(c, ci) {
      var val = sd['c' + ci] || '';
      html += '<td><button class="eval-cell" data-s="' + s.id + '" data-c="' + ci + '"' +
        (val ? ' data-val="' + esc(val) + '"' : '') + '>' + (val || '·') + '</button></td>';
    });

    // Absent
    html += '<td><button class="eval-cell abs-btn" data-s="' + s.id + '" data-action="abs"' +
      (isAbs ? ' data-val="abs"' : '') + '>' + (isAbs ? 'ABS' : '·') + '</button></td>';

    // Comment
    var comment = sd._comment || '';
    html += '<td><input type="text" class="eval-comment" data-s="' + s.id + '" value="' + esc(comment) + '" placeholder="..." /></td>';

    html += '</tr>';
  });

  html += '</tbody></table>';
  wrapper.innerHTML = html;

  // Event: tap to cycle grade
  wrapper.querySelectorAll('.eval-cell[data-c]').forEach(function(cell) {
    cell.addEventListener('click', function() { cycleGrade(cell); });
  });

  // Event: absent toggle
  wrapper.querySelectorAll('[data-action="abs"]').forEach(function(cell) {
    cell.addEventListener('click', function() { toggleAbsent(cell.dataset.s); });
  });

  // Event: comment
  wrapper.querySelectorAll('.eval-comment').forEach(function(inp) {
    inp.addEventListener('input', function() { saveComment(inp.dataset.s, inp.value); });
  });
}

function cycleGrade(cell) {
  var vals = SCALES[_scale] || SCALES.ABCDE;
  var cur = cell.getAttribute('data-val') || '';
  var idx = vals.indexOf(cur);
  var next = idx >= 0 && idx < vals.length - 1 ? vals[idx + 1] : (idx === vals.length - 1 ? '' : vals[0]);

  var sid = cell.dataset.s;
  var ci = cell.dataset.c;
  var evals = getEvals();
  if (!evals[_groupId]) evals[_groupId] = {};
  if (!evals[_groupId][_sessionDate]) evals[_groupId][_sessionDate] = {};
  if (!evals[_groupId][_sessionDate][sid]) evals[_groupId][_sessionDate][sid] = {};

  if (next) {
    evals[_groupId][_sessionDate][sid]['c' + ci] = next;
    cell.setAttribute('data-val', next);
    cell.textContent = next;
  } else {
    delete evals[_groupId][_sessionDate][sid]['c' + ci];
    cell.removeAttribute('data-val');
    cell.textContent = '·';
  }
  setEvals(evals);
}

function toggleAbsent(sid) {
  var evals = getEvals();
  if (!evals[_groupId]) evals[_groupId] = {};
  if (!evals[_groupId][_sessionDate]) evals[_groupId][_sessionDate] = {};
  if (!evals[_groupId][_sessionDate][sid]) evals[_groupId][_sessionDate][sid] = {};
  evals[_groupId][_sessionDate][sid]._absent = !evals[_groupId][_sessionDate][sid]._absent;
  setEvals(evals);
  renderGrid();
}

function saveComment(sid, comment) {
  var evals = getEvals();
  if (!evals[_groupId]) evals[_groupId] = {};
  if (!evals[_groupId][_sessionDate]) evals[_groupId][_sessionDate] = {};
  if (!evals[_groupId][_sessionDate][sid]) evals[_groupId][_sessionDate][sid] = {};
  evals[_groupId][_sessionDate][sid]._comment = comment;
  setEvals(evals);
}

// ─── STUDENT PHOTOS ───
function addStudentPhoto(studentId) {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  input.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var maxSize = 150;
        var w = img.width, h = img.height;
        if (w > h) { h = maxSize * h / w; w = maxSize; }
        else { w = maxSize * w / h; h = maxSize; }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        var dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        var photos = getPhotos();
        photos[studentId] = dataUrl;
        setPhotos(photos);
        renderGrid();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
  input.click();
}

// ─── ADD / REMOVE CRITERIA (columns) ───
function addColumnPrompt() {
  var name = prompt(t('addColPrompt'));
  if (!name || !name.trim()) return;
  var criteria = getCriteria();
  criteria.push({ fr: name.trim(), en: name.trim(), custom: true });
  setCriteria(criteria);
  renderGrid();
}

function removeCriteria(idx) {
  var criteria = getCriteria();
  criteria.splice(idx, 1);
  setCriteria(criteria);
  renderGrid();
}

// ─── GROUPS CRUD ───
var _editingGroupId = null;

function createGroup() {
  _editingGroupId = null;
  document.getElementById('group-name-input').value = '';
  document.getElementById('group-students-input').value = '';
  document.getElementById('group-modal-title').innerHTML = t('newGroup');
  document.getElementById('group-modal').classList.remove('hidden');
  document.getElementById('group-name-input').focus();
}

function editCurrentGroup() {
  if (!_groupId) return createGroup();
  var groups = getGroups();
  var g = groups.find(function(x) { return x.id === _groupId; });
  if (!g) return;
  _editingGroupId = _groupId;
  document.getElementById('group-name-input').value = g.name;
  document.getElementById('group-students-input').value = g.students.map(function(s) { return s.name; }).join('\n');
  document.getElementById('group-modal-title').innerHTML = t('editGroup');
  document.getElementById('group-modal').classList.remove('hidden');
  document.getElementById('group-name-input').focus();
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
      groups[idx].students = names.map(function(n) {
        var found = existing.find(function(e) { return e.name === n; });
        return found || { id: genId(), name: n };
      });
    }
  } else {
    var newGroup = {
      id: genId(),
      name: name,
      students: names.map(function(n) { return { id: genId(), name: n }; })
    };
    groups.push(newGroup);
    _groupId = newGroup.id;
    localStorage.setItem('evaleps-lastgroup', _groupId);
  }

  setGroups(groups);
  closeGroupModal();
  renderGroupTabs();
  renderGrid();
  showToast(t('saved'));
}

function deleteCurrentGroup() {
  if (!_groupId) return;
  if (!confirm(t('confirmDelete'))) return;
  var groups = getGroups().filter(function(g) { return g.id !== _groupId; });
  setGroups(groups);
  var evals = getEvals();
  delete evals[_groupId];
  setEvals(evals);
  _groupId = null;
  localStorage.removeItem('evaleps-lastgroup');
  closeGroupModal();
  renderGroupTabs();
  renderGrid();
  showToast(t('deleted'));
}

function closeGroupModal() {
  document.getElementById('group-modal').classList.add('hidden');
  _editingGroupId = null;
}

function importStudentList() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv,.txt';
  input.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      var lines = ev.target.result.split(/[\n\r]+/)
        .map(function(l) {
          var parts = l.split(',');
          if (parts.length === 2 && parts[0].trim() && parts[1].trim()) return parts[1].trim() + ' ' + parts[0].trim();
          return l.trim();
        })
        .filter(function(n) { return n && n.length > 1; });
      var ta = document.getElementById('group-students-input');
      var existing = ta.value.trim();
      ta.value = existing ? existing + '\n' + lines.join('\n') : lines.join('\n');
      showToast(lines.length + ' eleves importes');
    };
    reader.readAsText(file);
  });
  input.click();
}

// ─── LEXIQUE MODAL ───
function openLexiqueModal() {
  renderLexique();
  document.getElementById('lexique-modal').classList.remove('hidden');
}

function closeLexiqueModal() {
  document.getElementById('lexique-modal').classList.add('hidden');
  renderGrid();
}

function renderLexique() {
  var container = document.getElementById('lexique-content');
  var currentCriteria = getCriteria();
  var selectedFrs = currentCriteria.map(function(c) { return c.fr; });
  var html = '';

  // Quick assess
  html += '<div class="lexique-competence">';
  html += '<h3 class="lexique-comp-title">' + (_lang === 'en' ? '⚡ Quick Assessment' : '⚡ Evaluation rapide') + '</h3>';
  html += '<div class="lexique-items">';
  QUICK_ASSESS.forEach(function(qa) {
    var text = _lang === 'en' ? qa.en : qa.fr;
    var sel = selectedFrs.includes(qa.fr);
    html += '<div class="lexique-item' + (sel ? ' selected' : '') + '" data-fr="' + esc(qa.fr) + '" data-en="' + esc(qa.en) + '">' +
      '<span class="lexique-item-check">✓</span>' +
      '<span class="lexique-item-text">' + esc(text) + '</span></div>';
  });
  html += '</div></div>';

  // Competences
  LEXIQUE_PFEQ.forEach(function(comp) {
    html += '<div class="lexique-competence">';
    html += '<h3 class="lexique-comp-title">' + esc(_lang === 'en' ? comp.competence_en : comp.competence) + '</h3>';
    comp.composantes.forEach(function(compo) {
      html += '<h4 class="lexique-category">' + esc(_lang === 'en' ? compo.nom_en : compo.nom) + '</h4>';
      html += '<div class="lexique-items">';
      compo.criteres.forEach(function(crit) {
        var text = _lang === 'en' ? crit.en : crit.fr;
        var sel = selectedFrs.includes(crit.fr);
        html += '<div class="lexique-item' + (sel ? ' selected' : '') + '" data-fr="' + esc(crit.fr) + '" data-en="' + esc(crit.en) + '">' +
          '<span class="lexique-item-check">✓</span>' +
          '<span class="lexique-item-text">' + esc(text) + '</span></div>';
      });
      html += '</div>';
    });
    html += '</div>';
  });

  container.innerHTML = html;

  // Click to toggle
  container.querySelectorAll('.lexique-item').forEach(function(item) {
    item.addEventListener('click', function() {
      var fr = item.dataset.fr;
      var en = item.dataset.en;
      var criteria = getCriteria();
      var idx = criteria.findIndex(function(c) { return c.fr === fr; });
      if (idx >= 0) {
        criteria.splice(idx, 1);
        item.classList.remove('selected');
      } else {
        criteria.push({ fr: fr, en: en });
        item.classList.add('selected');
      }
      setCriteria(criteria);
    });
  });
}

// ─── EXPORT PDF ───
function exportPDF() {
  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _groupId; });
  if (!group) return;
  var evals = getEvals();
  var criteria = getCriteria();

  var groupEvals = evals[_groupId] || {};
  var dates = Object.keys(groupEvals).sort();
  if (dates.length === 0) dates = [_sessionDate];

  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
    '<title>EvalEPS — ' + esc(group.name) + '</title>' +
    '<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">' +
    '<style>' +
    'body{font-family:Nunito,sans-serif;margin:20px;color:#222;}' +
    'h1{font-family:Fredoka,sans-serif;color:#0077CC;text-align:center;font-size:1.4rem;}' +
    'h2{font-family:Fredoka,sans-serif;color:#0077CC;margin:20px 0 6px;font-size:1.1rem;}' +
    'table{width:100%;border-collapse:collapse;font-size:0.8rem;margin-bottom:16px;}' +
    'th{background:#f0f7ff;padding:6px 4px;text-align:center;border:1px solid #ddd;font-family:Fredoka,sans-serif;font-size:0.7rem;color:#0077CC;}' +
    'th:first-child{text-align:left;}' +
    'td{padding:5px;border:1px solid #ddd;text-align:center;}' +
    'td:first-child{text-align:left;font-weight:700;}' +
    '.g{display:inline-block;padding:2px 6px;border-radius:3px;color:#fff;font-weight:700;font-size:0.75rem;}' +
    '.footer{text-align:center;margin-top:24px;font-size:0.75rem;color:#999;}' +
    '.footer a{color:#0077CC;}' +
    '@media print{@page{margin:10mm;}}' +
    '</style></head><body>';

  html += '<h1>📋 ' + esc(group.name) + ' — EvalEPS</h1>';

  dates.forEach(function(date) {
    var sd = groupEvals[date] || {};
    html += '<h2>' + date + '</h2>';
    html += '<table><thead><tr><th>' + t('student') + '</th>';
    criteria.forEach(function(c) {
      var text = _lang === 'en' && c.en ? c.en : c.fr;
      html += '<th>' + esc(text.length > 20 ? text.substring(0, 18) + '..' : text) + '</th>';
    });
    html += '<th>' + t('note') + '</th></tr></thead><tbody>';

    group.students.forEach(function(s) {
      var d = sd[s.id] || {};
      if (d._absent) {
        html += '<tr style="opacity:0.35;"><td>' + esc(s.name) + '</td>';
        criteria.forEach(function() { html += '<td>ABS</td>'; });
        html += '<td></td></tr>';
        return;
      }
      html += '<tr><td>' + esc(s.name) + '</td>';
      criteria.forEach(function(c, ci) {
        var v = d['c' + ci] || '';
        html += v ? '<td><span class="g" style="background:' + gradeColor(v) + ';">' + esc(v) + '</span></td>' : '<td></td>';
      });
      html += '<td style="font-size:0.7rem;text-align:left;">' + esc(d._comment || '') + '</td></tr>';
    });
    html += '</tbody></table>';
  });

  html += '<div class="footer"><a href="https://zonetotalsport.ca">zonetotalsport.ca</a> — EvalEPS</div>';
  html += '</body></html>';

  var w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  setTimeout(function() { w.print(); }, 400);
  showToast(t('exported'));
}

// ─── EXPORT CSV ───
function exportCSV() {
  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _groupId; });
  if (!group) return;
  var evals = getEvals();
  var criteria = getCriteria();
  var groupEvals = evals[_groupId] || {};

  var lines = [];
  var header = ['Date', 'Eleve'];
  criteria.forEach(function(c) { header.push(c.fr); });
  header.push('Absent', 'Commentaire');
  lines.push(header.join(','));

  Object.keys(groupEvals).sort().forEach(function(date) {
    var sd = groupEvals[date];
    group.students.forEach(function(s) {
      var d = sd[s.id] || {};
      var row = [date, '"' + s.name + '"'];
      criteria.forEach(function(c, ci) { row.push(d['c' + ci] || ''); });
      row.push(d._absent ? 'OUI' : '');
      row.push('"' + (d._comment || '') + '"');
      lines.push(row.join(','));
    });
  });

  var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'evaleps_' + (group.name.replace(/\s+/g, '_')) + '_' + todayStr() + '.csv';
  a.click();
  showToast(t('exported'));
}

// ─── UTILITIES ───
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function esc(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''; }
function gradeColor(v) {
  var c = { A:'#2E7D32','5':'#2E7D32','++':'#2E7D32',ok:'#2E7D32', B:'#66BB6A','4':'#66BB6A','+':'#66BB6A',
    C:'#FF8C00','3':'#FF8C00','=':'#FF8C00','~':'#FF8C00', D:'#EF6C00','2':'#EF6C00','-':'#EF6C00',
    E:'#D32F2F','1':'#D32F2F','--':'#D32F2F',no:'#D32F2F' };
  return c[v] || '#999';
}
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(function() { t.classList.add('hidden'); }, 2200);
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', function() {
  var savedLang = localStorage.getItem('evaleps-lang') || 'fr';
  setLang(savedLang);

  // If returning user (has groups), skip hero
  if (getGroups().length > 0) openNotebook();
});
