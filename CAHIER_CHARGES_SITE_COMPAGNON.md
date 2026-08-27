# 🌐 CAHIER DES CHARGES : SITE COMPAGNON
## Les outils pour enseigner avec l'IA - Guide pratique

**Auteur** : Fabien Boyer  
**Éditeur** : Ellipses  
**Date** : Février 2026  
**Objectif** : Site compagnon du livre pour ressources évolutives

---

## 🎯 OBJECTIFS DU SITE

### **Objectif principal**
Fournir un **complément vivant et évolutif** au livre papier avec :
- Ressources mises à jour régulièrement
- Conversations ChatGPT/Claude complètes (via QR codes dans le livre)
- Outils complémentaires non présents dans le livre
- Vidéos recommandées et playlists

### **Objectifs secondaires**
1. ✅ Pallier l'obsolescence rapide des outils IA
2. ✅ Éviter la surcharge du livre papier
3. ✅ Créer une communauté autour du livre
4. ✅ Faciliter la mise à jour (sans rééditer le livre)

---

## 📊 STRUCTURE DU SITE

### **HOMEPAGE (Page d'accueil)**

**URL** : `https://ellipses.fr/enseigner-avec-ia/` ou `https://enseigner-ia.ellipses.fr/`

**Contenu** :
```
=== HERO SECTION ===
Titre : Les outils pour enseigner avec l'IA
Sous-titre : Site compagnon du livre de Fabien Boyer (Ellipses, 2026)

Bouton CTA : "Découvrir les ressources"
Bouton secondaire : "Commander le livre"

Image : Couverture du livre

=== DESCRIPTION ===
Ce site compagnon propose des ressources évolutives pour compléter le livre :
- Conversations ChatGPT/Claude complètes
- 10+ outils complémentaires
- Playlists vidéo recommandées
- Prompts avancés
- Mise à jour mensuelle

=== 4 BLOCS PRINCIPAUX ===

[BLOC 1] 📚 Conversations complètes
Accédez aux conversations ChatGPT et Claude mentionnées dans le livre
→ Lien : /conversations

[BLOC 2] 🔧 Outils complémentaires
Découvrez 10+ outils IA pour l'éducation (non présents dans le livre)
→ Lien : /outils

[BLOC 3] 🎥 Se former sur l'IA
Playlists YouTube (Micode, Monsieur Phi) + cours en ligne
→ Lien : /formation

[BLOC 4] 📰 Veille et nouveautés
Derniers outils IA, actualités, mises à jour mensuelles
→ Lien : /veille

=== FOOTER ===
- À propos
- Contact
- Mentions légales
- Crédits
```

---

### **PAGE 1 : CONVERSATIONS COMPLÈTES**

**URL** : `/conversations`

**Objectif** : Donner accès aux conversations longues ChatGPT/Claude mentionnées dans le livre via QR codes

**Structure** :
```
=== EN-TÊTE ===
Titre : Conversations complètes
Sous-titre : Les exemples longs du livre, à consulter en intégralité

=== ORGANISATION PAR CHAPITRE ===

CHAPITRE 3 : Ingénierie pédagogique
┣━ Conversation 1 : Créer une séquence sur la Révolution française (Cycle 4)
┃  ├─ Contexte : Chapitre 3, page XX
┃  ├─ Outil utilisé : ChatGPT 4
┃  └─ [Bouton] Voir la conversation complète
┃
┣━ Conversation 2 : Différencier un cours de mathématiques (Seconde)
┃  ├─ Contexte : Chapitre 3, page XX
┃  ├─ Outil utilisé : Claude Sonnet
┃  └─ [Bouton] Voir la conversation complète

CHAPITRE 5 : Évaluation
┣━ Conversation 3 : Créer une grille d'évaluation en SVT
┃  ├─ Contexte : Chapitre 5, page XX
┃  ├─ Outil utilisé : ChatGPT 4
┃  └─ [Bouton] Voir la conversation complète

[...ETC...]

=== FORMAT D'AFFICHAGE DES CONVERSATIONS ===

Pour chaque conversation :
- Titre clair et descriptif
- Contexte (chapitre + page du livre)
- Outil utilisé (ChatGPT 4, Claude Sonnet, etc.)
- Conversation affichée en format chat (bulle utilisateur / bulle IA)
- Bouton "Copier le prompt" pour chaque message utilisateur
- Date de la conversation
```

