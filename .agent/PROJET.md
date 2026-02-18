# PROJET : Site Compagnon — "Enseigner avec l'IA"
> Auteur : Fabien Boyer  
> Dépôt GitHub : https://github.com/FabienBoyer/site-compagnon  
> Site en ligne : https://fabienboyer.github.io/site-compagnon/  
> Dernière mise à jour de ce fichier : 2026-02-18

---

## 🎯 Contexte général

Ce site est le **site compagnon du livre "Les outils pour enseigner avec l'IA"** de Fabien Boyer.  
Il est destiné aux **enseignants** et propose :
- Des prompts pédagogiques issus du livre
- Des comparatifs de réponses IA (Arena)
- Une veille automatique sur l'IA éducative
- Des ressources par discipline et par outil
- Un chatbot RAG basé sur le contenu du livre

Le site est hébergé sur **GitHub Pages** (déploiement automatique à chaque push sur `main`).

---

## 📁 Structure du projet

```
site-compagnon/
├── index.html               # Page d'accueil
├── conversations.html       # Bibliothèque de prompts + réponses IA
├── veille.html              # Veille IA automatique (RSS + Twitter)
├── outils.html              # Outils IA recommandés
├── disciplines.html         # Ressources par discipline
├── formation.html           # Ressources de formation
├── ethique.html             # Cadre légal & éthique
├── debuter.html             # Débuter avec l'IA
├── lexique.html             # Lexique IA
├── comparatif-ia.html       # Comparatif IA images
├── chatbot.html             # Chatbot RAG
├── a-propos.html            # À propos
├── data/
│   ├── prompts.json         # Tous les prompts du livre
│   ├── arena-results.json   # Réponses IA aux prompts (comparatif)
│   ├── veille.json          # Articles de veille
│   └── images/              # Images jointes aux prompts ou réponses IA
├── styles/
│   ├── main.css             # Styles globaux
│   └── conversations.css    # Styles page conversations
├── scripts/
│   └── veille_bot.py        # Script Python de veille automatique
├── .github/workflows/
│   └── veille-update.yml    # GitHub Actions : veille auto (quotidienne)
└── tools/
    └── arena-collector.html # Outil de collecte des réponses IA
```

---

## ✅ Réalisations terminées

### Site web
- [x] Structure complète du site (toutes les pages HTML)
- [x] Navigation unifiée avec dropdowns sur toutes les pages
- [x] Footer avec compteur GoatCounter (privacy-friendly)
- [x] Mode sombre / clair
- [x] Design responsive mobile
- [x] Page `conversations.html` : bibliothèque de prompts avec filtres intelligents (Discipline auto-déduite), affichage des réponses IA en Markdown, support images
- [x] Page `veille.html` : veille mensuelle avec cartes filtrées par **scoring intelligent** (anti-spam, détection sujet)
- [x] Page `outils.html` : outils IA enrichis (Poe, ComparIA, Nolej, NotebookLM, etc.)
- [x] Page `disciplines.html` : ressources par discipline enrichies (Scénarios TraAM, Projets 1er degré, Lettres/Sciences...)
- [x] Page `formation.html` : ressources de formation (Kit IA, Jeu 7 familles, Café Péda, TraAM...)
- [x] Page `ethique.html` : cadre légal enrichi (Jurisprudence Sanction, Article Mathix RGPD, Projet AUDIT...)
- [x] Page `comparatif-ia.html` : comparatif IA images
- [x] Chatbot RAG (Hugging Face, Mistral-Nemo-Instruct-2407 + fallback Mistral-7B)

### Données
- [x] `prompts.json` : tous les prompts du livre structurés
- [x] `arena-results.json` : réponses IA collectées (Claude, GPT, Gemini, Grok, etc.)
- [x] `data/images/` : dossier créé pour les images des prompts/réponses
- [x] `script/veille_bot.py` : scoring intelligent et nettoyage rétroactif des contenus

