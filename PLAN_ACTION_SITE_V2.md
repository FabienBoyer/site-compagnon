# PLAN D'ACTION SITE COMPAGNON V2
## Intégration Veille Actualité Février 2026 — VERSION COMPLÈTE

**Destinataire :** Antigravity  
**Demandeur :** Fabien Boyer  
**Date :** 8 février 2026  
**Site :** fabienboyer.github.io/site-compagnon

---

## 📊 CONTEXTE

**Objectif :** Intégrer **4 nouvelles ressources majeures** issues de la veille février 2026 dans le site compagnon du livre "Les outils pour enseigner avec l'IA".

**Contrainte :** Zero-code solution (comme tout le site existant)

**Structure actuelle du site :**
```
Site existant :
├── index.html (Accueil)
├── debuter.html
├── ethique.html
├── lexique.html
├── formation.html
├── outils.html
├── disciplines.html
├── conversations.html
├── comparatif-ia.html
├── chatbot.html
├── veille.html ⬅️ PAGE À ENRICHIR
└── a-propos.html
```

---

## 🎯 OBJECTIF

**Enrichir la page `veille.html` avec 4 nouvelles ressources :**

1. **Souveraineté cognitive** (Article Tirot/Diebold, janvier 2026)
2. **Indicateurs capacités IA** (Rapport OCDE, juin 2025)
3. **Prompt Repetition** (Étude Google Research, décembre 2025)
4. **Examens oraux** (Article Fenton, Educational Researcher, juin 2025) ⭐ **NOUVEAU**

**Format :** Cards cliquables + sections détaillées

---

## 📋 PLAN D'ACTION DÉTAILLÉ

### **ÉTAPE 1 : Modifier la page `veille.html`**

#### **1.1 Structure globale de la page**

**Header de la page :**
```html
<h1>Veille & Actualités IA</h1>
<p class="lead">
Les dernières avancées en IA et éducation, mises à jour régulièrement. 
Ces ressources complètent le livre avec les évolutions récentes.
</p>

<div class="alert alert-info">
  <strong>🆕 Mis à jour :</strong> Février 2026 — 4 nouvelles ressources majeures
</div>
```

#### **1.2 Section "Février 2026 : 4 ressources majeures"**

**Créer 4 cards horizontales (style Bootstrap) :**