**Nombre estimé** : 15-20 conversations

---

### **PAGE 2 : OUTILS COMPLÉMENTAIRES**

**URL** : `/outils`

**Objectif** : Lister les outils IA pertinents NON présents dans le livre

**Structure** :
```
=== EN-TÊTE ===
Titre : Outils complémentaires
Sous-titre : 10+ outils IA pour l'éducation, mis à jour régulièrement

Filtres : [Tous] [Gratuit] [Sans compte] [FR/EU] [Primaire] [Collège] [Lycée] [Supérieur]

=== LISTE DES OUTILS ===

Chaque outil affiché sous forme de CARTE :

┌─────────────────────────────────┐
│ [ICÔNE] Mindmaclasse           │
│                                 │
│ Cartes mentales + quiz          │
│ 🇫🇷 FR/EU · 🆓 Gratuit · ⚡ Sans compte │
│                                 │
│ Description courte (2 lignes)   │
│                                 │
│ [Bouton] Découvrir              │
└─────────────────────────────────┘

=== OUTILS À LISTER (PRIORITÉ 1) ===

1. Mindmaclasse (FR/EU)
   - Catégorie : Quiz, Mindmap
   - Public : Collège-Lycée
   - Tags : Gratuit, Sans compte, FR/EU

2. Fobizz (FR/EU)
   - Catégorie : Suite complète
   - Public : Tous niveaux
   - Tags : Freemium, FR/EU

3. Euria (FR/EU - Suisse)
   - Catégorie : Chatbot
   - Public : Tous niveaux
   - Tags : Gratuit, Sans compte, FR/EU

4. Teacher Tools
   - Catégorie : Administration
   - Public : Enseignants
   - Tags : Gratuit

5. Conversations Google Traduction
   - Catégorie : Langues
   - Public : Collège-Lycée
   - Tags : Gratuit, Application mobile

6. QR Code Art Generator
   - Catégorie : Images, QR codes
   - Public : Tous niveaux
   - Tags : Gratuit, Sans compte

7. AiAiapps (EPFL)
   - Catégorie : Quiz, Images
   - Public : Supérieur
   - Tags : Gratuit, Sans compte, Open source

8. Youmind
   - Catégorie : Recherche
   - Public : Lycée-Supérieur
   - Tags : Freemium

9. Keepmind
   - Catégorie : Quiz, Flashcards, Mindmap
   - Public : Collège-Lycée-Supérieur
   - Tags : Freemium

10. Prism (OpenAI)
    - Catégorie : Documents (LaTeX)
    - Public : Supérieur (Maths/Physique)
    - Tags : Gratuit avec compte OpenAI

[...AUTRES OUTILS...]

=== PAGE DÉTAIL OUTIL ===

Pour chaque outil, page dédiée :
- Nom + Logo
- Description complète
- Cas d'usage pédagogique
- Captures d'écran
- Tutoriel vidéo (si disponible)
- Lien vers l'outil
- Date d'ajout + Date de dernière mise à jour
```

---

### **PAGE 3 : SE FORMER SUR L'IA**

**URL** : `/formation`

**Objectif** : Playlists vidéos + cours en ligne pour se former

