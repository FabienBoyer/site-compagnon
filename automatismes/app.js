/**
 * Automatismes Première Spé - Quiz Engine
 * Aligned with index.html (Claude's version)
 */

let currentUser = "";
let currentTheme = null;
let currentThemeId = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let mistakes = 0;
let sessionStartTime = null;
let subtopicResults = {}; // { "themeId|subtopicName": { correct, total } }

// ============================================================
// MODULE SRS — Répétition Espacée par sous-thème
// ============================================================

const SRS_KEY = 'srs_progression';
// Intervalles en jours selon le score (0→immédiat, 1→1j, 2→3j, 3→7j, 4+→14j)
const SRS_INTERVALS = [0, 1, 3, 7, 14];

function srsLoad() {
    try { return JSON.parse(localStorage.getItem(SRS_KEY) || '{}'); }
    catch(e) { return {}; }
}
function srsSave(data) {
    localStorage.setItem(SRS_KEY, JSON.stringify(data));
}

/** Retourne true si ce sous-thème est à réviser aujourd'hui. */
function srsIsDue(entry) {
    if (!entry || !entry.lastSeen) return true;
    const interval = SRS_INTERVALS[Math.min(entry.score || 0, SRS_INTERVALS.length - 1)];
    return Date.now() >= entry.lastSeen + interval * 86400000;
}

/** Nombre de jours avant la prochaine révision (0 = aujourd'hui). */
function srsDaysUntil(entry) {
    if (!entry || !entry.lastSeen) return 0;
    const interval = SRS_INTERVALS[Math.min(entry.score || 0, SRS_INTERVALS.length - 1)];
    const diff = (entry.lastSeen + interval * 86400000) - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
}

/** Met à jour les scores SRS après une session. */
function srsUpdateFromSession() {
    const data = srsLoad();
    for (const [key, res] of Object.entries(subtopicResults)) {
        if (res.total === 0) continue;
        const entry = data[key] || { score: 0, lastSeen: 0 };
        const ratio = res.correct / res.total;
        if (ratio >= 0.7) {
            entry.score = Math.min((entry.score || 0) + 1, 4);
        } else {
            entry.score = Math.max((entry.score || 0) - 1, 0);
        }
        entry.lastSeen = Date.now();
        entry.lastRatio = Math.round(ratio * 100);
        data[key] = entry;
    }
    srsSave(data);
}

/** Nombre de sous-thèmes dus pour un thème donné. */
function srsThemeDueCount(themeId) {
    const data = srsLoad();
    const theme = DATA[themeId];
    if (!theme || !theme.subtopics) return 0;
    return theme.subtopics.filter(sub => srsIsDue(data[themeId + '|' + sub.name])).length;
}

/** Retourne toutes les questions provenant des sous-thèmes dus, tous thèmes confondus. */
function srsGetDueQuestions() {
    const data = srsLoad();
    const questions = [];
    for (const themeId of Object.keys(DATA)) {
        const theme = DATA[themeId];
        if (!theme.subtopics) continue;
        for (const sub of theme.subtopics) {
            const key = themeId + '|' + sub.name;
            if (srsIsDue(data[key])) {
                sub.questions.forEach(q => {
                    questions.push({ ...q, subtopic: sub.name, _themeId: themeId });
                });
            }
        }
    }
    return questions;
}