```html
<section class="mt-5">
  <h2>Février 2026 : Ressources Majeures</h2>
  <p>Quatre avancées significatives qui impactent l'enseignement avec l'IA</p>

  <!-- Card 1 : Souveraineté cognitive -->
  <div class="card mb-4 shadow-sm">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h3 class="card-title mb-0">🧠 La souveraineté cognitive de l'élève</h3>
        <span class="badge bg-primary">Philosophie</span>
      </div>
      <p class="text-muted small">Stéphane Diebold • AFFEN • Janvier 2026</p>
      <p class="card-text mt-3">
        L'autonomie classique (Descartes, Kant) ne suffit plus à l'ère de l'IA. 
        Le philosophe Bernard Stiegler propose le concept de <strong>souveraineté cognitive</strong> : 
        reprendre le contrôle sur son attention, ses désirs et sa réflexivité.
      </p>
      <p class="card-text">
        <strong>Les 3 piliers :</strong>
      </p>
      <ul>
        <li><strong>Souveraineté attentionnelle</strong> — Résister à la fragmentation cognitive</li>
        <li><strong>Souveraineté du désir</strong> — Distinguer désir intériorisé vs prescrit</li>
        <li><strong>Métacognition</strong> — Penser sa pensée, garder la capacité de jugement</li>
      </ul>
      <div class="mt-3">
        <a href="#souverainete-cognitive" class="btn btn-outline-primary btn-sm">
          Lire l'analyse complète ↓
        </a>
        <a href="https://affen.fr/pedagogie/lautonomie-de-lapprenant-est-elle-encore-possible-la-reponse-de-la-souverainete-cognitive/" 
           class="btn btn-outline-secondary btn-sm" target="_blank">
          Article original →
        </a>
      </div>
    </div>
  </div>

  <!-- Card 2 : OCDE -->
  <div class="card mb-4 shadow-sm">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h3 class="card-title mb-0">📊 Indicateurs OCDE sur les capacités de l'IA</h3>
        <span class="badge bg-success">Institutionnel</span>
      </div>
      <p class="text-muted small">OCDE • Juin 2025 • 100+ experts</p>
      <p class="card-text mt-3">
        Premier cadre international pour évaluer les capacités de l'IA par rapport 
        aux capacités humaines sur 9 domaines : langage, raisonnement, perception, 
        interaction sociale, manipulation manuelle.
      </p>
      <p class="card-text">
        <strong>Chiffres clés (janvier 2026) :</strong>
      </p>
      <ul>
        <li><strong>75% des étudiants 16+</strong> ont utilisé l'IA générative en 2025</li>
        <li><strong>1/3 des individus OCDE</strong> utilisent l'IA générative</li>
        <li><strong>20,2% des entreprises</strong> utilisent l'IA (vs 8,7% en 2023)</li>
        <li><strong>Écart d'âge : 53,6 points</strong> (plus forte disparité)</li>
      </ul>
      <div class="mt-3">
        <a href="#ocde-indicateurs" class="btn btn-outline-primary btn-sm">
          Voir l'analyse détaillée ↓
        </a>
        <a href="https://www.oecd.org/fr/publications/2025/06/introducing-the-oecd-ai-capability-indicators_7c0731f0.html" 
           class="btn btn-outline-secondary btn-sm" target="_blank">
          Rapport OCDE →
        </a>
      </div>
    </div>
  </div>

  <!-- Card 3 : Prompt Repetition -->
  <div class="card mb-4 shadow-sm">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h3 class="card-title mb-0">🔧 Prompt Repetition : +76% de précision</h3>
        <span class="badge bg-warning text-dark">Technique</span>
      </div>
      <p class="text-muted small">Google Research • Décembre 2025 • 7 modèles testés</p>
      <p class="card-text mt-3">
        Une découverte surprenante : répéter le prompt deux fois améliore significativement 
        la qualité des réponses de l'IA — sans augmenter le temps de réponse ni la longueur.
      </p>
      <p class="card-text">
        <strong>Résultats :</strong>
      </p>
      <ul>
        <li><strong>+76 points de précision</strong> sur certains benchmarks (21% → 97%)</li>
        <li><strong>47 victoires / 0 défaite</strong> sur 70 tests (7 modèles)</li>
        <li><strong>Aucun coût supplémentaire</strong> (temps/tokens)</li>
        <li><strong>Fonctionne sur tous les modèles</strong> (Gemini, GPT, Claude, DeepSeek)</li>
      </ul>
      <div class="mt-3">
        <a href="#prompt-repetition" class="btn btn-outline-primary btn-sm">
          Tutoriel complet ↓
        </a>
        <a href="https://arxiv.org/pdf/2512.14982" 
           class="btn btn-outline-secondary btn-sm" target="_blank">
          Paper arXiv →
        </a>
      </div>
    </div>
  </div>

  <!-- Card 4 : Examens oraux ⭐ NOUVEAU -->
  <div class="card mb-4 shadow-sm border-danger">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <h3 class="card-title mb-0">🎤 Le retour des examens oraux</h3>
        <span class="badge bg-danger">Évaluation</span>
      </div>
      <p class="text-muted small">Andrea Fenton • Educational Researcher • Juin 2025</p>
      <p class="card-text mt-3">
        Face à ChatGPT qui réussit les examens avec 78,9%+, une solution ancienne 
        revient en force : <strong>l'examen oral</strong>. Une alternative concrète 
        pour maintenir l'intégrité académique et évaluer authentiquement.
      </p>
      <p class="card-text">
        <strong>Bénéfices majeurs :</strong>
      </p>
      <ul>
        <li><strong>Intégrité académique</strong> — Difficilement trichable avec l'IA</li>
        <li><strong>Pensée critique en temps réel</strong> — Force l'argumentation, pas de copier-coller</li>
        <li><strong>Compétences professionnelles</strong> — Mimique entretiens, présentations</li>
        <li><strong>Communication orale</strong> — Développe confiance et expression</li>
      </ul>
      <div class="mt-3">
        <a href="#examens-oraux" class="btn btn-outline-primary btn-sm">
          Guide pratique complet ↓
        </a>
        <a href="https://journals.sagepub.com/doi/full/10.3102/0013189X251333638" 
           class="btn btn-outline-secondary btn-sm" target="_blank">
          Article Educational Researcher →
        </a>
      </div>
    </div>
  </div>
</section>
```

---

