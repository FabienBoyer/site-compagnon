# Chaîne de veille — mode d'emploi

Remplace la collecte Nitter, arrêtée le 25 août 2026 après la mise en demeure
adressée par X au projet. Le filtre n'est plus une liste de mots-clés : c'est vous,
au moment où vous mettez un signet.

```
Signets X          ← le tri éditorial se fait ici
   │  veille-extension-v3            export JSON
   ▼
veille-inbox-AAAA-MM-JJ.json
   │  scripts/enrich_inbox.py        rédaction FR par Qwen3.5 en local
   ▼
data/veille-inbox.json
   │  tools/valider-veille.html      garder / jeter / corriger
   ▼  scripts/fusionner_veille.py    ajoute sans effacer les archives
data/veille.json                     publié
   │
   ▼  veille.html                    section « Fil de veille »
```

Rien n'atteint le site sans passer par l'étape de validation.

## 1. Installer l'extension

**Firefox** — `about:debugging` → « Ce Firefox » → « Charger un module temporaire »
→ désigner `veille-extension-v3/manifest.json`. (Temporaire : à recharger après
redémarrage. Pour une installation permanente il faut signer l'extension sur AMO.)

**Chrome** — `chrome://extensions` → mode développeur → « Charger l'extension non
empaquetée » → choisir le dossier.

## 2. Exporter les signets

Ouvrir `x.com/i/bookmarks`, cliquer l'icône de l'extension, éventuellement fixer une
date de début, puis « Exporter en JSON ». La page défile toute seule : ne pas changer
d'onglet pendant l'opération. Un fichier `veille-inbox-AAAA-MM-JJ.json` est téléchargé.

## 3. Enrichir en local

```bash
ollama serve                 # si ce n'est pas déjà lancé
python scripts/enrich_inbox.py ~/Téléchargements/veille-inbox-2026-09-11.json
```

Le script écarte ce qui est déjà publié et ce qui est déjà en attente, puis fait
rédiger pour chaque signet un titre court et un résumé de deux phrases en français,
avec une note de pertinence de 0 à 5. Les annonces commerciales sont notées 0.

Il propose aussi une **destination**, reprise de votre pratique dans
`ROADMAP_SIGNETS_TWITTER.md` : tous les signets n'ont pas vocation à finir dans le fil
d'actualité. Un outil à essayer va dans *Outils*, une lettre ÉduNum dans *Formation*,
un article RGPD dans *Éthique*, un usage disciplinaire dans *Disciplines*. Seul ce qui
est daté et périssable reste dans *Fil de veille*.

Options : `--model <nom>` (défaut `qwen3.5`), `--dry-run` pour ranger sans appeler le
modèle, `--rss` pour reprendre ce que `veille_bot.py` a déposé. Si Ollama ne répond
pas, les signets sont conservés bruts et signalés comme tels — rien n'est perdu.

## 4. Valider

Ouvrir `tools/valider-veille.html` dans un navigateur, y déposer
`data/veille-inbox.json`. « Pré-trier » coche d'office tout ce qui a une pertinence
≥ 3 ; il reste à relire, corriger les titres, résumés et destinations.

Trois exports, selon ce que vous en faites :

| Bouton | Contenu | Où le mettre |
|---|---|---|
| Exporter la sélection | ce qui est gardé **et** destiné au fil | à fusionner avec `data/veille.json` |
| Exporter à dispatcher | ce qui est gardé pour une autre rubrique, groupé par rubrique | à intégrer à la main dans `outils.html`, `formation.html`… |
| Exporter le reliquat | ce qui n'a pas été tranché | `data/veille-inbox.json`, pour la prochaine fois |

La page ne fait aucun appel réseau : tout reste sur le poste. Après l'export, ajoutez
la sélection à la veille existante plutôt que de remplacer celle-ci :

```bash
python scripts/fusionner_veille.py ~/Téléchargements/veille-selection.json
```

Le fil public affiche les trois derniers mois ; les entrées plus anciennes restent
consultables dans les archives de la page Veille.

## 5. Publier

Committer `data/veille.json`. La section « Fil de veille » de `veille.html` le lit au
chargement et propose un filtre par catégorie.

> À savoir : en ouvrant `veille.html` par double-clic depuis le disque, le fil reste
> vide — un navigateur refuse de lire un fichier JSON local depuis une page `file://`.
> Passer par `python -m http.server` dans le dossier, ou tester en ligne.

## Qui fait quoi, et où

La chaîne est coupée en deux volontairement, parce que le modèle local n'existe que
sur votre poste — un runner GitHub n'a ni Ollama ni GPU.

| Étape | Où | Quand | Besoin d'Ollama |
|---|---|---|---|
| Collecte RSS | GitHub Actions | tous les jours à 8h UTC | non |
| Export des signets | votre navigateur | quand vous voulez | non |
| Rédaction FR | votre poste | quand vous voulez | **oui** |
| Validation | votre poste | quand vous voulez | non |
| Publication | commit de `data/veille.json` | quand vous voulez | non |

Le workflow ne publie plus rien : il dépose dans `data/veille-inbox.json` et committe
ce seul fichier. Tant que vous ne faites pas l'étape de rédaction et de validation,
la boîte de réception grossit et le site ne bouge pas. C'est voulu.

## Prochains chantiers

### Actualiser les modèles locaux

Les recommandations de modèles locaux et de configuration matérielle doivent être
révisées à partir des signets récents, puis recoupées avec les fiches officielles
Hugging Face ou les dépôts des éditeurs. Ne publier que des modèles dont la licence,
la taille, les besoins mémoire et la disponibilité sont vérifiés ; les annonces X
servent de piste, pas de preuve finale.

### Automatiser la collecte hebdomadaire sous Windows

L'objectif est qu'une tâche planifiée ouvre Chrome avec le profil X déjà connecté,
lance l'exporteur de signets, puis dépose l'export dans la boîte de réception pour
enrichissement local. Cette automatisation doit rester une collecte : elle ne publie
jamais directement sur le site. Chaque lot passe par la validation éditoriale avant
d'alimenter le fil de veille ou les rubriques durables.

Cycle type :

```bash
git pull                                   # récupérer ce que le bot a collecté
ollama serve
python scripts/enrich_inbox.py --rss       # rédiger les articles RSS en attente
python scripts/enrich_inbox.py ~/Téléchargements/veille-inbox-*.json   # + les signets
# valider dans tools/valider-veille.html, puis fusionner veille-selection.json
python scripts/fusionner_veille.py ~/Téléchargements/veille-selection.json
git add data/veille.json data/veille-inbox.json && git commit && git push
```

**Si Ollama n'est pas lancé**, le script n'échoue pas : les entrées sont conservées
brutes et signalées en rouge dans la page de validation, où vous pouvez rédiger à la
main. Pour les articles de blog, c'est d'ailleurs souvent suffisant — leur résumé RSS
est déjà de la prose propre. Le modèle sert surtout aux signets, qui arrivent sans
titre, souvent en anglais, et en une seule phrase.

## Le bot RSS

`scripts/veille_bot.py` continue de suivre les cinq blogs qui fonctionnent
(Une IA par jour, Mathix, OpenAI, Google AI, le Padlet Perdir). Ses neuf flux Nitter
ont été retirés : ils échouaient silencieusement à chaque exécution.

Il ne publie plus directement : il dépose dans la boîte de réception, où ses articles
suivent le même chemin de validation que les signets. `--legacy` rétablit l'ancien
comportement, y compris la réécriture automatique du bandeau de date.