/** Met à jour les badges sur les cartes de thème et le bouton Révision. */
function updateSRSUI() {
    // Badges par thème
    document.querySelectorAll('[data-theme]').forEach(btn => {
        const themeId = btn.dataset.theme;
        const count = srsThemeDueCount(themeId);
        const badge = btn.querySelector('.srs-badge');
        if (!badge) return;
        if (count > 0) {
            badge.textContent = count;
            badge.classList.add('visible');
        } else {
            badge.textContent = '';
            badge.classList.remove('visible');
        }
    });

    // Bouton Révision du jour
    const btn = document.getElementById('btn-revision-jour');
    if (!btn) return;
    const dueQ = srsGetDueQuestions();
    const dueThemes = new Set(dueQ.map(q => q._themeId)).size;
    const dueSubs = new Set(dueQ.map(q => q._themeId + '|' + q.subtopic)).size;
    if (dueSubs > 0) {
        btn.innerHTML = `📅 Révision du jour <span style="font-size:0.8rem;font-weight:400;opacity:0.8;">— ${dueSubs} sous-thème${dueSubs > 1 ? 's' : ''} à revoir</span>`;
        btn.disabled = false;
    } else {
        btn.innerHTML = `✅ Rien à réviser pour l'instant`;
        btn.disabled = true;
    }
}

// ============================================================

// Initialization
window.onload = () => {
    setupKeyboard();
    const savedUser = localStorage.getItem('autimatismes_user');
    if (savedUser) {
        currentUser = savedUser;
        document.getElementById('user-name-display').innerText = currentUser;
        document.getElementById('user-badge').style.display = 'flex';
        showScreen('home');
    }
    updateSRSUI();
};

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function handleLogin() {
    const name = document.getElementById('user-name-input').value.trim();
    if (name) {
        currentUser = name;
        localStorage.setItem('autimatismes_user', name);
        document.getElementById('user-name-display').innerText = name;
        document.getElementById('user-badge').style.display = 'flex';
        showScreen('home');
    } else {
        alert("Veuillez entrer un prénom.");
    }
}

function startTheme(themeId) {
    currentTheme = DATA[themeId];
    currentThemeId = themeId;
    if (!currentTheme) return;

    subtopicResults = {};
    let allQ = [];
    currentTheme.subtopics.forEach(sub => {
        sub.questions.forEach(q => {
            allQ.push({ ...q, subtopic: sub.name, _themeId: themeId });
        });
    });

    currentQuestions = allQ.sort(() => Math.random() - 0.5).slice(0, 10);
    currentQuestionIndex = 0;
    score = 0;
    mistakes = 0;
    sessionStartTime = Date.now();

    document.getElementById('quiz-title').innerText = currentTheme.name;
    showScreen('quiz');
    loadQuestion();
}

function startRevisionDuJour() {
    const dueQ = srsGetDueQuestions();
    if (dueQ.length === 0) return;

    currentTheme = { name: '📅 Révision du jour' };
    currentThemeId = '_revision';
    subtopicResults = {};

    currentQuestions = dueQ.sort(() => Math.random() - 0.5).slice(0, 10);
    currentQuestionIndex = 0;
    score = 0;
    mistakes = 0;
    sessionStartTime = Date.now();

    document.getElementById('quiz-title').innerText = currentTheme.name;
    showScreen('quiz');
    loadQuestion();
}

function loadQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    let activeQ = q;
    
    if (q.generate) {
        activeQ = q.generate();
        activeQ.type = q.type || 'input';
        activeQ.renderGraph = q.renderGraph;
    }
    
    currentQuestions[currentQuestionIndex]._active = activeQ;
    
    document.getElementById('question-text').innerHTML = DOMPurify.sanitize(activeQ.q);
    document.getElementById('progress-text').innerText = `${currentQuestionIndex + 1} / ${currentQuestions.length}`;
    document.getElementById('progress-bar').style.width = `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`;
    
    // Reset displays
    document.getElementById('graph-container').style.display = 'none';
    document.getElementById('python-container').style.display = 'none';
    document.getElementById('input-mode').style.display = 'none';
    document.getElementById('mcq-mode').style.display = 'none';
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('validate-btn').style.display = 'block';
    
    if (activeQ.renderGraph) {
        document.getElementById('graph-container').style.display = 'block';
        const board = JXG.JSXGraph.initBoard('graph-container', {
            boundingbox: [-5, 5, 5, -5],
            axis: true,
            showCopyright: false
        });
        activeQ.renderGraph(board);
    }
    
    if (activeQ.q.includes('language-python')) {
        document.getElementById('python-container').style.display = 'block';
    }

    if (activeQ.type === 'mcq') {
        document.getElementById('mcq-mode').style.display = 'grid';
        renderMCQ(activeQ.opts);
    } else {
        document.getElementById('input-mode').style.display = 'block';
        const input = document.getElementById('math-answer');
        input.value = '';
        input.focus();
    }
    
    // Math & Highlighting
    if (window.renderMathInElement) renderMathInElement(document.body);
    if (window.Prism) Prism.highlightAll();
}