### **ÉTAPE 2 : Créer les 4 sections détaillées**

**Les 3 premières sections (Souveraineté cognitive, OCDE, Prompt Repetition) sont identiques au plan V1.**

**Je détaille ici la NOUVELLE section "Examens oraux" :**

---

#### **2.4 Section "Examens oraux" (nouvelle — détaillée)**

```html
<section id="examens-oraux" class="mt-5 pt-5 border-top">
  <h2>🎤 Le retour des examens oraux à l'ère de l'IA</h2>
  <p class="lead">
    Une solution ancienne pour un problème moderne : évaluer authentiquement malgré ChatGPT
  </p>

  <div class="row mt-4">
    <div class="col-md-8">
      <h3>Le contexte</h3>
      <p>
        Depuis l'arrivée de ChatGPT en novembre 2022, les enseignants font face à 
        un défi majeur : <strong>comment évaluer quand l'IA peut générer des devoirs 
        de qualité ?</strong>
      </p>
      <p>
        Une étude récente (Herrmann-Werner et al., 2024) montre que ChatGPT-4 
        <strong>réussit les examens de médecine avec un minimum de 78,9%</strong>, 
        quel que soit le prompt utilisé.
      </p>

      <div class="alert alert-warning">
        <h5>⚠️ Le problème des devoirs écrits traditionnels</h5>
        <ul class="mb-0">
          <li>Facilement générables par IA (dissertations, rapports, analyses)</li>
          <li>Détection difficile (l'IA devient de plus en plus "humaine")</li>
          <li>Course aux armements (détecteurs vs contournements)</li>
          <li>Climat de suspicion généralisée (perte de confiance élève-enseignant)</li>
        </ul>
      </div>

      <h3 class="mt-5">La solution : Les examens oraux</h3>
      <p>
        Dans un article publié en juin 2025 dans <em>Educational Researcher</em>, 
        Andrea Fenton propose de <strong>reconsidérer les examens oraux</strong> 
        comme alternative aux évaluations écrites traditionnelles.
      </p>

      <div class="alert alert-success">
        <h5>✅ Pourquoi les examens oraux fonctionnent</h5>
        <ol>
          <li><strong>Intégrité académique naturelle</strong> — Impossible d'utiliser 
          l'IA en temps réel pendant un oral (sauf écouteur, détectable)</li>
          <li><strong>Évaluation authentique</strong> — Teste la pensée critique en 
          temps réel, pas la capacité à copier-coller</li>
          <li><strong>Préparation professionnelle</strong> — Mimique les situations 
          réelles (entretiens d'embauche, soutenances, présentations)</li>
          <li><strong>Compétences transversales</strong> — Développe communication 
          orale, confiance, gestion du stress</li>
          <li><strong>Apprentissage profond</strong> — Force la compréhension réelle, 
          pas la mémorisation superficielle</li>
        </ol>
      </div>

      <h3 class="mt-5">Types d'examens oraux</h3>

      <div class="card mb-3">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">1. Entretien individuel (10-15 min)</h5>
        </div>
        <div class="card-body">
          <p><strong>Format :</strong> Discussion structurée 1-à-1 avec l'enseignant</p>
          <p><strong>Usages :</strong></p>
          <ul>
            <li>Défendre un travail écrit déjà rendu (« Expliquez votre démarche »)</li>
            <li>Approfondir un thème du cours (« Que pensez-vous de... ? »)</li>
            <li>Vérifier la compréhension d'un concept clé</li>
          </ul>
          <p><strong>Exemple (Philosophie) :</strong> « Vous avez écrit sur la liberté. 
          Expliquez-moi la distinction entre liberté négative et liberté positive. 
          Comment l'appliquez-vous à votre exemple ? »</p>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0">2. Présentation orale + questions (15-20 min)</h5>
        </div>
        <div class="card-body">
          <p><strong>Format :</strong> Exposé structuré (5-10 min) suivi de questions (5-10 min)</p>
          <p><strong>Usages :</strong></p>
          <ul>
            <li>Restitution de projet de recherche</li>
            <li>Analyse d'une œuvre (littérature, histoire de l'art)</li>
            <li>Défense de thèse (TPE, mémoire, grand oral)</li>
          </ul>
          <p><strong>Exemple (Histoire) :</strong> « Présentez les causes de la Première 
          Guerre mondiale en 8 minutes, puis répondez à mes questions sur les alliances. »</p>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header bg-warning text-dark">
          <h5 class="mb-0">3. Examen oral collectif / Débat (30-45 min)</h5>
        </div>
        <div class="card-body">
          <p><strong>Format :</strong> Groupes de 3-5 élèves débattent devant l'enseignant</p>
          <p><strong>Usages :</strong></p>
          <ul>
            <li>Débat structuré sur une controverse (sciences, philosophie, EMC)</li>
            <li>Résolution collaborative de problème (maths, physique)</li>
            <li>Simulation professionnelle (gestion, économie)</li>
          </ul>
          <p><strong>Exemple (SVT) :</strong> « Débat : Faut-il autoriser les OGM en 
          agriculture ? 2 élèves pour, 2 contre, 10 min de préparation, 20 min de débat. »</p>
        </div>
      </div>

      <h3 class="mt-5">Guide pratique de mise en œuvre</h3>

      <div class="accordion" id="accordionGuide">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" 
                    data-bs-target="#step1">
              Étape 1 : Définir l'objectif pédagogique
            </button>
          </h2>
          <div id="step1" class="accordion-collapse collapse show" 
               data-bs-parent="#accordionGuide">
            <div class="accordion-body">
              <p><strong>Questions à se poser :</strong></p>
              <ul>
                <li>Qu'est-ce que je veux vraiment évaluer ? (Compréhension ? Argumentation ? 
                Créativité ?)</li>
                <li>Est-ce que l'oral est le meilleur format pour ça ?</li>
                <li>Quelle compétence transversale je souhaite développer ? 
                (Oral ? Confiance ?)</li>
              </ul>
              <p><strong>Conseil :</strong> Commencez par un oral à faible enjeu 
              (coefficient 1-2) pour tester le format.</p>
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" 
                    data-bs-toggle="collapse" data-bs-target="#step2">
              Étape 2 : Créer la grille d'évaluation
            </button>
          </h2>
          <div id="step2" class="accordion-collapse collapse" 
               data-bs-parent="#accordionGuide">
            <div class="accordion-body">
              <p><strong>Critères recommandés (adaptables) :</strong></p>
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Critère</th>
                    <th>Points</th>
                    <th>Indicateurs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Maîtrise du contenu</strong></td>
                    <td>40%</td>
                    <td>Concepts clairs, exemples pertinents, profondeur</td>
                  </tr>
                  <tr>
                    <td><strong>Argumentation</strong></td>
                    <td>30%</td>
                    <td>Logique, nuances, anticipation objections</td>
                  </tr>
                  <tr>
                    <td><strong>Communication orale</strong></td>
                    <td>20%</td>
                    <td>Clarté, débit, regard, gestion du temps</td>
                  </tr>
                  <tr>
                    <td><strong>Réactivité aux questions</strong></td>
                    <td>10%</td>
                    <td>Écoute, adaptation, honnêteté ("je ne sais pas")</td>
                  </tr>
                </tbody>
              </table>
              <p class="small text-muted">
                <strong>Note :</strong> Évitez de sur-pénaliser le stress ou la 
                timidité. Valorisez la préparation et l'effort.
              </p>
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" 
                    data-bs-toggle="collapse" data-bs-target="#step3">
              Étape 3 : Préparer les élèves
            </button>
          </h2>
          <div id="step3" class="accordion-collapse collapse" 
               data-bs-parent="#accordionGuide">
            <div class="accordion-body">
              <p><strong>Actions essentielles :</strong></p>
              <ol>
                <li><strong>Annoncer l'oral au moins 2 semaines à l'avance</strong> 
                (temps de préparation)</li>
                <li><strong>Donner les critères d'évaluation dès le départ</strong> 
                (transparence)</li>
                <li><strong>Faire un oral "blanc"</strong> non noté en classe 
                (familiarisation)</li>
                <li><strong>Proposer des ressources</strong> : vidéos d'exemples, 
                conseils de prise de parole</li>
                <li><strong>Autoriser des notes</strong> (mots-clés, schémas) 
                — pas de texte rédigé</li>
              </ol>
              <p><strong>Pour les élèves anxieux :</strong></p>
              <ul>
                <li>Possibilité de passer en petit groupe (3 élèves + enseignant)</li>
                <li>Temps de préparation sur place (5-10 min avant oral)</li>
                <li>Format "conversation" plutôt qu'interrogatoire</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" 
                    data-bs-toggle="collapse" data-bs-target="#step4">
              Étape 4 : Organiser la logistique
            </button>
          </h2>
          <div id="step4" class="accordion-collapse collapse" 
               data-bs-parent="#accordionGuide">
            <div class="accordion-body">
              <p><strong>Planification :</strong></p>
              <ul>
                <li><strong>Durée par élève</strong> : 10-15 min (oral individuel) 
                ou 5-8 min (défense de projet)</li>
                <li><strong>Classe de 30 élèves</strong> : 5-7,5h au total</li>
                <li><strong>Solution pratique</strong> : Étaler sur 2-3 semaines, 
                5 élèves par séance pendant que les autres travaillent en autonomie</li>
              </ul>
              <p><strong>Salle :</strong></p>
              <ul>
                <li>Isolée (pas de bruit externe)</li>
                <li>Configuration : table en U ou face-à-face</li>
                <li>Matériel : chronomètre visible, grille d'évaluation</li>
              </ul>
              <p><strong>Astuce gain de temps :</strong> Oral collectif (3 élèves 
              en même temps) ou examen en doublon avec un collègue.</p>
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" 
                    data-bs-toggle="collapse" data-bs-target="#step5">
              Étape 5 : Conduire l'oral et évaluer
            </button>
          </h2>
          <div id="step5" class="accordion-collapse collapse" 
               data-bs-parent="#accordionGuide">
            <div class="accordion-body">
              <p><strong>Pendant l'oral :</strong></p>
              <ol>
                <li><strong>Accueil bienveillant</strong> — Mettre l'élève à l'aise 
                (« Respire, prends ton temps »)</li>
                <li><strong>Écoute active</strong> — Laisser finir, ne pas couper</li>
                <li><strong>Questions de relance</strong> — « Peux-tu développer ? », 
                « Qu'est-ce qui te fait dire ça ? »</li>
                <li><strong>Valoriser l'effort</strong> — Même si réponse imparfaite</li>
                <li><strong>Noter immédiatement</strong> (grille pré-remplie) — 
                Sinon effet de halo</li>
              </ol>
              <p><strong>Après l'oral :</strong></p>
              <ul>
                <li><strong>Feedback oral immédiat</strong> (2-3 points forts/axes amélioration)</li>
                <li><strong>Note rendue rapidement</strong> (48h max) avec commentaire écrit</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <h3 class="mt-5">Réponses aux objections fréquentes</h3>

      <div class="card mb-3 border-warning">
        <div class="card-body">
          <h5>❓ « C'est trop chronophage ! »</h5>
          <p><strong>Réponse :</strong></p>
          <ul>
            <li>Oui, mais vous gagnez du temps sur la correction de copies 
            (pas de rédaction à lire)</li>
            <li>Réservez l'oral aux évaluations majeures (1-2 par trimestre)</li>
            <li>Format court (5-8 min) + oraux groupés = 2-3h pour 30 élèves</li>
            <li>L'investissement en vaut la peine : apprentissage profond + 
            relation pédagogique renforcée</li>
          </ul>
        </div>
      </div>

      <div class="card mb-3 border-warning">
        <div class="card-body">
          <h5>❓ « Les élèves sont trop stressés ! »</h5>
          <p><strong>Réponse :</strong></p>
          <ul>
            <li>Le stress diminue avec la pratique régulière (oral "blanc" + 
            plusieurs oraux dans l'année)</li>
            <li>Format "conversation" plutôt qu'interrogatoire</li>
            <li>Autoriser les notes préparées (pas rédigées)</li>
            <li>Le stress fait partie de la compétence à développer 
            (gestion émotionnelle)</li>
            <li>Alternative : oral en binôme pour élèves très anxieux</li>
          </ul>
        </div>
      </div>

      <div class="card mb-3 border-warning">
        <div class="card-body">
          <h5>❓ « Comment assurer l'équité entre élèves ? »</h5>
          <p><strong>Réponse :</strong></p>
          <ul>
            <li><strong>Grille d'évaluation stricte</strong> communiquée à l'avance</li>
            <li><strong>Mêmes questions de base</strong> pour tous (avec variations 
            de relance)</li>
            <li><strong>Enregistrement audio</strong> (si possible) pour revoir en 
            cas de contestation</li>
            <li><strong>Double correction</strong> possible (collègue assiste à l'oral 
            ou écoute enregistrement)</li>
          </ul>
        </div>
      </div>

      <div class="card mb-3 border-warning">
        <div class="card-body">
          <h5>❓ « L'élève peut quand même utiliser l'IA pour préparer ! »</h5>
          <p><strong>Réponse :</strong></p>
          <ul>
            <li>Oui, et c'est acceptable pour la préparation (recherche, structure)</li>
            <li>Mais l'oral teste la <strong>compréhension</strong>, pas la 
            mémorisation</li>
            <li>Questions de relance et approfondissement détectent vite la 
            non-compréhension</li>
            <li>« Expliquez avec vos propres mots » / « Donnez un exemple personnel » 
            = impossibles à préparer avec IA</li>
          </ul>
        </div>
      </div>

      <h3 class="mt-5">Ressources téléchargeables</h3>
      <div class="list-group">
        <a href="#" class="list-group-item list-group-item-action disabled">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">📄 Grille d'évaluation oral individuel (PDF)</h5>
            <small class="text-muted">Bientôt disponible</small>
          </div>
          <p class="mb-1">Template modifiable pour créer votre grille</p>
        </a>
        <a href="#" class="list-group-item list-group-item-action disabled">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">📄 Grille d'évaluation présentation orale (PDF)</h5>
            <small class="text-muted">Bientôt disponible</small>
          </div>
          <p class="mb-1">Critères adaptés aux exposés</p>
        </a>
        <a href="#" class="list-group-item list-group-item-action disabled">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">📄 Checklist organisationnelle (PDF)</h5>
            <small class="text-muted">Bientôt disponible</small>
          </div>
          <p class="mb-1">Planification semaine par semaine</p>
        </a>
        <a href="#" class="list-group-item list-group-item-action disabled">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">📄 Fiche conseil élèves (PDF)</h5>
            <small class="text-muted">Bientôt disponible</small>
          </div>
          <p class="mb-1">Comment se préparer efficacement à un oral</p>
        </a>
      </div>

    </div>

    <div class="col-md-4">
      <div class="card bg-light mb-3">
        <div class="card-body">
          <h5>📚 Référence</h5>
          <p class="small">
            <strong>Auteure :</strong> Andrea Fenton<br>
            <strong>Journal :</strong> Educational Researcher<br>
            <strong>Date :</strong> Juin 2025<br>
            <strong>Impact Factor :</strong> 4.9
          </p>
          <a href="https://journals.sagepub.com/doi/full/10.3102/0013189X251333638" 
             class="btn btn-sm btn-outline-primary" target="_blank">
            Lire l'article complet →
          </a>
        </div>
      </div>

      <div class="card bg-light mb-3">
        <div class="card-body">
          <h5>💡 Points clés recherche</h5>
          <ul class="small mb-0">
            <li>ChatGPT-4 réussit examens médicaux avec 78,9%+ minimum</li>
            <li>Examens oraux = évaluation authentique compétences critiques</li>
            <li>Développe communication orale (compétence pro clé)</li>
            <li>Renforce relation pédagogique enseignant-élève</li>
          </ul>
        </div>
      </div>

      <div class="card bg-light mb-3">
        <div class="card-body">
          <h5>🎯 Disciplines concernées</h5>
          <p class="small">
            <strong>Particulièrement adapté pour :</strong>
          </p>
          <ul class="small mb-0">
            <li>Lettres, Philosophie, HGGSP</li>
            <li>Langues vivantes (pratique orale)</li>
            <li>Sciences (défense de protocole expérimental)</li>
            <li>Enseignement professionnel (simulation situation pro)</li>
            <li>Grand Oral (Terminale)</li>
          </ul>
        </div>
      </div>

      <div class="card bg-light">
        <div class="card-body">
          <h5>📖 Dans le livre</h5>
          <p class="small mb-0">
            Encadré "Alternative : Le retour des examens oraux" dans le 
            Chapitre "L'évaluation repensée", après la section sur la 
            détection de l'usage de l'IA.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

### **ÉTAPE 3 : Ajouter un lien dans le footer**

**Dans le footer de toutes les pages :**
```html
<li class="mb-2">
  <a href="veille.html#fevrier-2026">
    🆕 Veille Février 2026 (4 ressources)
  </a>