**Structure** :
```
=== EN-TÊTE ===
Titre : Se former sur l'IA
Sous-titre : Vidéos, cours et ressources pour comprendre l'IA

Onglets : [Vidéos YouTube] [Cours en ligne] [Articles de référence]

=== ONGLET 1 : VIDÉOS YOUTUBE ===

PLAYLIST 1 : Monsieur Phi - Réflexion éthique
┣━ ChatGPT et l'éducation : faut-il avoir peur ? (25 min)
┣━ L'IA peut-elle être créative ? (30 min)
┣━ Les biais de l'IA : enjeux éthiques (22 min)
┣━ Propriété intellectuelle et IA générative (28 min)
┗━ L'IA va-t-elle remplacer les enseignants ? (20 min)

[Embed vidéo YouTube ou lien direct]

PLAYLIST 2 : Micode - Vulgarisation technique
┣━ Comment fonctionne ChatGPT ? (15 min)
┣━ Les hallucinations de l'IA expliquées (12 min)
┣━ IA générative vs IA classique (18 min)
┗━ Les données d'entraînement (20 min)

[Embed vidéo YouTube ou lien direct]

PLAYLIST 3 : Autres chaînes recommandées
┣━ Science4All
┣━ Underscore_
┗━ [Autres...]

=== ONGLET 2 : COURS EN LIGNE ===

Cours gratuits :
┣━ France Université Numérique (FUN) : "IA pour l'éducation"
┣━ Coursera : "AI for Everyone" (Andrew Ng) - en français
┗━ OpenClassrooms : "Découvrez l'IA"

Cours payants :
┣━ Udemy : "ChatGPT pour les enseignants"
┗━ LinkedIn Learning : "IA et pédagogie"

=== ONGLET 3 : ARTICLES DE RÉFÉRENCE ===

Articles académiques :
┣━ "L'IA en éducation : enjeux et perspectives" (Ministère)
┣━ "ChatGPT et la triche : état des lieux" (CRAP, mars 2025)
┗━ [Autres...]

Articles de vulgarisation :
┣━ "Comprendre les LLM en 10 minutes"
┣━ "RGPD et IA : ce que les enseignants doivent savoir"
┗━ [Autres...]
```

---

### **PAGE 4 : VEILLE ET NOUVEAUTÉS**

**URL** : `/veille`

**Objectif** : Actualités IA + nouveaux outils + mises à jour

**Structure** :
```
=== EN-TÊTE ===
Titre : Veille et nouveautés
Sous-titre : Actualités IA, nouveaux outils, mises à jour mensuelles

=== SECTION 1 : SITES DE VEILLE ===

Sites recommandés :

1. Une IA par jour (https://www.uneiaparjour.fr/)
   - Veille quotidienne sur les outils IA
   - Catégorie "éducation" très riche
   - Focus outils FR/EU
   - [Bouton] Consulter le site

[Autres sites de veille...]

=== SECTION 2 : MISES À JOUR MENSUELLES ===

FÉVRIER 2026
┣━ Nouveau : Mindmaclasse v2.0 (cartes mentales améliorées)
┣━ Nouveau : ChatGPT 4.5 (meilleure compréhension du français)
┗━ Mise à jour : NotebookLM (support vidéo YouTube amélioré)

JANVIER 2026
┣━ Nouveau : Gemini 3 Pro (raisonnement intégré)
┣━ Nouveau : Fobizz éducation (suite complète européenne)
┗━ Mise à jour : Pix+IA (nouveaux exercices disponibles)

[...ARCHIVES MOIS PRÉCÉDENTS...]

=== SECTION 3 : ACTUALITÉS IA & ÉDUCATION ===

Blog / Articles courts :
┣━ "ChatGPT 4.5 : quoi de neuf pour les enseignants ?"
┣━ "Pix+IA : retour d'expérience après 6 mois"
┣━ "Nouveaux outils souverains : la vague européenne"
┗━ [Autres articles...]
```

---

### **PAGE 5 : À PROPOS**

**URL** : `/a-propos`

**Contenu** :
```
=== QUI SUIS-JE ? ===
Fabien Boyer
Professeur de Mathématiques
Auteur de "Les outils pour enseigner avec l'IA" (Ellipses, 2026)

[Photo de l'auteur]

[Bio courte : 3-4 lignes]

=== LE LIVRE ===
"Les outils pour enseigner avec l'IA - Guide pratique"
Éditions Ellipses, 2026
110 pages

[Couverture du livre]

[Bouton] Commander le livre

=== CE SITE ===
Ce site compagnon complète le livre avec des ressources évolutives :
- Conversations complètes
- Outils complémentaires
- Playlists vidéo
- Veille mensuelle

Mise à jour : mensuelle
Dernière mise à jour : [Date]

=== CONTACT ===
Pour toute question ou suggestion :
[Formulaire de contact ou email]

Twitter/X : [@VotreCompte]
LinkedIn : [Votre profil]
```

---

## 🎨 DESIGN ET ERGONOMIE

### **Principes de design**
- ✅ **Sobre et professionnel** (pas de fioritures)
- ✅ **Responsive** (mobile, tablette, desktop)
- ✅ **Accessibilité** (WCAG 2.1 niveau AA minimum)
- ✅ **Chargement rapide** (< 2 secondes)