/**
 * Formate une option pour l'affichage :
 * - Déjà balisée LaTeX \(...\) → on ne touche pas
 * - Texte pur (mots, pourcentages simples) → texte brut, pas de \(\)
 * - Expression mathématique → enveloppée dans \(...\)
 */
function formatOpt(str) {
    if (!str && str !== 0) return String(str);
    const s = String(str);
    // Déjà balisée LaTeX
    if (s.includes('\\(') || s.includes('\\[')) return s;
    // Pourcentages avec ou sans signe : +25%, -10%, 75%
    if (/^[+-]?\d+([.,]\d+)?%$/.test(s)) return s;
    // Décimaux signés simples : +1.25, -0.75 (coefficients multiplicateurs)
    if (/^[+-]\d+([.,]\d+)?$/.test(s)) return s;
    // Texte pur : lettres (avec accents), chiffres, espaces, %, virgule, apostrophe, tiret seul
    // Pas de +, *, /, ^, =, <, >, (, ), \, _
    if (/^[a-zA-ZÀ-ÿœæ0-9\s\-,'!?%.]+$/.test(s) && !/[+*/^=<>()\\_{}\[\]|]/.test(s)) {
        return s;
    }
    // Expression mathématique → envelopper
    return `\\(${s}\\)`;
}

function renderMCQ(opts) {
    const container = document.getElementById('mcq-mode');
    container.innerHTML = '';
    opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'mcq-btn';
        btn.innerHTML = DOMPurify.sanitize(formatOpt(opt));
        btn.onclick = () => {
            document.getElementById('math-answer').value = opt;
            checkAnswer();
        };
        container.appendChild(btn);
    });
    if (window.renderMathInElement) renderMathInElement(container);
}

function setupKeyboard() {
    const kb = document.getElementById('keyboard');
    // { display: texte affiché sur le bouton, value: chaîne insérée dans l'input }
    const keys = [
        { display: '7',    value: '7' },
        { display: '8',    value: '8' },
        { display: '9',    value: '9' },
        { display: '+',    value: '+' },
        { display: '√',    value: 'sqrt(' },
        { display: '⌫',    value: null,  action: 'backspace' },

        { display: '4',    value: '4' },
        { display: '5',    value: '5' },
        { display: '6',    value: '6' },
        { display: '−',    value: '-' },
        { display: '^',    value: '^' },
        { display: 'C',    value: null,  action: 'clear' },

        { display: '1',    value: '1' },
        { display: '2',    value: '2' },
        { display: '3',    value: '3' },
        { display: '×',    value: '*' },
        { display: '(',    value: '(' },
        { display: ')',    value: ')' },

        { display: '0',    value: '0' },
        { display: '.',    value: '.' },
        { display: '/',    value: '/' },
        { display: 'π',    value: 'pi' },
        { display: '=',    value: '=' },
        { display: '↵',    value: null,  action: 'validate' },

        { display: 'x',    value: 'x' },
        { display: 'y',    value: 'y' },
        { display: 'n',    value: 'n' },
        { display: 'sin',  value: 'sin(' },
        { display: 'cos',  value: 'cos(' },
        { display: 'tan',  value: 'tan(' },
        { display: 'a',    value: 'a' },
        { display: 'b',    value: 'b' },
    ];

    kb.innerHTML = '';
    keys.forEach(k => {
        const btn = document.createElement('button');
        btn.className = 'key';
        btn.innerText = k.display;

        if (k.action === 'backspace') {
            btn.onclick = () => {
                const input = document.getElementById('math-answer');
                const start = input.selectionStart;
                const end = input.selectionEnd;
                if (start !== end) {
                    input.value = input.value.substring(0, start) + input.value.substring(end);
                    input.selectionStart = input.selectionEnd = start;
                } else if (start > 0) {
                    input.value = input.value.substring(0, start - 1) + input.value.substring(start);
                    input.selectionStart = input.selectionEnd = start - 1;
                }
                input.focus();
            };
        } else if (k.action === 'clear') {
            btn.onclick = () => {
                document.getElementById('math-answer').value = '';
                document.getElementById('math-answer').focus();
            };
        } else if (k.action === 'validate') {
            btn.className = 'key key-validate';
            btn.onclick = () => checkAnswer();
        } else {
            btn.onclick = () => insertAtCursor(k.value);
        }

        kb.appendChild(btn);
    });
}