</li>
```

---

### **ÉTAPE 4 : Mettre à jour la homepage (index.html)**

**Modifier la card "Veille" sur la homepage :**

```html
<div class="card">
  <div class="card-body">
    <span class="badge bg-danger position-absolute top-0 end-0 m-2">🆕 Mis à jour</span>
    <h3 class="card-title">Veille et nouveautés</h3>
    <p class="card-text">
      Actualités IA & éducation, nouveaux outils, mises à jour mensuelles 
      pour rester à la pointe.
    </p>
    <p class="text-muted small mb-2">
      <strong>Février 2026 :</strong> Souveraineté cognitive • Indicateurs OCDE • 
      Prompt Repetition • Examens oraux
    </p>
    <a href="veille.html" class="btn btn-outline-primary">
      Consulter la veille →
    </a>
  </div>
</div>
```

---

## ✅ CHECKLIST POUR ANTIGRAVITY

### **Fichiers à modifier :**
- [ ] `veille.html` — Ajouter 4 cards + 4 sections détaillées
- [ ] `index.html` — Mettre à jour card "Veille" (mention 4 ressources)
- [ ] Footer de toutes les pages — Modifier lien "Veille Février 2026 (4 ressources)"

### **Assets nécessaires :**
- [ ] Aucun nouveau (tout en HTML/CSS Bootstrap déjà présent)

### **Tests à effectuer :**
- [ ] Ancres de navigation fonctionnelles (`#souverainete-cognitive`, `#ocde-indicateurs`, `#prompt-repetition`, `#examens-oraux`)
- [ ] Liens externes ouvrent dans nouvel onglet (`target="_blank"`)
- [ ] Accordéon "Guide pratique" fonctionne (Bootstrap collapse)
- [ ] Responsive mobile (cards + accordéons)
- [ ] Badges de couleur visibles

