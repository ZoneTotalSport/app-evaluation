/* ============================================================
   EvalEPS — Zone Total Sport
   Outil d'evaluation pour enseignants d'education physique
   ============================================================ */
'use strict';

// ─────────────────────────────────────────────────
// i18n — Internationalization
// ─────────────────────────────────────────────────
const I18N = {
  fr: {
    appName: 'EvalEPS',
    heroTitle: 'OUTIL D\'EVALUATION<br /><span class="hero-accent">EDUCATION PHYSIQUE</span>',
    heroAccent: 'EDUCATION PHYSIQUE',
    heroDesc: 'Observe, evalue et suis la progression de tes eleves en un clic',
    feat1: 'Grille d\'observation <strong>tactile et rapide</strong>',
    feat2: '<strong>Lexique PFEQ</strong> integre et cliquable',
    feat3: 'Fonctionne sur <strong>tablette et ordinateur</strong>',
    feat4: '<strong>Exporte en PDF</strong> ou imprime en un clic',
    ctaStart: 'Commencer',
    navGroups: 'Groupes',
    navCriteria: 'Criteres',
    navEvaluate: 'Evaluer',
    navResults: 'Resultats',
    groupsTitle: '👥 Mes groupes',
    groupsAdd: 'Nouveau groupe',
    groupModalTitle: '👥 Nouveau groupe',
    groupEditTitle: '✏️ Modifier le groupe',
    groupName: 'Nom du groupe',
    groupNamePh: 'Ex: 3e annee Groupe A',
    groupStudents: 'Eleves (un par ligne)',
    groupStudentsPh: 'Alexis B.\nCamille D.\nEmile F.\n...',
    groupSave: 'Sauvegarder',
    groupImport: '📥 Importer CSV/TXT',
    groupImportHint: 'Importe un fichier .csv ou .txt avec un eleve par ligne',
    cancel: 'Annuler',
    delete: 'Supprimer',
    students: 'eleves',
    criteriaTitle: '🎯 Criteres d\'evaluation',
    criteriaLexique: 'Lexique PFEQ',
    criteriaHint: 'Selectionne tes criteres depuis le lexique PFEQ ou ajoute-les manuellement.',
    criteriaCustomPh: 'Ajouter un critere personnalise...',
    scaleTitle: 'Echelle de notation',
    evalTitle: '📋 Grille d\'evaluation',
    evalSelectGroup: '-- Choisir un groupe --',
    evalToday: 'Aujourd\'hui',
    evalHint: 'Selectionne un groupe pour commencer l\'evaluation.',
    evalNoStudents: 'Aucun eleve dans ce groupe.',
    evalNoCriteria: 'Ajoute des criteres d\'evaluation dans l\'onglet Criteres.',
    resultsTitle: '📊 Resultats',
    resultsPrint: 'Imprimer',
    resultsHint: 'Les resultats de tes evaluations apparaitront ici.',
    resultsNoData: 'Aucune evaluation enregistree.',
    lexiqueTitle: '📚 Lexique PFEQ — Education physique',
    toastSaved: 'Sauvegarde !',
    toastDeleted: 'Supprime !',
    toastCopied: 'Copie !',
    toastExported: 'PDF genere !',
    confirmDelete: 'Supprimer ce groupe et toutes ses evaluations ?',
    confirmDeleteStudent: 'Retirer cet eleve ?',
    addPhoto: 'Photo',
    noPhoto: '📷',
    absent: 'ABS',
    comment: 'Commentaire',
    commentPh: 'Ajouter une note...',
    prevSession: 'Session precedente',
    nextSession: 'Session suivante',
    sessionLabel: 'Seance',
    allSessions: 'Toutes les seances',
    exportCSV: 'Exporter CSV',
    behaviorTitle: 'Comportement',
    behaviorOptions: ['Excellent', 'Bien', 'A ameliorer', 'Difficile'],
    effortTitle: 'Effort',
    effortOptions: ['Remarquable', 'Bon', 'Moyen', 'Insuffisant'],
    participTitle: 'Participation',
  },
  en: {
    appName: 'EvalPE',
    heroTitle: 'ASSESSMENT TOOL<br /><span class="hero-accent">PHYSICAL EDUCATION</span>',
    heroAccent: 'PHYSICAL EDUCATION',
    heroDesc: 'Observe, assess and track your students\' progress in one click',
    feat1: '<strong>Touch-friendly</strong> observation grid',
    feat2: '<strong>PFEQ Lexicon</strong> integrated and clickable',
    feat3: 'Works on <strong>tablet and computer</strong>',
    feat4: '<strong>Export to PDF</strong> or print in one click',
    ctaStart: 'Get Started',
    navGroups: 'Groups',
    navCriteria: 'Criteria',
    navEvaluate: 'Assess',
    navResults: 'Results',
    groupsTitle: '👥 My Groups',
    groupsAdd: 'New Group',
    groupModalTitle: '👥 New Group',
    groupEditTitle: '✏️ Edit Group',
    groupName: 'Group Name',
    groupNamePh: 'e.g. Grade 3 Group A',
    groupStudents: 'Students (one per line)',
    groupStudentsPh: 'Alex B.\nCamille D.\nEmile F.\n...',
    groupSave: 'Save',
    groupImport: '📥 Import CSV/TXT',
    groupImportHint: 'Import a .csv or .txt file with one student per line',
    cancel: 'Cancel',
    delete: 'Delete',
    students: 'students',
    criteriaTitle: '🎯 Assessment Criteria',
    criteriaLexique: 'PFEQ Lexicon',
    criteriaHint: 'Select criteria from the PFEQ lexicon or add them manually.',
    criteriaCustomPh: 'Add a custom criterion...',
    scaleTitle: 'Grading Scale',
    evalTitle: '📋 Assessment Grid',
    evalSelectGroup: '-- Select a group --',
    evalToday: 'Today',
    evalHint: 'Select a group to start the assessment.',
    evalNoStudents: 'No students in this group.',
    evalNoCriteria: 'Add assessment criteria in the Criteria tab.',
    resultsTitle: '📊 Results',
    resultsPrint: 'Print',
    resultsHint: 'Your assessment results will appear here.',
    resultsNoData: 'No assessments recorded.',
    lexiqueTitle: '📚 PFEQ Lexicon — Physical Education',
    toastSaved: 'Saved!',
    toastDeleted: 'Deleted!',
    toastCopied: 'Copied!',
    toastExported: 'PDF generated!',
    confirmDelete: 'Delete this group and all its assessments?',
    confirmDeleteStudent: 'Remove this student?',
    addPhoto: 'Photo',
    noPhoto: '📷',
    absent: 'ABS',
    comment: 'Comment',
    commentPh: 'Add a note...',
    prevSession: 'Previous session',
    nextSession: 'Next session',
    sessionLabel: 'Session',
    allSessions: 'All sessions',
    exportCSV: 'Export CSV',
    behaviorTitle: 'Behavior',
    behaviorOptions: ['Excellent', 'Good', 'Needs improvement', 'Difficult'],
    effortTitle: 'Effort',
    effortOptions: ['Outstanding', 'Good', 'Average', 'Insufficient'],
    participTitle: 'Participation',
  }
};