function insertAtCursor(val) {
    const input = document.getElementById('math-answer');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.value = input.value.substring(0, start) + val + input.value.substring(end);
    input.selectionStart = input.selectionEnd = start + val.length;
    input.focus();
}

function normalizeExpr(expr) {
    if (!expr) return "";
    return expr.toString()
        .toLowerCase()
        .trim()
        // LaTeX : \sqrt{x} → sqrt(x), \frac{a}{b} → (a)/(b), \times → *, etc.
        .replace(/\\frac\s*\{([^}]*)\}\s*\{([^}]*)\}/g, '($1)/($2)')
        .replace(/\\sqrt\s*\{([^}]*)\}/g, 'sqrt($1)')
        .replace(/\\sqrt\s*\(/g, 'sqrt(')
        .replace(/\\times/g, '*')
        .replace(/\\cdot/g, '*')
        .replace(/\\pi/g, 'pi')
        .replace(/\\/g, '')        // Supprime les backslashes LaTeX restants
        // Accolades → parenthèses (sqrt{x}, ^{2}, etc.)
        .replace(/\{/g, '(')
        .replace(/\}/g, ')')
        // Espaces
        .replace(/\s+/g, '')
        // Pourcentages multi-chiffres
        .replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')
        // Virgule décimale française
        .replace(/,/g, '.')
        // Constantes
        .replace(/\bpi\b/g, '3.14159265358979')
        .replace(/\be\b(?!\^)/g, '2.71828182845905')
        // ln → log (math.js utilise log pour ln)
        .replace(/\bln\(/g, 'log(')
        // Exposants Unicode
        .replace(/²/g, '^2')
        .replace(/³/g, '^3')
        // Multiplications implicites : 2x, 3(x+1), (x+1)(x-1)
        .replace(/(\d+(?:\.\d+)?)([a-z(])/g, '$1*$2')
        .replace(/\)([a-z(])/g, ')*$1')
        .replace(/\)\(/g, ')*(')
        // Restaurer les appels de fonctions (éviter sin*(x) → sin(x))
        .replace(/\b(sin|cos|tan|sqrt|log|ln|exp|abs)\*\(/g, '$1(');
}

/**
 * Parenthèse chaque dénominateur après un "/" jusqu'au prochain opérateur additif
 * au même niveau de profondeur. Permet d'accepter "1/2sqrt(x)" comme "1/(2sqrt(x))".
 */
function groupDenominators(expr) {
    let result = '';
    let i = 0;
    while (i < expr.length) {
        if (expr[i] === '/') {
            result += '/';
            i++;
            // Collecter le terme suivant jusqu'au prochain + ou - au niveau 0
            let term = '';
            let depth = 0;
            while (i < expr.length) {
                const c = expr[i];
                if (c === '(' || c === '[') depth++;
                else if (c === ')' || c === ']') {
                    if (depth === 0) break;
                    depth--;
                }
                if (depth === 0 && (c === '+' || c === '-') && term.length > 0) break;
                term += c;
                i++;
            }
            // Envelopper dans des parenthèses si ce n'est pas déjà le cas
            const alreadyWrapped = term.startsWith('(') && term.endsWith(')');
            result += alreadyWrapped ? term : '(' + term + ')';
        } else {
            result += expr[i];
            i++;
        }
    }
    return result;
}

/**
 * Détecte les variables dans une expression normalisée.
 * Ignore les constantes numériques et les noms de fonctions.
 */
function detectVars(expr) {
    const normalized = expr.toLowerCase();
    // Supprime les noms de fonctions connus
    const noFuncs = normalized.replace(/\b(sin|cos|tan|sqrt|log|exp|abs|pi)\b/g, '');
    // Trouve toutes les lettres restantes (variables potentielles)
    const letters = noFuncs.match(/[a-z]/g) || [];
    return [...new Set(letters)];
}

/**
 * Évaluation numérique multi-points pour comparer deux expressions symboliques.
 * Substitue des valeurs aléatoires évitant 0 et les entiers simples.
 */
function numericallyEquivalent(normUser, normCorrect) {
    const vars = detectVars(normCorrect);
    if (vars.length === 0) {
        // Pas de variable : évaluation directe
        try {
            const u = math.evaluate(normUser);
            const c = math.evaluate(normCorrect);
            if (typeof u !== 'number' || typeof c !== 'number') return false;
            return Math.abs(u - c) < 1e-9;
        } catch(e) { return false; }
    }

    // Plusieurs points de test pour éviter les coïncidences
    const testPoints = [1.3, -0.7, 2.1, -1.9, 0.4, 3.7, -2.3];
    let allMatch = true;
    let validCount = 0; // points où les deux expressions ont pu être évaluées

    for (const val of testPoints) {
        try {
            // Créer le scope de substitution
            const scope = {};
            vars.forEach(v => { scope[v] = val; });

            const u = math.evaluate(normUser, scope);
            const c = math.evaluate(normCorrect, scope);

            // Résultats non numériques ou NaN → invalide
            if (typeof u !== 'number' || typeof c !== 'number') return false;
            if (isNaN(u) || isNaN(c)) return false;

            validCount++;
            if (Math.abs(u - c) > 1e-9 * (1 + Math.abs(c))) {
                allMatch = false;
                break;
            }
        } catch(e) {
            // Erreur d'évaluation (ex : sqrt(-1)) → on ignore ce point
            continue;
        }
    }
    // Si aucun point n'a pu être évalué (expression invalide), ce n'est pas correct
    if (validCount === 0) return false;
    return allMatch;
}

function isEquivalent(user, correct) {
    const userTrim = user.trim();
    const correctTrim = correct.trim();

    // 1. Comparaison exacte insensible à la casse
    if (userTrim.toLowerCase() === correctTrim.toLowerCase()) return true;

    // 2. Réponses textuelles ou ensemblistes → uniquement comparaison exacte
    // On exclut les fonctions mathématiques communes du test de texte pour permettre l'évaluation symbolique
    const isPureText = /[{}]/.test(correctTrim) || (/[a-zA-Zéèêàùûîôâëïüç]{3,}/.test(correctTrim) && !/\b(sqrt|sin|cos|tan|log|exp|abs|pi)\b/.test(correctTrim));
    if (isPureText) {
        return userTrim.toLowerCase() === correctTrim.toLowerCase();
    }

    // 3. Normalisation puis évaluation numérique multi-points
    try {
        const normUser    = normalizeExpr(userTrim);
        const normCorrect = normalizeExpr(correctTrim);

        // Comparaison des chaînes normalisées
        if (normUser === normCorrect) return true;

        // Évaluation directe
        if (numericallyEquivalent(normUser, normCorrect)) return true;

        // Secours : parenthésage des dénominateurs
        // Accepte "1/2sqrt(x)" comme "1/(2sqrt(x))"
        const normUserGrouped = groupDenominators(normUser);
        if (normUserGrouped !== normUser) {
            if (numericallyEquivalent(normUserGrouped, normCorrect)) return true;
        }

        return false;
    } catch(e) {
        return false;
    }
}

function checkAnswer() {
    const userAns = document.getElementById('math-answer').value;
    const rawQ = currentQuestions[currentQuestionIndex];
    const q = rawQ._active;
    const isCorrect = isEquivalent(userAns, q.ans);

    // Tracking SRS par sous-thème
    const srsKey = (rawQ._themeId || currentThemeId) + '|' + rawQ.subtopic;
    if (rawQ.subtopic) {
        if (!subtopicResults[srsKey]) subtopicResults[srsKey] = { correct: 0, total: 0 };
        subtopicResults[srsKey].total++;
        if (isCorrect) subtopicResults[srsKey].correct++;
    }

    const feedback = document.getElementById('feedback');
    const msg = document.getElementById('feedback-msg');
    const expl = document.getElementById('explanation');

    feedback.style.display = 'block';
    if (isCorrect) {
        score++;
        msg.innerText = "Excellent !";
        msg.style.color = "var(--success)";
        expl.innerHTML = "";
    } else {
        mistakes++;
        msg.innerText = "Oups !";
        msg.style.color = "var(--error)";
        expl.innerHTML = DOMPurify.sanitize(`La bonne réponse était : ${formatOpt(q.ans)}<br><small>${q.expl}</small>`);
    }
    
    document.getElementById('validate-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'block';
    if (window.renderMathInElement) renderMathInElement(expl);
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    showScreen('results');
    document.getElementById('res-score').innerText = score;
    document.getElementById('res-total').innerText = `/ ${currentQuestions.length}`;

    const msg = score === currentQuestions.length ? "Parfait !" :
                score >= 8 ? "Très bon niveau !" :
                score >= 5 ? "Encourageant, continuez !" : "À retravailler.";
    document.getElementById('results-message').innerText = msg;

    const elapsed = Math.round((Date.now() - sessionStartTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const timeStr = mins > 0 ? `${mins} min ${secs} s` : `${secs} s`;
    document.getElementById('results-time').innerText = `⏱ Durée : ${timeStr}`;

    const ring = document.getElementById('score-ring');
    const pct = score / currentQuestions.length;
    ring.style.strokeDasharray = `${pct * 565} 565`;

    // Mise à jour SRS et affichage du bilan par sous-thème
    srsUpdateFromSession();
    updateSRSUI();
    renderSRSFeedback();
}

function renderSRSFeedback() {
    const el = document.getElementById('srs-feedback');
    if (!el) return;
    const data = srsLoad();
    const lines = [];

    for (const [key, res] of Object.entries(subtopicResults)) {
        if (res.total === 0) continue;
        const entry = data[key] || { score: 0 };
        const ratio = Math.round(res.correct / res.total * 100);
        const days = srsDaysUntil(entry);
        const icon = ratio >= 70 ? '✅' : ratio >= 50 ? '⚠️' : '❌';
        const subtopicName = key.split('|').slice(1).join('|');
        const nextStr = days === 0 ? 'à revoir dès demain'
                      : days === 1 ? 'prochain rappel dans 1 jour'
                      : `prochain rappel dans ${days} jours`;
        lines.push(`${icon} <strong>${subtopicName}</strong> — ${res.correct}/${res.total} (${ratio}%) · ${nextStr}`);
    }

    el.innerHTML = lines.length > 0
        ? lines.join('<br>')
        : '';
}

function showHome() {
    showScreen('home');
    updateSRSUI();
}

function logout() {
    localStorage.removeItem('autimatismes_user');
    location.reload();
}

function showConfig() { showScreen('config'); }
function showStats() { showScreen('stats'); }