### **Temps estimé :**
- Intégration HTML : **2-3h** (ajout section examens oraux + accordéon)
- Tests responsive : **30 min**
- **TOTAL : 2h30-3h30**

---

## 📝 NOTES POUR FABIEN

**Une fois le site mis à jour par Antigravity :**

1. ✅ Vérifier section "Examens oraux" sur mobile (accordéon)
2. ✅ Tester tous les liens externes
3. ✅ Ajouter QR codes dans le livre pointant vers `veille.html#examens-oraux`

**Ressources à créer ultérieurement (marquées "Bientôt disponible") :**
- Grille d'évaluation oral individuel (PDF modifiable)
- Grille d'évaluation présentation orale (PDF)
- Checklist organisationnelle (PDF)
- Fiche conseil élèves (PDF)

**Ces PDFs peuvent être créés plus tard et ajoutés facilement.**

---

## 🎯 RÉSULTAT ATTENDU

**Page `veille.html` structurée en 5 parties :**

1. **Header** — Intro + badge "Février 2026 — 4 ressources"
2. **4 Cards cliquables** — Souveraineté cognitive, OCDE, Prompt Repetition, Examens oraux
3. **4 Sections détaillées** — Analyses complètes avec ressources, exemples, liens
4. **Section Examens oraux** — Avec accordéon guide pratique 5 étapes