let _lang = 'fr';

function t(key) {
  return (I18N[_lang] && I18N[_lang][key]) || (I18N.fr[key]) || key;
}

function setLang(lang) {
  _lang = lang;
  localStorage.setItem('evaleps-lang', lang);
  document.getElementById('lang-select').value = lang;
  document.documentElement.lang = lang;
  applyI18N();
}

function applyI18N() {
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    var val = t(key);
    if (val) el.innerHTML = val;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-placeholder');
    var val = t(key);
    if (val) el.placeholder = val;
  });
}

// ─────────────────────────────────────────────────
// LEXIQUE PFEQ — Education physique primaire
// ─────────────────────────────────────────────────
const LEXIQUE_PFEQ = [
  {
    competence: 'Agir dans divers contextes de pratique d\'activites physiques',
    competence_en: 'To act in various physical activity practice contexts',
    composantes: [
      {
        nom: 'Execution de mouvements',
        nom_en: 'Movement execution',
        criteres: [
          { fr: 'Execute les actions motrices de locomotion (courir, sauter, ramper, grimper, esquiver)', en: 'Performs locomotor motor actions (running, jumping, crawling, climbing, dodging)' },
          { fr: 'Execute les actions motrices de manipulation (lancer, attraper, frapper, dribler)', en: 'Performs manipulation motor actions (throwing, catching, striking, dribbling)' },
          { fr: 'Execute les actions motrices de stabilisation (equilibre, rotation, reception)', en: 'Performs stabilization motor actions (balance, rotation, landing)' },
          { fr: 'Enchaine des actions motrices de facon fluide et coordonnee', en: 'Chains motor actions fluidly and in a coordinated manner' },
          { fr: 'Ajuste ses mouvements en fonction de l\'environnement et des contraintes', en: 'Adjusts movements based on the environment and constraints' },
          { fr: 'Demontre de la precision dans ses gestes moteurs', en: 'Demonstrates precision in motor gestures' },
          { fr: 'Applique les principes biomecaniques de base (extension, flexion, transfert de poids)', en: 'Applies basic biomechanical principles (extension, flexion, weight transfer)' },
        ]
      },
      {
        nom: 'Efficacite motrice',
        nom_en: 'Motor efficiency',
        criteres: [
          { fr: 'Utilise l\'espace de facon efficace et securitaire', en: 'Uses space efficiently and safely' },
          { fr: 'Adapte la force et la vitesse de ses mouvements a la situation', en: 'Adapts the force and speed of movements to the situation' },
          { fr: 'Maintient son equilibre dans des positions variees (statiques et dynamiques)', en: 'Maintains balance in various positions (static and dynamic)' },
          { fr: 'Coordonne les parties de son corps dans l\'action (dissociation segmentaire)', en: 'Coordinates body parts during action (segmental dissociation)' },
          { fr: 'Reagit rapidement aux signaux et aux changements de situation', en: 'Reacts quickly to signals and changing situations' },
        ]
      },
      {
        nom: 'Planification de l\'action',
        nom_en: 'Action planning',
        criteres: [
          { fr: 'Identifie les elements a considerer avant d\'agir (espace, materiel, regles)', en: 'Identifies elements to consider before acting (space, equipment, rules)' },
          { fr: 'Choisit les actions motrices appropriees a la situation', en: 'Chooses appropriate motor actions for the situation' },
          { fr: 'Planifie une sequence d\'actions en fonction d\'un objectif', en: 'Plans a sequence of actions based on an objective' },
          { fr: 'Evalue et ajuste sa performance apres l\'action', en: 'Evaluates and adjusts performance after action' },
        ]
      }
    ]
  },
  {
    competence: 'Interagir dans divers contextes de pratique d\'activites physiques',
    competence_en: 'To interact in various physical activity practice contexts',
    composantes: [
      {
        nom: 'Communication et cooperation',
        nom_en: 'Communication and cooperation',
        criteres: [
          { fr: 'Communique clairement avec ses partenaires (verbal et non verbal)', en: 'Communicates clearly with partners (verbal and non-verbal)' },
          { fr: 'Respecte les regles du jeu et les consignes de securite', en: 'Respects game rules and safety instructions' },
          { fr: 'Coopere avec ses coequipiers pour atteindre un objectif commun', en: 'Cooperates with teammates to achieve a common goal' },
          { fr: 'Accepte et valorise les differences de capacites entre les participants', en: 'Accepts and values differences in abilities among participants' },
          { fr: 'Encourage et soutient ses coequipiers', en: 'Encourages and supports teammates' },
          { fr: 'Gere les conflits de facon pacifique et respectueuse', en: 'Manages conflicts peacefully and respectfully' },
        ]
      },
      {
        nom: 'Strategies et tactiques',
        nom_en: 'Strategies and tactics',
        criteres: [
          { fr: 'Elabore des strategies offensives et defensives avec son equipe', en: 'Develops offensive and defensive strategies with the team' },
          { fr: 'Adapte ses actions en fonction de celles des adversaires', en: 'Adapts actions based on opponents\' actions' },
          { fr: 'Utilise le positionnement tactique (se demarquer, creer des espaces)', en: 'Uses tactical positioning (getting open, creating spaces)' },
          { fr: 'Fait des choix rapides et pertinents en situation de jeu', en: 'Makes quick and relevant choices during play' },
          { fr: 'Assume differents roles au sein de l\'equipe (attaquant, defenseur, gardien)', en: 'Takes on different roles within the team (attacker, defender, goalie)' },
        ]
      },
      {
        nom: 'Ethique sportive',
        nom_en: 'Sports ethics',
        criteres: [
          { fr: 'Fait preuve de fair-play en acceptant le resultat du jeu', en: 'Shows fair play by accepting the game result' },
          { fr: 'Respecte ses adversaires avant, pendant et apres l\'activite', en: 'Respects opponents before, during and after the activity' },
          { fr: 'Reconnait et felicite les bons coups de tous les participants', en: 'Recognizes and congratulates good plays by all participants' },
          { fr: 'Accepte les decisions de l\'arbitre ou de l\'enseignant', en: 'Accepts referee or teacher decisions' },
        ]
      }
    ]
  },
  {
    competence: 'Adopter un mode de vie sain et actif',
    competence_en: 'To adopt a healthy, active lifestyle',
    composantes: [
      {
        nom: 'Habitudes de vie',
        nom_en: 'Lifestyle habits',
        criteres: [
          { fr: 'S\'engage activement dans les activites physiques proposees', en: 'Actively engages in proposed physical activities' },
          { fr: 'Identifie les bienfaits de l\'activite physique sur la sante', en: 'Identifies the benefits of physical activity on health' },
          { fr: 'Applique les regles de securite et de prevention des blessures', en: 'Applies safety rules and injury prevention' },
          { fr: 'Gere son effort et son endurance pendant l\'activite', en: 'Manages effort and endurance during activity' },
          { fr: 'Demontre une attitude positive et de la perseverance', en: 'Demonstrates a positive attitude and perseverance' },
          { fr: 'Pratique un echauffement et un retour au calme adequats', en: 'Practices adequate warm-up and cool-down' },
        ]
      },
      {
        nom: 'Connaissance de soi',
        nom_en: 'Self-knowledge',
        criteres: [
          { fr: 'Identifie ses forces et ses defis en activite physique', en: 'Identifies strengths and challenges in physical activity' },
          { fr: 'Se fixe des objectifs personnels realistes et mesurables', en: 'Sets realistic and measurable personal goals' },
          { fr: 'Evalue sa propre progression et ajuste ses efforts', en: 'Evaluates own progression and adjusts efforts' },
          { fr: 'Reconnait les signaux de son corps (fatigue, soif, douleur)', en: 'Recognizes body signals (fatigue, thirst, pain)' },
        ]
      }
    ]
  }
];