### **Charte graphique**
- **Couleurs** : Reprendre la palette de la couverture du livre Ellipses
  - Couleur principale : Bleu Ellipses
  - Couleur secondaire : Gris foncé
  - Couleur accent : Orange/Rouge pour les CTA
- **Typographie** :
  - Titres : Police sans-serif moderne (ex: Inter, Roboto)
  - Texte : Police lisible (ex: Open Sans, Lato)
  - Taille minimum : 16px pour le corps de texte
- **Icônes** : Utiliser une bibliothèque cohérente (Font Awesome, Lucide)

### **Navigation**
```
HEADER (fixe en haut)
┣━ Logo (gauche) : "Enseigner avec l'IA"
┣━ Menu (centre) :
┃  ├─ Accueil
┃  ├─ Conversations
┃  ├─ Outils
┃  ├─ Formation
┃  └─ Veille
┗━ CTA (droite) : "Commander le livre"

FOOTER
┣━ Liens utiles
┣━ Contact
┣━ Mentions légales
┗━ © 2026 Fabien Boyer - Ellipses
```

---

## 🛠️ SPÉCIFICATIONS TECHNIQUES

### **Technologies recommandées**

**Option A : Site statique (SIMPLE et RAPIDE)** ⭐⭐⭐ **RECOMMANDÉ**
- **Générateur** : Astro, Next.js, ou 11ty
- **Hébergement** : Vercel, Netlify, ou GitHub Pages (gratuit)
- **CMS** : Markdown files (facile à éditer)
- **Déploiement** : Automatique via Git push

**Avantages** :
- ✅ Ultra-rapide (site statique)
- ✅ Gratuit ou quasi-gratuit
- ✅ Facile à mettre à jour (fichiers Markdown)
- ✅ Pas de base de données à gérer

**Option B : Site dynamique (si besoin de fonctionnalités avancées)**
- **Framework** : Next.js + React
- **Base de données** : Supabase ou Firebase
- **Hébergement** : Vercel ou Netlify
- **CMS** : Sanity ou Contentful

---

### **Structure des fichiers pour Antigravity**

```
site-compagnon/
├── README.md
├── package.json
├── public/
│   ├── images/
│   │   ├── couverture-livre.jpg
│   │   └── outils/
│   └── favicon.ico
├── src/
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   ├── conversations.astro   # Page conversations
│   │   ├── outils.astro          # Page outils
│   │   ├── formation.astro       # Page formation
│   │   ├── veille.astro          # Page veille
│   │   └── a-propos.astro        # Page à propos
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── OutilCard.astro       # Carte outil
│   │   └── ConversationCard.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── styles/
│   │   └── global.css
│   └── content/
│       ├── conversations/        # Fichiers Markdown
│       │   ├── conversation-01.md
│       │   ├── conversation-02.md
│       │   └── ...
│       ├── outils/                # Fichiers Markdown
│       │   ├── mindmaclasse.md
│       │   ├── fobizz.md
│       │   └── ...
│       └── veille/                # Fichiers Markdown
│           ├── 2026-02.md
│           ├── 2026-01.md
│           └── ...
└── astro.config.mjs
```

---

## 📝 PROMPT POUR ANTIGRAVITY

```
Crée un site web statique moderne et responsive pour accompagner un livre sur l'IA en éducation.

TECHNOLOGIE :
- Framework : Astro (site statique)
- Style : TailwindCSS
- Déploiement : Vercel

STRUCTURE :
5 pages principales :
1. Homepage (accueil) : Hero + 4 blocs (Conversations, Outils, Formation, Veille)
2. /conversations : Liste de conversations ChatGPT/Claude avec affichage en format chat
3. /outils : Liste d'outils IA avec filtres (gratuit, FR/EU, niveau)
4. /formation : Playlists vidéo YouTube (Micode, Monsieur Phi) + cours en ligne
5. /veille : Actualités IA + mises à jour mensuelles

DESIGN :
- Charte : Bleu professionnel + gris + orange pour CTA
- Typographie : Inter pour titres, Open Sans pour texte
- Responsive : mobile-first
- Navigation : Header fixe + Footer complet
- Accessibilité : WCAG 2.1 AA

CONTENU GÉRÉ EN MARKDOWN :
- Conversations : fichiers .md dans /src/content/conversations/
- Outils : fichiers .md dans /src/content/outils/
- Veille : fichiers .md dans /src/content/veille/

FONCTIONNALITÉS :
- Filtres sur page /outils (gratuit, FR/EU, niveau scolaire)
- Embed vidéos YouTube sur page /formation
- Bouton "Copier le prompt" sur chaque conversation
- Bouton CTA "Commander le livre" visible partout

HOMEPAGE HERO :
Titre : "Les outils pour enseigner avec l'IA"
Sous-titre : "Site compagnon du livre de Fabien Boyer (Ellipses, 2026)"
Bouton principal : "Découvrir les ressources"
Bouton secondaire : "Commander le livre"
Image : Couverture du livre (placeholder pour l'instant)

Génère le squelette complet du projet avec :
- Configuration Astro + TailwindCSS
- Les 5 pages avec structure HTML/CSS
- Exemples de fichiers Markdown pour conversations, outils, veille
- Components réutilisables (Header, Footer, OutilCard)
- README avec instructions de déploiement
```

