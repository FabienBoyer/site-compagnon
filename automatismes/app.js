/**
 * Automatismes Première Spé - Quiz Engine
 * Aligned with index.html (Claude's version)
 */

let currentUser = "";
let currentTheme = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let mistakes = 0;
let sessionStartTime = null;

// Initialization
window.onload = () => {
    // Mathjax/Katex auto-render is handled by index.html script tags
    setupKeyboard();
    // Check for existing user
    const savedUser = localStorage.getItem('autimatismes_user');
    if (savedUser) {
        currentUser = savedUser;
        document.getElementById('user-name-display').innerText = currentUser;
        document.getElementById('user-badge').style.display = 'flex';
        showScreen('home');
    }
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
    if (!currentTheme) return;
    
    // Select questions randomly from all subtopics
    let allQ = [];
    currentTheme.subtopics.forEach(sub => {
        sub.questions.forEach(q => {
            allQ.push({...q, subtopic: sub.name});
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

            if (Math.abs(u - c) > 1e-9 * (1 + Math.abs(c))) {
                allMatch = false;
                break;
            }
        } catch(e) {
            // Erreur d'évaluation (ex : sqrt(-1)) → on ignore ce point
            continue;
        }
    }
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
    const q = currentQuestions[currentQuestionIndex]._active;
    const isCorrect = isEquivalent(userAns, q.ans);
    
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

    // Temps de la session
    const elapsed = Math.round((Date.now() - sessionStartTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const timeStr = mins > 0 ? `${mins} min ${secs} s` : `${secs} s`;
    document.getElementById('results-time').innerText = `⏱ Durée : ${timeStr}`;

    // Animate score ring
    const ring = document.getElementById('score-ring');
    const pct = score / currentQuestions.length;
    ring.style.strokeDasharray = `${pct * 565} 565`;
}

function showHome() {
    showScreen('home');
}

function logout() {
    localStorage.removeItem('autimatismes_user');
    location.reload();
}

function showConfig() { showScreen('config'); }
function showStats() { showScreen('stats'); }