// Additional quick-assess categories (common PE teacher needs)
const QUICK_ASSESS = [
  { fr: 'Comportement general', en: 'General behavior' },
  { fr: 'Effort et engagement', en: 'Effort and engagement' },
  { fr: 'Participation active', en: 'Active participation' },
  { fr: 'Respect des consignes', en: 'Following instructions' },
  { fr: 'Respect des pairs', en: 'Respect for peers' },
  { fr: 'Autonomie', en: 'Autonomy' },
  { fr: 'Esprit sportif', en: 'Sportsmanship' },
  { fr: 'Tenue vestimentaire appropriee', en: 'Appropriate attire' },
];

// ─────────────────────────────────────────────────
// SCALES
// ─────────────────────────────────────────────────
const SCALES = {
  ABCDE: ['A', 'B', 'C', 'D', 'E'],
  '12345': ['5', '4', '3', '2', '1'],
  symbols: ['++', '+', '=', '-', '--'],
  check: ['ok', '~', 'no']
};

// ─────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────
let _currentPanel = 'groups';
let _editingGroupId = null;
let _currentScale = 'ABCDE';
let _evalGroupId = null;
let _evalSessionDate = todayStr();

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────
// LOCAL STORAGE helpers
// ─────────────────────────────────────────────────
function getGroups() {
  try { return JSON.parse(localStorage.getItem('evaleps-groups') || '[]'); }
  catch { return []; }
}
function setGroups(g) { localStorage.setItem('evaleps-groups', JSON.stringify(g)); }

function getCriteria() {
  try { return JSON.parse(localStorage.getItem('evaleps-criteria') || '[]'); }
  catch { return []; }
}
function setCriteria(c) { localStorage.setItem('evaleps-criteria', JSON.stringify(c)); }