---

## ✅ CHECKLIST DE LANCEMENT

### **Phase 1 : Squelette (Antigravity)** - 1-2 heures
- [ ] Générer le squelette du projet avec Antigravity
- [ ] Tester en local (npm run dev)
- [ ] Vérifier la navigation entre les pages
- [ ] Vérifier le responsive (mobile, tablette, desktop)

### **Phase 2 : Contenu minimal** - 2-3 heures
- [ ] Ajouter 3-5 conversations dans /conversations
- [ ] Ajouter 5-10 outils dans /outils
- [ ] Ajouter playlists YouTube dans /formation
- [ ] Ajouter veille du mois en cours

### **Phase 3 : Design** - 1 heure
- [ ] Intégrer la couverture du livre
- [ ] Ajuster les couleurs (charte Ellipses)
- [ ] Tester l'accessibilité (contraste, taille texte)

### **Phase 4 : Déploiement** - 30 min
- [ ] Créer compte Vercel/Netlify
- [ ] Connecter le repo GitHub
- [ ] Configurer le domaine (ellipses.fr ou custom)
- [ ] Tester le site en production

### **Phase 5 : QR codes dans le livre** - 1 heure
- [ ] Générer les QR codes pour chaque conversation
- [ ] Générer le QR code pour la homepage
- [ ] Tester tous les QR codes

---

## 📅 PLANNING DE DÉPLOIEMENT

**Objectif** : Site en ligne en **3-5 jours**

| Jour | Tâche | Durée |
|------|-------|-------|
| J1 | Antigravity génère le squelette | 1-2h |
| J1 | Test local + navigation | 1h |
| J2 | Ajout contenu minimal (5 conversations, 10 outils) | 3h |
| J3 | Design + intégration couverture | 2h |
| J3 | Déploiement Vercel/Netlify | 1h |
| J4 | Tests + corrections bugs | 2h |
| J5 | Génération QR codes + tests | 1h |

**Total** : ~11-13 heures de travail réparties sur 5 jours

---

## 🚀 ÉVOLUTION FUTURE

### **V1 (MVP - Minimum Viable Product)** - Lancement livre
- Homepage
- 5-10 conversations
- 10 outils complémentaires
- Playlists vidéo
- Veille du mois

### **V2** - 1-2 mois après lancement
- +10 conversations
- +10 outils
- Section "Communauté" (témoignages enseignants)
- Newsletter mensuelle

### **V3** - 6 mois après lancement
- Recherche globale sur le site
- Filtres avancés sur outils
- Section "Prompts de la communauté"
- Forum ou commentaires

---

## 📊 MÉTRIQUES DE SUCCÈS

**Objectifs 3 mois après lancement** :
- 1000 visiteurs uniques/mois
- 500 téléchargements de conversations
- 10 témoignages d'enseignants
- Taux de rebond < 60%

**Outils de mesure** :
- Google Analytics ou Plausible (RGPD-friendly)
- Heatmap (Hotjar)
- Feedback utilisateur (Typeform)

---

## ✅ FIN DU CAHIER DES CHARGES

**Ce document contient tout ce dont Antigravity a besoin pour générer le site.**

**Prochaines étapes** :
1. Copier le prompt dans Antigravity
2. Générer le projet
3. Tester en local
4. Déployer sur Vercel/Netlify
5. Générer les QR codes

**Bonne chance ! 🚀**
