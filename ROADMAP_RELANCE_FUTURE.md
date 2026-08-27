# 🚀 Feuille de Route & Décisions Stratégiques pour la Relance
## À lire impérativement lors de la reprise du projet (Prévue pour Juillet / Août 2026)

Ce document consigne les **6 décisions majeures** prises par l'auteur pour guider les prochains développements et correctifs du site compagnon avant la parution officielle du livre aux Éditions Ellipses en **septembre 2026**.

---

## 📌 Les 6 Directives de Relance

### 1. 🧹 Purge et Curation de la Veille & des Bookmarks
* **Constat** : Le volume actuel de veille et de signets (bookmarks) est devenu trop important, ce qui surcharge l'interface et dilue l'information pertinente pour les enseignants.
* **Action à mener** : Effectuer un tri drastique. Ne conserver que les ressources de veille et signets à très forte valeur ajoutée pédagogique et éliminer le superflu.

### 2. 📅 Alignement Temporel et Cohérence des Dates
* **Constat** : Les titres et mentions temporelles actuels affichent « Février 2026 ». Or, le projet sera relancé en plein cœur de l'année (mai, juin, voire juillet/août 2026).
* **Action à mener** : Mettre à jour l'ensemble des dates de mise à jour, des titres de veille et des références temporelles dans le code HTML pour refléter la période réelle de relance et de finalisation.

### 3. 🛠️ Remplacement du RAG Local 1-Clic
* **Constat** : Le développement et la maintenance d'un script batch personnalisé de RAG local (`rag-local.html`) ne sont plus pertinents ni nécessaires depuis la démocratisation de solutions grand public standardisées et robustes.
* **Action à mener** : Abandonner le script d'installation interactif maison et orienter à la place les enseignants vers l'utilisation d'**AnythingLLM**, qui s'est imposé comme la référence absolue, simple et sécurisée pour le RAG local.

### 4. 🤖 Retrait ou Refonte du Chatbot Intégré (`chatbot.html`)
* **Constat** : Le chatbot expérimental basé sur Mistral (via l'iframe Hugging Face) n'apporte pas une expérience utilisateur satisfaisante. Les performances de Mistral pour ce cas d'usage précis (RAG sémantique sur le livre) sont en deçà des attentes, et l'iframe pose des soucis de cookies tiers.
* **Action à mener** : Supprimer l'assistant Mistral intégré ou ne le conserver **que** si un modèle alternatif hautement pertinent (type GPT-4o, Claude 3.5 Sonnet ou un LLM spécialisé éducation d'une précision irréprochable) peut être intégré de manière fluide. Privilégier l'orientation exclusive vers l'expérience **NotebookLM** de Google qui est bien plus performante.

### 5. 🎓 Expansion de la Rubrique « Le Vibe Professeur »
* **Constat** : La section valorisant la démarche d'enseignant « Maker » est un point fort du site qui suscite beaucoup d'intérêt. Elle ne doit pas se limiter aux initiatives de François Fatoux.
* **Action à mener** : Enrichir cette rubrique en y accueillant d'autres profils d'enseignants inspirants, de nouvelles applications pédagogiques sur-mesure et des retours d'expérience diversifiés.

### 6. 🎥 Tri et Curation des Vidéos de Formation (`formation.html`)
* **Constat** : La page de formation contient une accumulation de ressources vidéo qui mériterait d'être rationalisée.
* **Action à mener** : Faire du tri dans les sélections de vidéos (playlists YouTube, Micode, Monsieur Phi, etc.) pour ne garder que les contenus de formation les plus qualitatifs, synthétiques et directement utiles pour les enseignants débutants et intermédiaires.

---

> [!TIP]
> **Rappel de bon sens pour la reprise :** Gardez ce site compagnon simple, ultra-qualitatif et centré sur l'essentiel. Mieux vaut moins de ressources mais 100 % opérationnelles et percutantes pour accompagner le livre !