function getEvals() {
  try { return JSON.parse(localStorage.getItem('evaleps-evals') || '{}'); }
  catch { return {}; }
}
function setEvals(e) { localStorage.setItem('evaleps-evals', JSON.stringify(e)); }

function getPhotos() {
  try { return JSON.parse(localStorage.getItem('evaleps-photos') || '{}'); }
  catch { return {}; }
}
function setPhotos(p) { localStorage.setItem('evaleps-photos', JSON.stringify(p)); }

// ─────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────
function showPanel(name) {
  _currentPanel = name;

  // Hide hero, show main
  document.querySelector('.hero')?.classList.add('hidden');
  document.getElementById('main-content')?.classList.remove('hidden');

  // Toggle panels
  document.querySelectorAll('.panel').forEach(function(p) { p.classList.add('hidden'); });
  var panel = document.getElementById('panel-' + name);
  if (panel) panel.classList.remove('hidden');

  // Toggle sidebar buttons
  document.querySelectorAll('.sidebar-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.panel === name);
  });

  // Refresh panel content
  if (name === 'groups') renderGroups();
  if (name === 'criteria') renderCriteria();
  if (name === 'evaluate') refreshEvalPanel();
  if (name === 'results') renderResults();
}

// ─────────────────────────────────────────────────
// GROUPS
// ─────────────────────────────────────────────────
function renderGroups() {
  var container = document.getElementById('groups-list');
  if (!container) return;
  var groups = getGroups();

  if (groups.length === 0) {
    container.innerHTML = '<p class="panel-hint">' + t('evalHint').replace('groupe', 'groupe').replace('group', 'group') + '</p>';
    return;
  }

  container.innerHTML = '';
  groups.forEach(function(g) {
    var card = document.createElement('div');
    card.className = 'group-card' + (_evalGroupId === g.id ? ' active' : '');
    card.innerHTML =
      '<div class="group-card-name">' + escapeHtml(g.name) + '</div>' +
      '<div class="group-card-count">' + g.students.length + ' ' + t('students') + '</div>' +
      '<div class="group-card-actions">' +
        '<button class="group-action-btn" title="Modifier" data-action="edit">✏️</button>' +
        '<button class="group-action-btn delete" title="Supprimer" data-action="delete">🗑️</button>' +
      '</div>';

    card.addEventListener('click', function(e) {
      if (e.target.closest('[data-action="edit"]')) {
        editGroup(g.id);
      } else if (e.target.closest('[data-action="delete"]')) {
        deleteGroup(g.id);
      } else {
        selectGroup(g.id);
      }
    });

    container.appendChild(card);
  });
}

function selectGroup(id) {
  _evalGroupId = id;
  renderGroups();
  showPanel('evaluate');
}

function createGroup() {
  _editingGroupId = null;
  document.getElementById('group-name-input').value = '';
  document.getElementById('group-students-input').value = '';
  document.querySelector('#group-modal .modal-box-header h2').innerHTML = t('groupModalTitle');
  document.getElementById('group-modal').classList.remove('hidden');
  document.getElementById('group-name-input').focus();
}

function editGroup(id) {
  var groups = getGroups();
  var g = groups.find(function(x) { return x.id === id; });
  if (!g) return;
  _editingGroupId = id;
  document.getElementById('group-name-input').value = g.name;
  document.getElementById('group-students-input').value = g.students.map(function(s) { return s.name; }).join('\n');
  document.querySelector('#group-modal .modal-box-header h2').innerHTML = t('groupEditTitle');
  document.getElementById('group-modal').classList.remove('hidden');
  document.getElementById('group-name-input').focus();
}

function saveGroup() {
  var name = document.getElementById('group-name-input').value.trim();
  var studentsText = document.getElementById('group-students-input').value.trim();

  if (!name) return;

  var studentNames = studentsText.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
  var groups = getGroups();

  if (_editingGroupId) {
    var idx = groups.findIndex(function(g) { return g.id === _editingGroupId; });
    if (idx >= 0) {
      // Keep existing student IDs, add new ones
      var existingStudents = groups[idx].students;
      var newStudents = studentNames.map(function(sName) {
        var existing = existingStudents.find(function(es) { return es.name === sName; });
        return existing || { id: generateId(), name: sName };
      });
      groups[idx].name = name;
      groups[idx].students = newStudents;
    }
  } else {
    groups.push({
      id: generateId(),
      name: name,
      students: studentNames.map(function(sName) {
        return { id: generateId(), name: sName };
      })
    });
  }

  setGroups(groups);
  closeGroupModal();
  renderGroups();
  showToast(t('toastSaved'));
}

function deleteGroup(id) {
  if (!confirm(t('confirmDelete'))) return;
  var groups = getGroups().filter(function(g) { return g.id !== id; });
  setGroups(groups);
  if (_evalGroupId === id) _evalGroupId = null;
  // Remove evaluations for this group
  var evals = getEvals();
  delete evals[id];
  setEvals(evals);
  renderGroups();
  showToast(t('toastDeleted'));
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
      var text = ev.target.result;
      // Parse CSV or TXT: one name per line, or comma-separated
      var names = text.split(/[\n\r]+/)
        .map(function(line) {
          // Handle CSV with commas (take first column or full line)
          var parts = line.split(',');
          // If it looks like "LastName, FirstName" format
          if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
            return parts[1].trim() + ' ' + parts[0].trim();
          }
          return line.trim();
        })
        .filter(function(n) { return n && n.length > 1; });

      var textarea = document.getElementById('group-students-input');
      var existing = textarea.value.trim();
      textarea.value = existing ? existing + '\n' + names.join('\n') : names.join('\n');
      showToast(names.length + ' ' + t('students') + ' importes');
    };
    reader.readAsText(file);
  });
  input.click();
}

