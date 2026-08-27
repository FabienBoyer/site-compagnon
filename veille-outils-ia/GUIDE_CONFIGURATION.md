# 📋 Guide de Configuration Pas-à-Pas

Ce guide vous accompagne pour configurer le système de veille automatisé.

**Temps estimé** : 15-20 minutes

---

## Étape 1 : Push du repository vers GitHub (5 min)

### Option A : Avec GitHub Desktop

1. Ouvrez **GitHub Desktop**
2. **File > Add Local Repository**
3. Sélectionnez le dossier `veille-outils-ia`
4. Si demandé, cliquez **Create Repository**
5. Publiez sur GitHub : **Repository > Push** ou **Publish repository**

### Option B : En ligne de commande

```bash
cd "c:\Users\boyoc\Desktop\HUMANISATION CLAUDE\veille-outils-ia"
git init
git add .
git commit -m "🚀 Initial commit - Agent de veille outils IA"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/veille-outils-ia.git
git push -u origin main
```

---

## Étape 2 : Créer un compte SendGrid (5 min)

1. Allez sur [https://signup.sendgrid.com/](https://signup.sendgrid.com/)

2. Créez un compte avec **<votre-adresse-d-envoi>**
   - Cela permet de valider l'expéditeur

3. Une fois connecté, allez dans :
   - **Settings** (menu de gauche)
   - **API Keys**
   - **Create API Key**

4. Configurez la clé :
   - **Name** : `veille-outils-ia`
   - **Permissions** : Restricted Access → Mail Send (Full Access)
   - Cliquez **Create & View**

5. **COPIEZ LA CLÉ** immédiatement (elle ne sera plus affichée)
   - Elle ressemble à : `SG.xxxxxxxxxxxxx.yyyyyyyyyyyyyyyy`

---

## Étape 3 : Configurer les secrets GitHub (2 min)

1. Allez sur votre repository GitHub : `https://github.com/VOTRE_USERNAME/veille-outils-ia`

2. Cliquez sur **Settings** (onglet)

3. Dans le menu de gauche : **Secrets and variables > Actions**

4. Cliquez **New repository secret**

5. Ajoutez le premier secret :
   - **Name** : `SENDGRID_API_KEY`
   - **Secret** : Collez votre clé API SendGrid
   - Cliquez **Add secret**

6. Ajoutez le deuxième secret :
   - **Name** : `RECIPIENT_EMAIL`
   - **Secret** : `<votre-adresse-de-reception>`
   - Cliquez **Add secret**

---

## Étape 4 : Créer le Zap Gmail → GitHub (10 min)

1. Allez sur [https://zapier.com/](https://zapier.com/)

2. Connectez-vous avec **<votre-adresse-d-envoi>**

3. Cliquez **Create Zap** (bouton orange)

### Configurer le Trigger (Gmail)

4. **App** : Cherchez et sélectionnez **Gmail**

5. **Event** : `New Email Matching Search`

6. **Account** : Connectez `<votre-adresse-d-envoi>`

7. **Search String** (IMPORTANT) :
   ```
   from:(newsletter@bensbites.com OR hello@theresanaiforthat.com OR newsletter@futurepedia.io OR newsletter@therundown.ai)
   ```

8. Cliquez **Continue**, puis **Test trigger**

### Configurer l'Action (GitHub)

9. Cliquez **+** pour ajouter une action

10. **App** : Cherchez **GitHub**

11. **Event** : `Create File`

12. **Account** : Connectez votre compte GitHub

13. **Configure** :
    - **Repository** : `veille-outils-ia`
    - **File Path** : `newsletters/{{zap_meta_human_now}}-newsletter.md`
    - **File Content** :
      ```
      # {{subject}}
      Date: {{date}}
      From: {{from__email}}
      
      ---
      
      {{body_plain}}
      ```
    - **Commit Message** : `📧 New newsletter: {{subject}}`

14. Cliquez **Continue**, puis **Test action**

15. Si le test réussit, cliquez **Publish Zap**

---

## Étape 5 : S'abonner aux newsletters (5 min)

Connectez-vous à **<votre-adresse-d-envoi>** et inscrivez-vous :

1. **Ben's Bites** : https://bensbites.beehive.io/
   - Entrez l'email, confirmez

2. **There's An AI For That** : https://theresanaiforthat.com/
   - Scroll en bas, entrez l'email

3. **Futurepedia** : https://www.futurepedia.io/
   - Scroll en bas, entrez l'email

4. **The Rundown AI** : https://www.therundown.ai/
   - Entrez l'email, confirmez

---

## Étape 6 : Test du système (2 min)

1. Allez sur GitHub : `https://github.com/VOTRE_USERNAME/veille-outils-ia`

2. Cliquez sur l'onglet **Actions**

3. Sélectionnez **Monthly AI Tools Digest** (à gauche)

4. Cliquez **Run workflow** → **Run workflow**

5. Attendez 1-2 minutes

6. Vérifiez votre boîte `<votre-adresse-de-reception>` ! 📧

---

## ✅ C'est terminé !

Le système est maintenant configuré. Chaque mois, le 1er à 9h :
- GitHub Actions analyse les newsletters
- Filtre les outils pertinents pour l'éducation
- Vous envoie un récap sur Orange

### En cas de problème

- **Email non reçu** : Vérifiez les spams, puis les logs dans GitHub Actions
- **Zap ne fonctionne pas** : Vérifiez que les newsletters arrivent bien sur Gmail
- **Erreur GitHub Actions** : Cliquez sur le workflow échoué pour voir les détails

---

*Guide créé le 1er février 2026*
