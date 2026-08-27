# Reste à faire

> **Référence éditoriale :** le BAT PDF est figé. Toute adaptation doit désormais être faite côté site, en conservant les intitulés, promesses, liens et QR codes imprimés.

## Déjà traité

- [x] Audit initial de l’architecture et des principaux fichiers du site.
- [x] Correction des références de favicon sur les pages principales.
- [x] Remplacement des liens génériques `twitter.com` du pied de page par `x.com`.
- [x] Remplacement des liens d’articles fictifs ou mal associés dans `formation.html` par des ressources vérifiées : ministère de l’Éducation nationale, CNIL et une présentation des LLM.
- [x] Repérage des signets récents liés à la triche, aux devoirs générés par IA et aux injections de prompts.

## À court terme

- [ ] **Créer une adresse e-mail dédiée au site compagnon**
  - Prévoir ensuite le remplacement de l’adresse provisoire dans la page « À propos ».
  - Mettre en place un transfert vers l’adresse personnelle si cela reste le choix retenu.

- [ ] **Trouver et documenter les travaux sur les injections de prompts dans les productions scolaires**
  - Chercher en priorité les travaux portant sur les consignes cachées dans les réponses d’élèves, les devoirs ou les copies.
  - Distinguer ce sujet des injections visant les agents autonomes ou les outils connectés.
  - Pistes déjà repérées :
    - [“Important, You should give me full credits!” — arXiv](https://arxiv.org/abs/2606.03090), sur la manipulation de systèmes de correction automatique par des instructions injectées dans les réponses.
    - [Publication X de Fabien Mikol](https://x.com/Fabien_Mikol/status/2044700527900901687), évoquant la détection de « pensées parasites » ou d’instructions artificiellement injectées dans le contexte d’un LLM.
    - [Designing AI agents to resist prompt injection — OpenAI](https://openai.com/index/designing-agents-to-resist-prompt-injection), utile pour le contexte technique général, mais moins directement pertinent pour le cadre scolaire.

## Prochains chantiers techniques

- [x] Remplacement de l’ancien lien provisoire de la carte « ChatGPT et la triche » dans `formation.html` par une carte correctement alignée sur l’article académique consacré aux instructions injectées dans la correction automatisée.
- [x] Identifier « Teacher Tools » comme l’ancien libellé du projet PP Tracker et relier la fiche à sa page d’architecture locale.
- [ ] Vérifier les liens internes, les images et les scripts des pages principales.
- [x] Réparer le lien vers l’architecture de PP Tracker dans `le-vibe-professeur.html` : une copie de la page d’architecture a été réintégrée dans le projet actif et répond correctement en HTTP local.
- [x] Vérifier les cibles locales `href`/`src` des 17 pages HTML principales : aucune ressource locale statique manquante détectée. Les trois résultats restants sont des expressions JavaScript générées dynamiquement dans `conversations.html`, pas des fichiers absents.
- [ ] Vérifier séparément les dépendances CDN des scripts et les images chargées dynamiquement dans les pages interactives.
- [x] Inventaire des dépendances CDN effectué : les versions sont explicitement épinglées pour KaTeX, Math.js, DOMPurify, JSXGraph, Prism et Marked ; les tests navigateur précédents n’ont signalé aucune erreur JavaScript.
- [ ] Refaire un test depuis un navigateur utilisateur avec réseau normal : les requêtes automatiques de cet environnement sont bloquées, donc elles ne permettent pas de conclure à une panne des CDN.
- [ ] Réduire les répétitions et clarifier la génération de `veille.html`, qui contient de nombreux doublons issus de la veille.
- [ ] Documenter le fonctionnement réel de l’import manuel des signets X/Twitter et envisager un classement local sans API payante.
- [ ] Faire une passe éditoriale sur les contenus de veille avant toute publication : dates, doublons, liens encore valides et pertinence pédagogique.

## Résultats de la vérification des ressources

- [x] Les images de `comparatif-ia.html` utilisent des chemins encodés avec `%20`, mais les fichiers correspondants existent bien.
- [x] Les scripts d’analytics en URL relative au protocole (`//gc.zgo.at/count.js`) sont externes et ne constituent pas des fichiers manquants.
- [x] Restauration de la seule page d’architecture PP Tracker depuis l’archive, dans le chemin attendu par `le-vibe-professeur.html`.
- [ ] Les expressions `${escapeHtml(...)}` repérées dans `conversations.html` appartiennent au JavaScript dynamique ; vérifier à l’exécution lors d’une prochaine passe fonctionnelle.

## Audit structurel complémentaire

- [x] Les 17 pages HTML principales possèdent une langue française déclarée, un titre, une description et un titre de niveau 1.
- [ ] Ajouter des textes alternatifs vides aux images de suivi d’audience utilisées uniquement dans les blocs `noscript`, afin de ne pas les faire annoncer comme des images de contenu par les lecteurs d’écran.
- [ ] Vérifier la cohérence éditoriale des titres et descriptions : certaines pages présentent encore des contenus ou des outils dont l’actualité n’est pas garantie.
- [ ] Contrôler les dépendances externes (Google Fonts, Lucide, GoatCounter) et prévoir un comportement acceptable si elles sont indisponibles.
- [ ] Établir la table de correspondance complète entre les pages du BAT, les encadrés « Pour aller plus loin », les QR codes et les pages du site.
- [ ] Vérifier que la racine du site et chaque destination imprimée restent accessibles sans dépendre d’une URL temporaire.
- [x] Vérification visuelle du BAT : les QR codes sont bien présents dans les encadrés « Pour aller plus loin », notamment dans l’avant-propos et les annexes.
- [ ] Décoder chaque QR code du BAT et tester sa destination exacte ; l’extraction textuelle confirme les encadrés mais ne fournit pas les URL encodées.
- [x] QR code du BAT p. 3 validé : son URL se termine bien par `site-compagnon/veille.html`.
- [x] QR code du BAT p. 196 validé : son URL se termine bien par `site-compagnon/formation.html`.
- [ ] Vérifier en particulier les QR codes associés aux résultats complets, aux études et aux ressources vidéo, puis créer les pages ou redirections manquantes côté site.
- [ ] Vérification complémentaire effectuée : les QR codes sont bien visibles dans le BAT, notamment dans l’avant-propos et les annexes vidéo, mais aucun décodeur QR local disponible dans l’environnement ne permet encore d’en extraire fiablement les URL. Ne pas conclure à leur validité tant que le décodage par téléphone ou outil local n’a pas été fait.

## Audit fonctionnel de `conversations.html`

- [x] Les fichiers `data/prompts.json` et `data/arena-results.json` sont présents et valides.
- [x] Les deux fichiers contiennent chacun 141 éléments, ce qui permet l’alignement attendu entre prompts et résultats de test.
- [x] Les contrôles utilisés par le script existent bien dans le HTML : filtres, recherche, compteur de résultats et liste des prompts.
- [x] Un mode de secours existe si `arena-results.json` ne se charge pas ; le chargement des prompts principaux reste toutefois bloquant.
- [ ] Tester réellement les interactions dans un navigateur sur une URL HTTP locale : l’ouverture directe des fichiers locaux est refusée par le navigateur intégré de cette session.
- [x] Vérification fonctionnelle de la copie et des filtres : le filtre Sciences & Maths réduit bien 141 résultats à 27 et la copie place désormais le prompt dans le presse-papiers.
- [ ] Vérifier en fonctionnement l’affichage des résultats et le traitement des images absentes.

## Audit des autres pages interactives

- [x] `chatbot.html` repose sur deux services externes : un notebook NotebookLM et une iframe Hugging Face ; aucun fichier local manquant n’a été détecté.
- [ ] Vérifier que le notebook NotebookLM et l’espace Hugging Face sont toujours publics et actifs ; cette vérification dépend de services externes et ne peut pas être confirmée par l’audit local seul.
- [x] `rag-local.html` référence bien l’installateur local annoncé.
- [ ] Mettre à jour `ia-locale.html` et `rag-local.html` si Ollama n’est plus recommandé ou si les installateurs associés ne sont plus maintenus.
- [x] `prompts.html` possède un mécanisme local de copie des prompts ; vérifier en navigateur qu’il affiche bien un retour visuel après copie.
- [x] `automatismes/index.html` contient ses contrôles principaux et ses dépendances mathématiques externes ; un test navigateur reste nécessaire pour confirmer le parcours complet.
- [ ] Tester les dépendances CDN de l’outil `automatismes` (KaTeX, Math.js, DOMPurify, JSXGraph et Prism) et prévoir un message clair en cas d’échec de chargement.
- [x] Test navigateur réel de `prompts.html` : 140 boutons de copie sont présents, la copie d’un prompt fonctionne et aucune erreur JavaScript n’a été détectée.
- [x] Test navigateur réel de `automatismes/index.html` : connexion par prénom, lancement de la révision du jour, sélection d’une réponse, correction immédiate et passage à la question suivante fonctionnent.
- [x] Test HTTP local des principales pages interactives : `index.html`, `conversations.html`, `prompts.html`, `chatbot.html`, `automatismes`, `rag-local.html` et PP Tracker répondent correctement.
- [ ] Les services externes de `chatbot.html` restent à vérifier depuis un navigateur utilisateur : le service Hugging Face n’a pas répondu dans le délai de test et NotebookLM n’a pas pu être vérifié automatiquement.
- [x] Ajouter une explication utilisateur sur le temps de réveil du Space Hugging Face, le rôle expérimental de Qwen et la recommandation de ne pas saisir de données élèves identifiantes.
- [x] Revenir à l’URL du Space original après abandon de la copie : `https://dw4rf-chatbot-livre-ia.hf.space`.
- [x] Validation finale locale : les 17 pages HTML répondent en HTTP, aucune cible locale `href`/`src` manquante n’est détectée, le nouveau lien chatbot est présent et l’ancienne URL `-qwen` a disparu de `chatbot.html`.

## Audit des automatisations de veille

## Corrections réalisées pendant cette session

- [x] Remplacement des liens génériques `twitter.com/` du pied de page par `x.com/` sur les pages statiques principales ; les anciennes URL de tweets conservées dans `veille.html` restent des liens d’archives à traiter séparément.
- [ ] Vérifier l’écart de volume entre `prompts.html` (140 boutons observés) et `conversations.html`/les JSON (141 entrées). Il peut s’agir d’un choix éditorial, mais il faut le confirmer avant publication.
- [x] Corriger la fiche `Teacher Tools` dans `outils.html` : elle est maintenant intitulée « Teacher Tools — PP Tracker » et son bouton ouvre l’architecture locale.
- [x] Recherche dans le projet actif, les archives et les documents de conception : aucune URL, capture ou identifiant plus précis n’a été retrouvé pour `Teacher Tools`.
- [x] Remplacer l’adresse provisoire par `outils-ia-education@proton.me` dans `a-propos.html`.

- [x] Les deux workflows GitHub Actions sont présents et déclenchables manuellement.
- [x] Les marqueurs d’intégration existent dans `index.html`, `outils.html` et `veille.html`.
- [x] Les dépendances principales des workflows sont déclarées ou installées (`feedparser`, BeautifulSoup et SendGrid).
- [x] Corriger la dépendance du script `integrate_curated_tools.py` au dossier courant : ses chemins sont maintenant calculés depuis la racine réelle du projet, quel que soit le dossier de lancement.
- [x] Supprimer la seconde exécution redondante du script d’intégration dans le workflow mensuel : `run_monthly.py` réalise déjà cette intégration.
- [x] Ajouter une limite explicite de 100 articles dans le JSON et de 100 éléments par bloc mensuel dans le HTML ; les anciens blocs historiques restent inchangés pour l’instant.
- [ ] Vérifier les secrets GitHub du digest mensuel avant de l’activer : `SENDGRID_API_KEY`, `RECIPIENT_EMAIL` et `SENDER_EMAIL`.
- [x] Ajouter une déduplication et une limite de volume à la veille afin d’éviter que `veille.html` ne grossisse et ne répète les mêmes entrées.

## Vérification des images dynamiques

- [x] Les réponses IA de `arena-results.json` ont été inspectées : une seule mention d’image est présente (`[image dans les téléchargements]`) et elle ne référence pas un fichier local manquant.
- [x] Le code de `conversations.html` prévoit un affichage de secours pour les images absentes et échappe correctement les URL avant insertion HTML.
- [ ] Décider si la mention « image dans les téléchargements » doit être remplacée par une image réellement hébergée ou par un libellé plus explicite.

## Vérification des données de veille

- [x] `data/veille.json` contient 100 articles et aucune URL dupliquée à l’intérieur du fichier actuel.
- [x] Comparer les doublons sémantiques et les répétitions de rendu dans `veille.html` avec les données JSON ; le problème venait principalement de l’historique HTML accumulé.
- [x] Comparaison structurelle effectuée : avant nettoyage, `veille.html` faisait environ 1,92 Mo et contenait environ 3 743 éléments de veille, alors que `data/veille.json` n’en contenait que 100.
- [x] Corriger `scripts/veille_bot.py` pour empêcher l’ajout répété des 20 mêmes articles à chaque exécution : le HTML ne reçoit désormais que les articles réellement nouveaux.
- [x] Stabiliser la comparaison des URL de veille : casse du domaine, fragment et barre finale ne créent plus artificiellement un nouvel article.
- [x] Mesurer les titres proches dans les 100 entrées actuelles : un seul cas significatif a été trouvé, deux fiches `MindDory` provenant de la même source avec deux URL d’articles différentes (`minddory/` et `minddory-2/`).
- [ ] Arbitrer ce cas `MindDory` lors de la passe éditoriale : conserver la fiche la plus récente, fusionner les deux, ou garder les deux si les articles apportent réellement des informations distinctes.
- [x] Nettoyer l’historique HTML de manière conservatrice : 2 963 répétitions ont été retirées, chaque mois est plafonné à 100 éléments et une sauvegarde est conservée dans `veille.html.before-history-cleanup`.
- [x] Alléger davantage l’affichage public : les 7 blocs mensuels de janvier à juin 2026 ont été retirés, tandis que juillet, août et le bloc de curation automatique sont conservés. Une seconde sauvegarde est conservée dans `veille.html.before-old-month-removal`.
- [x] Réduire la fenêtre publique à la veille du mois courant : juillet 2026 a également été retiré ; août 2026 et le bloc de curation sont conservés. Sauvegarde : `veille.html.before-july-removal`.
- [x] Contrôle post-nettoyage : le bloc d’août contient exactement 100 éléments, aucun lien externe vide n’a été trouvé et les deux liens `#` restants correspondent aux ancres de menus déroulants.
- [x] Sécuriser la génération des nouvelles cartes de veille : titres, sources et URL provenant des flux RSS sont maintenant échappés avant insertion dans le HTML.