// ─────────────────────────────────────────────────
// STUDENT PHOTOS
// ─────────────────────────────────────────────────
function addStudentPhoto(studentId) {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  input.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    // Resize and compress
    var reader = new FileReader();
    reader.onload = function(ev) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var maxSize = 150;
        var w = img.width, h = img.height;
        if (w > h) { h = maxSize * h / w; w = maxSize; }
        else { w = maxSize * w / h; h = maxSize; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        var dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        var photos = getPhotos();
        photos[studentId] = dataUrl;
        setPhotos(photos);
        refreshEvalPanel();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
  input.click();
}

// ─────────────────────────────────────────────────
// CRITERIA
// ─────────────────────────────────────────────────
function renderCriteria() {
  var container = document.getElementById('active-criteria');
  if (!container) return;
  var criteria = getCriteria();

  // Restore scale
  _currentScale = localStorage.getItem('evaleps-scale') || 'ABCDE';
  document.querySelectorAll('input[name="scale"]').forEach(function(r) {
    r.checked = r.value === _currentScale;
  });

  if (criteria.length === 0) {
    container.innerHTML = '<p class="panel-hint">' + t('criteriaHint') + '</p>';
    return;
  }

  container.innerHTML = '';
  criteria.forEach(function(c, idx) {
    var item = document.createElement('div');
    item.className = 'criteria-item';
    item.innerHTML =
      '<span class="criteria-handle">⠿</span>' +
      '<span class="criteria-text">' + escapeHtml(_lang === 'en' && c.en ? c.en : c.fr) + '</span>' +
      '<button class="criteria-remove" title="' + t('delete') + '">✕</button>';

    item.querySelector('.criteria-remove').addEventListener('click', function() {
      var crit = getCriteria();
      crit.splice(idx, 1);
      setCriteria(crit);
      renderCriteria();
    });

    container.appendChild(item);
  });
}

function addCustomCriteria() {
  var input = document.getElementById('custom-criteria-input');
  if (!input || !input.value.trim()) return;
  var criteria = getCriteria();
  criteria.push({ fr: input.value.trim(), en: input.value.trim(), custom: true });
  setCriteria(criteria);
  input.value = '';
  renderCriteria();
}

function setScale(val) {
  _currentScale = val;
  localStorage.setItem('evaleps-scale', val);
  refreshEvalPanel();
}

// ─────────────────────────────────────────────────
// LEXIQUE MODAL
// ─────────────────────────────────────────────────
function openLexiqueModal() {
  renderLexiqueContent();
  document.getElementById('lexique-modal').classList.remove('hidden');
}

function closeLexiqueModal() {
  document.getElementById('lexique-modal').classList.add('hidden');
  renderCriteria();
}

function renderLexiqueContent() {
  var container = document.getElementById('lexique-content');
  if (!container) return;
  var currentCriteria = getCriteria();
  var selectedTexts = currentCriteria.map(function(c) { return c.fr; });

  var html = '';

  // Quick assess section
  html += '<div class="lexique-competence">';
  html += '<h3 class="lexique-comp-title">' + (_lang === 'en' ? '⚡ Quick Assessment' : '⚡ Evaluation rapide') + '</h3>';
  html += '<div class="lexique-items">';
  QUICK_ASSESS.forEach(function(qa) {
    var text = _lang === 'en' ? qa.en : qa.fr;
    var isSelected = selectedTexts.includes(qa.fr);
    html += '<div class="lexique-item' + (isSelected ? ' selected' : '') + '" data-fr="' + escapeHtml(qa.fr) + '" data-en="' + escapeHtml(qa.en) + '">' +
      '<span class="lexique-item-check">✓</span>' +
      '<span class="lexique-item-text">' + escapeHtml(text) + '</span>' +
    '</div>';
  });
  html += '</div></div>';

  // PFEQ competences
  LEXIQUE_PFEQ.forEach(function(comp) {
    html += '<div class="lexique-competence">';
    html += '<h3 class="lexique-comp-title">' + escapeHtml(_lang === 'en' ? comp.competence_en : comp.competence) + '</h3>';

    comp.composantes.forEach(function(compo) {
      html += '<h4 class="lexique-category">' + escapeHtml(_lang === 'en' ? compo.nom_en : compo.nom) + '</h4>';
      html += '<div class="lexique-items">';

      compo.criteres.forEach(function(crit) {
        var text = _lang === 'en' ? crit.en : crit.fr;
        var isSelected = selectedTexts.includes(crit.fr);
        html += '<div class="lexique-item' + (isSelected ? ' selected' : '') + '" data-fr="' + escapeHtml(crit.fr) + '" data-en="' + escapeHtml(crit.en) + '">' +
          '<span class="lexique-item-check">✓</span>' +
          '<span class="lexique-item-text">' + escapeHtml(text) + '</span>' +
        '</div>';
      });

      html += '</div>';
    });

    html += '</div>';
  });

  container.innerHTML = html;

  // Add click handlers
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

// ─────────────────────────────────────────────────
// EVALUATE — Grid
// ─────────────────────────────────────────────────
function refreshEvalPanel() {
  populateEvalGroupSelect();
  populateEvalDateSelect();
  renderEvalGrid();
}

function populateEvalGroupSelect() {
  var select = document.getElementById('eval-group-select');
  if (!select) return;
  var groups = getGroups();
  select.innerHTML = '<option value="">' + t('evalSelectGroup') + '</option>';
  groups.forEach(function(g) {
    var opt = document.createElement('option');
    opt.value = g.id;
    opt.textContent = g.name + ' (' + g.students.length + ')';
    opt.selected = g.id === _evalGroupId;
    select.appendChild(opt);
  });
}

function populateEvalDateSelect() {
  var select = document.getElementById('eval-date-select');
  if (!select) return;

  // Get all session dates for current group
  var evals = getEvals();
  var groupEvals = _evalGroupId ? (evals[_evalGroupId] || {}) : {};
  var dates = Object.keys(groupEvals).sort().reverse();
  var today = todayStr();

  select.innerHTML = '';
  // Always have today option
  var todayOpt = document.createElement('option');
  todayOpt.value = today;
  todayOpt.textContent = t('evalToday') + ' (' + today + ')';
  todayOpt.selected = _evalSessionDate === today;
  select.appendChild(todayOpt);

  dates.forEach(function(d) {
    if (d === today) return;
    var opt = document.createElement('option');
    opt.value = d;
    opt.textContent = t('sessionLabel') + ' ' + d;
    opt.selected = d === _evalSessionDate;
    select.appendChild(opt);
  });
}

function onEvalGroupChange() {
  _evalGroupId = document.getElementById('eval-group-select')?.value || null;
  _evalSessionDate = todayStr();
  populateEvalDateSelect();
  renderEvalGrid();
}

function onEvalDateChange() {
  _evalSessionDate = document.getElementById('eval-date-select')?.value || todayStr();
  renderEvalGrid();
}

function renderEvalGrid() {
  var container = document.getElementById('eval-grid-container');
  if (!container) return;

  if (!_evalGroupId) {
    container.innerHTML = '<p class="panel-hint">' + t('evalHint') + '</p>';
    return;
  }

  var groups = getGroups();
  var group = groups.find(function(g) { return g.id === _evalGroupId; });
  if (!group || group.students.length === 0) {
    container.innerHTML = '<p class="panel-hint">' + t('evalNoStudents') + '</p>';
    return;
  }

  var criteria = getCriteria();
  if (criteria.length === 0) {
    container.innerHTML = '<p class="panel-hint">' + t('evalNoCriteria') + '</p>';
    return;
  }

  var evals = getEvals();
  var groupEvals = evals[_evalGroupId] || {};
  var sessionEvals = groupEvals[_evalSessionDate] || {};
  var photos = getPhotos();
  var scaleValues = SCALES[_currentScale] || SCALES.ABCDE;

  // Build table
  var html = '<table class="eval-grid">';

  // Header
  html += '<thead><tr>';
  html += '<th>' + (_lang === 'en' ? 'Student' : 'Eleve') + '</th>';
  criteria.forEach(function(c) {
    var text = _lang === 'en' && c.en ? c.en : c.fr;
    // Truncate for header
    var short = text.length > 30 ? text.substring(0, 28) + '...' : text;
    html += '<th title="' + escapeHtml(text) + '">' + escapeHtml(short) + '</th>';
  });
  html += '<th>' + t('absent') + '</th>';
  html += '<th>' + t('comment') + '</th>';
  html += '</tr></thead>';

  // Body
  html += '<tbody>';
  group.students.forEach(function(student) {
    var studentEvals = sessionEvals[student.id] || {};
    var isAbsent = studentEvals._absent || false;

    html += '<tr data-student="' + student.id + '"' + (isAbsent ? ' style="opacity:0.4"' : '') + '>';

    // Student name + photo
    var photoSrc = photos[student.id];
    html += '<td>';
    html += '<div style="display:flex; align-items:center; gap:8px;">';
    if (photoSrc) {
      html += '<img src="' + photoSrc + '" style="width:32px; height:32px; border-radius:50%; object-fit:cover; cursor:pointer;" onclick="addStudentPhoto(\'' + student.id + '\')" />';
    } else {
      html += '<button style="width:32px; height:32px; border-radius:50%; background:rgba(0,119,204,0.08); display:flex; align-items:center; justify-content:center; font-size:0.8rem; cursor:pointer; border:1px dashed rgba(0,119,204,0.3);" onclick="addStudentPhoto(\'' + student.id + '\')">' + t('noPhoto') + '</button>';
    }
    html += '<span>' + escapeHtml(student.name) + '</span>';
    html += '</div>';
    html += '</td>';

    // Criteria cells
    criteria.forEach(function(c, cIdx) {
      var val = studentEvals['c' + cIdx] || '';
      html += '<td><button class="eval-cell" data-student="' + student.id + '" data-crit="' + cIdx + '"' +
        (val ? ' data-val="' + escapeHtml(val) + '"' : '') + '>' +
        (val || '·') + '</button></td>';
    });

    // Absent toggle
    html += '<td><button class="eval-cell' + (isAbsent ? ' eval-cell-absent' : '') + '" data-student="' + student.id + '" data-action="absent"' +
      (isAbsent ? ' data-val="no"' : '') + ' style="font-size:0.75rem;">' +
      (isAbsent ? 'ABS' : '·') + '</button></td>';

    // Comment
    var comment = studentEvals._comment || '';
    html += '<td style="min-width:100px;"><input type="text" class="eval-comment" data-student="' + student.id + '" value="' + escapeHtml(comment) + '" placeholder="..." style="border:none; background:transparent; font-family:Nunito,sans-serif; font-size:0.8rem; width:100%; padding:4px; color:var(--text);" /></td>';

    html += '</tr>';
  });
  html += '</tbody></table>';

  container.innerHTML = html;

  // Add click handlers for eval cells
  container.querySelectorAll('.eval-cell[data-crit]').forEach(function(cell) {
    cell.addEventListener('click', function() {
      cycleEvalValue(cell);
    });
  });

  // Absent toggle
  container.querySelectorAll('[data-action="absent"]').forEach(function(cell) {
    cell.addEventListener('click', function() {
      toggleAbsent(cell.dataset.student);
    });
  });

  // Comment input
  container.querySelectorAll('.eval-comment').forEach(function(input) {
    input.addEventListener('input', function() {
      saveComment(input.dataset.student, input.value);
    });
  });
}

function cycleEvalValue(cell) {
  var scaleValues = SCALES[_currentScale] || SCALES.ABCDE;
  var current = cell.getAttribute('data-val') || '';
  var idx = scaleValues.indexOf(current);
  var next = idx >= 0 && idx < scaleValues.length - 1 ? scaleValues[idx + 1] : (idx === scaleValues.length - 1 ? '' : scaleValues[0]);

  var studentId = cell.dataset.student;
  var critIdx = cell.dataset.crit;

  // Save
  var evals = getEvals();
  if (!evals[_evalGroupId]) evals[_evalGroupId] = {};
  if (!evals[_evalGroupId][_evalSessionDate]) evals[_evalGroupId][_evalSessionDate] = {};
  if (!evals[_evalGroupId][_evalSessionDate][studentId]) evals[_evalGroupId][_evalSessionDate][studentId] = {};

  if (next) {
    evals[_evalGroupId][_evalSessionDate][studentId]['c' + critIdx] = next;
    cell.setAttribute('data-val', next);
    cell.textContent = next;
  } else {
    delete evals[_evalGroupId][_evalSessionDate][studentId]['c' + critIdx];
    cell.removeAttribute('data-val');
    cell.textContent = '·';
  }

  setEvals(evals);
}

function toggleAbsent(studentId) {
  var evals = getEvals();
  if (!evals[_evalGroupId]) evals[_evalGroupId] = {};
  if (!evals[_evalGroupId][_evalSessionDate]) evals[_evalGroupId][_evalSessionDate] = {};
  if (!evals[_evalGroupId][_evalSessionDate][studentId]) evals[_evalGroupId][_evalSessionDate][studentId] = {};

  var current = evals[_evalGroupId][_evalSessionDate][studentId]._absent || false;
  evals[_evalGroupId][_evalSessionDate][studentId]._absent = !current;
  setEvals(evals);
  renderEvalGrid();
}

function saveComment(studentId, comment) {
  var evals = getEvals();
  if (!evals[_evalGroupId]) evals[_evalGroupId] = {};
  if (!evals[_evalGroupId][_evalSessionDate]) evals[_evalGroupId][_evalSessionDate] = {};
  if (!evals[_evalGroupId][_evalSessionDate][studentId]) evals[_evalGroupId][_evalSessionDate][studentId] = {};
  evals[_evalGroupId][_evalSessionDate][studentId]._comment = comment;
  setEvals(evals);
}

// ─────────────────────────────────────────────────
// RESULTS
// ─────────────────────────────────────────────────
function renderResults() {
  var container = document.getElementById('results-container');
  if (!container) return;

  var groups = getGroups();
  var evals = getEvals();
  var criteria = getCriteria();

  if (groups.length === 0 || Object.keys(evals).length === 0) {
    container.innerHTML = '<p class="panel-hint">' + t('resultsNoData') + '</p>';
    return;
  }

  var html = '';

  groups.forEach(function(group) {
    var groupEvals = evals[group.id];
    if (!groupEvals) return;

    var dates = Object.keys(groupEvals).sort().reverse();
    if (dates.length === 0) return;

    html += '<h3 class="sub-title">' + escapeHtml(group.name) + ' — ' + dates.length + ' ' + t('sessionLabel').toLowerCase() + (dates.length > 1 ? 's' : '') + '</h3>';

    html += '<div class="results-summary">';
    group.students.forEach(function(student) {
      var gradesHTML = '';
      dates.forEach(function(date) {
        var studentData = groupEvals[date]?.[student.id];
        if (!studentData) return;
        criteria.forEach(function(c, cIdx) {
          var val = studentData['c' + cIdx];
          if (val) {
            var colorClass = getGradeColor(val);
            gradesHTML += '<span class="result-grade" style="background:' + colorClass + ';">' + escapeHtml(val) + '</span>';
          }
        });
      });

      if (gradesHTML) {
        html += '<div class="result-card">' +
          '<div class="result-card-name">' + escapeHtml(student.name) + '</div>' +
          '<div class="result-grades">' + gradesHTML + '</div>' +
        '</div>';
      }
    });
    html += '</div>';
  });

  if (!html) {
    html = '<p class="panel-hint">' + t('resultsNoData') + '</p>';
  }

  container.innerHTML = html;
}

function getGradeColor(val) {
  var colors = {
    'A': '#2E7D32', '5': '#2E7D32', '++': '#2E7D32', 'ok': '#2E7D32',
    'B': '#66BB6A', '4': '#66BB6A', '+': '#66BB6A',
    'C': '#FF8C00', '3': '#FF8C00', '=': '#FF8C00', '~': '#FF8C00',
    'D': '#EF6C00', '2': '#EF6C00', '-': '#EF6C00',
    'E': '#D32F2F', '1': '#D32F2F', '--': '#D32F2F', 'no': '#D32F2F',
  };
  return colors[val] || '#999';
}

// ─────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────
function exportResults() {
  var groups = getGroups();
  var evals = getEvals();
  var criteria = getCriteria();
  var photos = getPhotos();

  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
    '<title>EvalEPS — ' + t('resultsTitle') + '</title>' +
    '<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">' +
    '<style>' +
    'body { font-family: Nunito, sans-serif; margin: 20px; color: #222; }' +
    'h1 { font-family: Fredoka, sans-serif; color: #0077CC; text-align: center; }' +
    'h2 { font-family: Fredoka, sans-serif; color: #0077CC; margin: 24px 0 8px; font-size: 1.2rem; }' +
    'table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-bottom: 20px; }' +
    'th { background: #f0f7ff; padding: 8px 6px; text-align: center; border: 1px solid #ddd; font-family: Fredoka, sans-serif; font-size: 0.75rem; color: #0077CC; }' +
    'th:first-child { text-align: left; }' +
    'td { padding: 6px; border: 1px solid #ddd; text-align: center; }' +
    'td:first-child { text-align: left; font-weight: 700; }' +
    '.grade { display: inline-block; padding: 2px 8px; border-radius: 4px; color: #fff; font-weight: 700; font-size: 0.8rem; }' +
    '.footer { text-align: center; margin-top: 30px; font-size: 0.8rem; color: #999; }' +
    '.footer a { color: #0077CC; }' +
    '@media print { @page { margin: 12mm; } }' +
    '</style></head><body>';

  html += '<h1>📋 ' + t('resultsTitle') + ' — EvalEPS</h1>';

  groups.forEach(function(group) {
    var groupEvals = evals[group.id];
    if (!groupEvals) return;
    var dates = Object.keys(groupEvals).sort();
    if (dates.length === 0) return;

    dates.forEach(function(date) {
      var sessionData = groupEvals[date];
      html += '<h2>' + escapeHtml(group.name) + ' — ' + date + '</h2>';
      html += '<table><thead><tr><th>' + (_lang === 'en' ? 'Student' : 'Eleve') + '</th>';
      criteria.forEach(function(c) {
        var text = _lang === 'en' && c.en ? c.en : c.fr;
        var short = text.length > 25 ? text.substring(0, 23) + '...' : text;
        html += '<th>' + escapeHtml(short) + '</th>';
      });
      html += '<th>' + t('comment') + '</th></tr></thead><tbody>';

      group.students.forEach(function(student) {
        var sd = sessionData[student.id] || {};
        if (sd._absent) {
          html += '<tr style="opacity:0.4;"><td>' + escapeHtml(student.name) + '</td>';
          criteria.forEach(function() { html += '<td>ABS</td>'; });
          html += '<td></td></tr>';
          return;
        }
        html += '<tr><td>' + escapeHtml(student.name) + '</td>';
        criteria.forEach(function(c, cIdx) {
          var val = sd['c' + cIdx] || '';
          if (val) {
            html += '<td><span class="grade" style="background:' + getGradeColor(val) + ';">' + escapeHtml(val) + '</span></td>';
          } else {
            html += '<td></td>';
          }
        });
        html += '<td style="font-size:0.75rem; text-align:left;">' + escapeHtml(sd._comment || '') + '</td>';
        html += '</tr>';
      });

      html += '</tbody></table>';
    });
  });

  html += '<div class="footer"><a href="https://zonetotalsport.ca" target="_blank"><img src="' + window.location.origin + '/img/logo-zonetotalsport.png" alt="ZoneTotalSport.ca" style="max-width:200px;" /></a><br>Cree avec <a href="https://zonetotalsport.ca">zonetotalsport.ca</a> — EvalEPS</div>';
  html += '</body></html>';

  var w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  setTimeout(function() { w.print(); }, 500);
  showToast(t('toastExported'));
}

function printResults() {
  exportResults();
}

function exportCSV() {
  var groups = getGroups();
  var evals = getEvals();
  var criteria = getCriteria();

  var lines = [];
  var header = ['Groupe', 'Date', 'Eleve'];
  criteria.forEach(function(c) { header.push(c.fr); });
  header.push('Absent', 'Commentaire');
  lines.push(header.join(','));

  groups.forEach(function(group) {
    var groupEvals = evals[group.id] || {};
    Object.keys(groupEvals).sort().forEach(function(date) {
      var sessionData = groupEvals[date];
      group.students.forEach(function(student) {
        var sd = sessionData[student.id] || {};
        var row = ['"' + group.name + '"', date, '"' + student.name + '"'];
        criteria.forEach(function(c, cIdx) { row.push(sd['c' + cIdx] || ''); });
        row.push(sd._absent ? 'OUI' : '');
        row.push('"' + (sd._comment || '') + '"');
        lines.push(row.join(','));
      });
    });
  });

  var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'evaleps_' + todayStr() + '.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast(t('toastExported'));
}

// ─────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showToast(msg) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function() {
    toast.classList.add('hidden');
  }, 2500);
}

// ─────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  // Restore language
  var savedLang = localStorage.getItem('evaleps-lang') || 'fr';
  setLang(savedLang);

  // Restore scale
  _currentScale = localStorage.getItem('evaleps-scale') || 'ABCDE';

  // Add import button to group modal
  var formActions = document.querySelector('#group-modal .form-actions');
  if (formActions) {
    var importBtn = document.createElement('button');
    importBtn.type = 'button';
    importBtn.className = 'btn-secondary';
    importBtn.innerHTML = t('groupImport');
    importBtn.addEventListener('click', importStudentList);
    formActions.appendChild(importBtn);
  }

  // Keyboard: Enter to add criteria
  var critInput = document.getElementById('custom-criteria-input');
  if (critInput) {
    critInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') addCustomCriteria();
    });
  }
});