**Navigation fluide :**
- Click sur card → scroll vers section détaillée
- Liens vers sources externes (AFFEN, OCDE, arXiv, Educational Researcher)
- Accordéon Bootstrap pour le guide pratique
- Liens retour vers livre (chapitres concernés)

**Visuel cohérent avec le reste du site :**
- Bootstrap cards
- Badges colorés (primary, success, warning, danger)
- Alertes (info, warning, success)
- Accordéon Bootstrap (guide pratique)
- Sidebar avec ressources complémentaires

---

## 📊 COMPARAISON V1 → V2

| Élément | Plan V1 | Plan V2 | Changement |
|---------|---------|---------|------------|
| Nombre de ressources | 3 | 4 | +1 (Examens oraux) |
| Nombre de cards | 3 | 4 | +1 |
| Nombre de sections détaillées | 3 | 4 | +1 |
| Accordéon interactif | Non | Oui | Guide pratique 5 étapes |
| Temps intégration estimé | 1h30-2h30 | 2h30-3h30 | +1h |
| Pages impactées | 3 | 3 | Identique |

---

**Antigravity, tout le code HTML est prêt ci-dessus. La section "Examens oraux" est complète avec accordéon Bootstrap. Besoin de clarifications ? Demande à Fabien ! 🚀**