### Automatisation
- [x] Migration Zapier → GitHub Actions (`veille-update.yml`)
- [x] `veille_bot.py` amélioré : BeautifulSoup, gestion mois, sans emojis (Windows-compatible)
- [x] Veille auto quotidienne via GitHub Actions

### Outils internes
- [x] `arena-collector.html` : outil de collecte des réponses IA (export JSON)
- [x] `scripts/update_nav.py` : mise à jour automatique de la navigation sur toutes les pages

---

## 🚧 En cours / Priorités

### 1. Finalisation Intégration Signets Twitter
- Roadmap : `ROADMAP_SIGNETS_TWITTER.md`
- **État** : Majorité des ressources intégrées (Outils, Disciplines, Éthique).
- **Reste à faire** : Quelques ressources mineures (Infographie SOPHIAE, Kit IA 1er degré).

### 2. Images dans les conversations
- Support ajouté dans `conversations.html` pour :
  - Champ `image` dans le JSON (image jointe au prompt)
  - Réponse image via chemin `data/images/xxx.png`
  - Placeholder si image manquante (`[image...]`)
- **À faire** : ajouter les images manquantes dans `data/images/` et mettre à jour `arena-results.json`
- Convention de nommage : `[id]_input.png`, `[id]_outputA_[modele].png`, `[id]_outputB_[modele].png`

### 3. Enrichissement arena-results.json
- Continuer à collecter des réponses IA via `arena-collector.html`
- Ajouter les images générées par les modèles (Hunyuan, DALL-E, etc.)

---

## 📋 Conventions et règles du projet

### Git
- Branche principale : `main`
- Push direct sur `main` (pas de PR)
- Messages de commit en français
- Workflow `/push-site-compagnon` disponible pour commit + push

### JSON (arena-results.json)
```json
{
  "id": "p001",
  "title": "Titre du prompt",
  "part": "Méthodes Transversales",
  "chapter": "Nom du chapitre",
  "subject": "Matière ou thème",
  "prompt": "Texte du prompt...",
  "image": "data/images/p001_input.png",  // optionnel
  "responses": {
    "modelA": "nom-du-modele-A",
    "outputA": "Réponse texte ou data/images/p001_outputA.png",
    "modelB": "nom-du-modele-B",
    "outputB": "Réponse texte ou data/images/p001_outputB.png"
  }
}
```

### Images
- Dossier : `data/images/`
- Nommage : `[id]_input.png` / `[id]_outputA_[modele].png` / `[id]_outputB_[modele].png`

### Veille
- Script : `scripts/veille_bot.py`
- Données : `data/veille.json`
- Page : `veille.html`
- Automatisation : `.github/workflows/veille-update.yml` (quotidien à 6h UTC)

### Style CSS
- Variables CSS dans `styles/main.css`
- CSS spécifique par page dans `styles/[page].css`
- Pas de Tailwind, CSS vanilla uniquement
- Design : dark mode, glassmorphism, Inter font

---

## 🔗 Liens utiles

- **Site en ligne** : https://fabienboyer.github.io/site-compagnon/
- **GitHub** : https://github.com/FabienBoyer/site-compagnon
- **Chatbot RAG** : https://huggingface.co/spaces/FabienBoyer/chatbot-livre-ia
- **Arena Collector** : https://fabienboyer.github.io/site-compagnon/tools/arena-collector.html

---

## 💡 Notes importantes pour les agents

1. **Toujours vérifier** `git status` avant de commiter
2. **Ne jamais modifier** `data/prompts.json` sans accord explicite (fichier source du livre)
3. **Le script `veille_bot.py`** doit rester sans emojis dans les `print()` (Windows incompatible)
4. **GitHub Pages** met 1-3 minutes à se déployer après un push
5. **Le chatbot RAG** est sur Hugging Face, pas dans ce dépôt
7. **RAPPEL SYSTÉMATIQUE** : Au début de chaque session, suggérer à l'utilisateur de consulter le dossier `.agent` (PROJET.md, ROADMAP_SIGNETS_TWITTER.md) pour suivre l'avancement.
