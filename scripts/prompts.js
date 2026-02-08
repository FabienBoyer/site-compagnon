/* ========================================
   PROMPTS GENERATOR - SITE COMPAGNON
   Handles dynamic loading of prompts from JSON
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    loadPrompts();
});

async function loadPrompts() {
    const container = document.getElementById('prompts-container');
    const loader = document.getElementById('prompts-loader');

    try {
        const response = await fetch('data/prompts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allPrompts = await response.json();

        // Filter for "Annexes" prompts mostly, or just check if they have C.R.O.F.I structure
        // Based on annexe_prompts.tex, these are the ones we want.
        // In extract_prompts.py, "Annexes" part prompts have subject as category.

        const targetPart = "Annexes";
        const prompts = allPrompts.filter(p => p.part === targetPart);

        if (prompts.length === 0) {
            container.innerHTML = '<p class="error-message">Aucun prompt trouvé.</p>';
            loader.style.display = 'none';
            return;
        }

        // Group by subject (Category)
        const groupedPrompts = {};
        prompts.forEach(p => {
            const category = p.subject || "Autres";
            if (!groupedPrompts[category]) {
                groupedPrompts[category] = [];
            }
            groupedPrompts[category].push(p);
        });

        // Icon mapping for categories
        const categoryIcons = {
            "Préparation de cours": "book-open",
            "Évaluation": "clipboard-check",
            "Gestion de classe": "users",
            "Aide aux élèves": "heart-handshake",
            "Disciplines": "graduation-cap",
            "Productivité": "rocket"
        };

        // Render categories
        let html = '';

        // Order keys if needed, or just iterate
        // The original order in annexe_prompts.tex:
        // Préparation de cours, Évaluation, Gestion de classe, Aide aux élèves, Disciplines, Productivité
        const orderedCategories = [
            "Préparation de cours",
            "Évaluation",
            "Gestion de classe",
            "Aide aux élèves",
            "Disciplines",
            "Productivité"
        ];

        // Add any extra categories found
        Object.keys(groupedPrompts).forEach(key => {
            if (!orderedCategories.includes(key)) {
                orderedCategories.push(key);
            }
        });

        orderedCategories.forEach(category => {
            if (groupedPrompts[category]) {
                const icon = categoryIcons[category] || "folder";
                html += `
                <section class="prompt-category">
                    <h2 class="category-title"><i data-lucide="${icon}"></i> ${category}</h2>
                    <div class="prompts-grid">
                `;

                groupedPrompts[category].forEach((p, index) => {
                    // Calculate number if needed, or use p.id if it's numeric enough (p001...)
                    // For display, we can use an index or just the ID.
                    // The regex for title in extract_prompts.py seems to extract "1. Title", let's check
                    // If title contains number, we use it.

                    let displayTitle = p.title;
                    let displayNumber = p.id;

                    // Regex to extract number from title if present (e.g. "1. Générateur sequence")
                    const titleMatch = p.title.match(/^(\d+)\.\s*(.*)/);
                    if (titleMatch) {
                        displayNumber = titleMatch[1];
                        displayTitle = titleMatch[2];
                    }

                    html += `
                        <article class="prompt-card">
                            <div class="prompt-header">
                                <span class="prompt-number">${displayNumber}</span>
                                <h3 class="prompt-title">${displayTitle}</h3>
                                <button class="copy-btn" data-content="${encodeURIComponent(p.content)}" title="Copier"><i data-lucide="copy"></i></button>
                            </div>
                            <div class="prompt-body">
                                ${renderCrofi(p.structure, p.content)}
                            </div>
                        </article>
                    `;
                });

                html += `
                    </div>
                </section>
                `;
            }
        });

        container.innerHTML = html;
        loader.style.display = 'none';

        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Initialize copy buttons
        initCopyButtons();

    } catch (error) {
        console.error('Error loading prompts:', error);
        loader.innerHTML = '<p class="error-message">Erreur lors du chargement des prompts.</p>';
    }
}

function renderCrofi(structure, fullContent) {
    if (!structure) {
        // Fallback or unstructured content
        return `<div class="crofi-line">${fullContent}</div>`;
    }

    let html = '';
    const map = {
        'context': { letter: 'C', class: 'crofi-c' },
        'role': { letter: 'R', class: 'crofi-r' },
        'task': { letter: 'O', class: 'crofi-o' }, // Objectif
        'format': { letter: 'F', class: 'crofi-f' },
        'input': { letter: 'I', class: 'crofi-i' }
    };

    // Render in C-R-O-F-I order
    ['context', 'role', 'task', 'format', 'input'].forEach(key => {
        if (structure[key]) {
            const config = map[key];
            html += `
                <div class="crofi-line ${config.class}">
                    <span class="crofi-badge">${config.letter}</span>${structure[key]}
                </div>
            `;
        }
    });

    return html;
}

function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const content = decodeURIComponent(this.dataset.content);

            navigator.clipboard.writeText(content).then(() => {
                const originalIcon = this.innerHTML;
                this.innerHTML = '<i data-lucide="check"></i>';
                if (typeof lucide !== 'undefined') lucide.createIcons();

                setTimeout(() => {
                    this.innerHTML = '<i data-lucide="copy"></i>';
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }, 2000);
            });
        });
    });
}
