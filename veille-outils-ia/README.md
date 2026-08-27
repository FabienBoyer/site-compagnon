# 🤖 Agent de Veille Outils IA

Système automatisé de curation d'outils IA pour formateurs et enseignants.

## 🎯 Fonctionnement

```
📧 Newsletters IA → Gmail → Zapier → GitHub → Analyse → Email récap mensuel
```

**Chaque 1er du mois**, le système :
1. Analyse les newsletters stockées dans `newsletters/`
2. Filtre les outils pertinents pour l'éducation
3. Envoie un récapitulatif par email

## 📁 Structure

```
veille-outils-ia/
├── .github/workflows/    # Automatisation GitHub Actions
├── newsletters/          # Newsletters (via Zapier)
├── output/               # Digests générés
├── scripts/
│   ├── analyze_newsletters.py  # Analyse et scoring
│   ├── send_email.py           # Envoi via SendGrid
│   └── config.py               # Configuration
├── run_monthly.py        # Point d'entrée
└── requirements.txt
```

## ⚙️ Configuration initiale

### 1. SendGrid (envoi d'emails)

1. Créez un compte gratuit sur [sendgrid.com](https://sendgrid.com)
2. Allez dans **Settings > API Keys**
3. Créez une clé avec les permissions "Mail Send"
4. Copiez la clé (elle ne sera plus visible après)

### 2. GitHub Secrets

Dans votre repository GitHub :
1. **Settings > Secrets and variables > Actions**
2. Ajoutez ces secrets :

| Nom | Valeur |
|-----|--------|
| `SENDGRID_API_KEY` | Votre clé API SendGrid |
| `RECIPIENT_EMAIL` | <votre-adresse-de-reception> |

### 3. Zapier (connexion Gmail → GitHub)

1. Créez un compte sur [zapier.com](https://zapier.com)
2. Créez un nouveau Zap :
   - **Trigger** : Gmail → New Email Matching Search
   - **Search** : `from:(bensbites OR theresanaiforthat OR futurepedia)`
   - **Action** : GitHub → Create File
   - **Repository** : veille-outils-ia
   - **File Path** : `newsletters/{{date}}-{{subject}}.md`
   - **Content** : `{{body_plain}}`

## 🚀 Exécution manuelle

Pour tester sans attendre le 1er du mois :

1. Dans GitHub, allez dans **Actions**
2. Sélectionnez "Monthly AI Tools Digest"
3. Cliquez sur **Run workflow**

## 📊 Critères de scoring

Les outils sont notés selon :

| Catégorie | Points | Exemples de mots-clés |
|-----------|--------|----------------------|
| Éducation | +10/mot | teacher, learning, quiz, formation |
| IA | +5/mot | GPT, chatbot, generate, AI |
| Gratuit | +8/mot | free, freemium, open source |
| Exclusion | -50 | crypto, NFT, gambling |

**Seuil minimum** : 15 points

## 📧 Format du récap

Chaque mois, vous recevez :
- Top 10 des outils les plus pertinents
- Description et lien pour chacun
- Tags indiquant pourquoi l'outil a été sélectionné
- Statistiques du mois

## 🔧 Personnalisation

Modifiez `scripts/config.py` pour :
- Ajouter des mots-clés de filtrage
- Changer le seuil de score
- Modifier le nombre max d'outils
- Personnaliser le template d'email

---

*Système créé pour le projet "Humaniser l'IA" - Février 2026*
