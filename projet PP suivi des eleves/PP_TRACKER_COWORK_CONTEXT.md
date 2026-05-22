# PP Tracker — Contexte projet pour Cowork

> **Document de référence à fournir en contexte à chaque session.**
> Mis à jour manuellement après chaque session complétée.

---

## Identité du projet

- **Nom** : PP Tracker
- **Développeur** : Fabien Boyer — professeur de mathématiques, formateur académique IA, Académie d'Amiens
- **Objectif** : Outil de suivi de classe pour professeur principal (PP), 100% local, RGPD-compliant. Sert aussi d'exemple concret dans un livre sur l'IA pour enseignants.
- **Statut** : Phase 1 quasi-complète — M8 (LLM local) intégré, packaging Tauri restant
- **Environnement cible** : Windows 11, HP OMEN (RTX 5070, 32 Go DDR5)

---

## Contraintes NON NÉGOCIABLES

1. **RGPD absolu** : données personnelles de mineurs — aucune donnée ne quitte la machine
2. **Zéro cloud** : pas de sync, pas de log externe, pas d'appel API tiers pour les données élèves
3. **Modulaire** : chaque module est indépendant — si une brique échoue, le reste tourne
4. **User-friendly** : pas de terminal visible pour l'utilisateur final (lanceurs .bat)
5. **Chiffrement** : champs nom/prenom chiffrés via Fernet (AES-128). SQLCipher abandonné (non dispo Windows sans VS Build Tools)

---

## Stack technique

| Couche | Techno |
|---|---|
| Interface | React + Vite (localhost:5173) |
| Backend | Python + FastAPI (localhost:8000) |
| Stockage | SQLite + chiffrement Fernet champ par champ |
| Acquisition A (nominal) | pronotepy 2.14.x (simulation active jusqu'à la rentrée) |
| Acquisition B (fallback) | Playwright headless Python (S7, non commencé) |
| Normalisation | backend/normalizer.py |
| Packaging | Tauri (.exe Windows) — S10, non commencé |
| LLM local | Ollama (localhost:11434) — DeepSeek R1, Qwen2.5VL, Mistral |
| Lanceurs | `Lancer PP Tracker.bat` / `Reset et Remplir la base.bat` |

---

## Architecture du flux de données

```
Pronote (HTTPS)
      ↓
[TRACK A] pronotepy  ──fallback auto──  [TRACK B] Playwright
      ↓                                        ↓
      └──────────── Normalisateur ─────────────┘
                         ↓
                  SQLite (chiffrement Fernet champ par champ)
                         ↓
              FastAPI (localhost:8000)
                         ↓
           React + Vite (localhost:5173)
                         ↓
              Tauri (.exe Windows)  [S10]
                         ↓  [phase 2 uniquement]
              Ollama (localhost:11434)
```

---

## Modules fonctionnels

| ID | Module | Source données | Phase | Statut |
|---|---|---|---|---|
| M1 | Synchronisation Pronote (dual track) | pronotepy / Playwright | 1 | ✅ (simulation) |
| M2 | Fiche élève + graphes d'évolution | SQLite | 1 | ✅ |
| M3 | Tableau de bord classe | SQLite | 1 | ✅ |
| M4 | Journal familles & contacts | Saisie manuelle | 1 | ⬜ (schéma OK, UI manquante) |
| M5 | Dispositifs (PAP/PPS/PPRE/ESS) → fusionné dans M9 | Saisie manuelle | 1 | 🔄 Révisé |
| M6 | Rapport hebdomadaire automatique | SQLite (tous modules) | 1 | ⬜ |
| M7 | Préparation conseil de classe | SQLite | 1 | ✅ |
| M8a | Lecture de bulletins scannés via OCR (Qwen2.5VL) | Ollama + image/PDF | 2 | ✅ |
| M8b | Génération de synthèses PP et appréciations (DeepSeek R1 + Mistral) | SQLite + Ollama | 2 | ✅ |
| M9 | **Profil & Parcours** (nouveau — fusion M5 étendu) | Saisie manuelle | 1 | ⬜ |
| M10 | **Plan de classe interactif** (drag-and-drop) | SQLite | 1 | ⬜ |
| M11 | **Module Orientation** (4e/3e) | Saisie manuelle | 1 | ⬜ |
| M12 | **Sauvegarde automatisée externe** (USB/réseau) | APScheduler | 1 | ⬜ |

---

## Détail M9 — Profil & Parcours (nouveau grand onglet)

Fusion et extension de M5. Remplace l'onglet Dispositifs par un onglet complet sur la fiche élève.

### Certifications et attestations obligatoires
Indicateurs binaires (Validé / En attente / Repêchage) :
- **ASSR 1** (5e) — Attestation Sécurité Routière niveau 1
- **ASSR 2** (3e) — Attestation Sécurité Routière niveau 2
- **PIX** (3e) — profil certifiable + score final
- **PSC1** — Premiers secours
- **Passeport ÉducFi** (4e) — Éducation financière
- **ASNS** (6e) — Attestation du savoir nager en sécurité

### Dispositifs d'accompagnement (ex-M5)
- PAP, PPS, PPRE, ESS — avec dates et détails

### Parcours éducatifs transversaux
- **EVARS** — 3 séances annuelles obligatoires (présence/date)
- **Parcours Citoyen** — délégué, éco-délégué, CVC
- **Parcours Santé** — actions harcèlement, sommeil
- **Parcours PEAC** — sorties culturelles, théâtre, chorale

### Affichage
- Badges colorés qui s'allument à la validation
- Barres de progression par parcours
- Données exploitées par M7 (conseil de classe) pour bilan administratif complet

---

## Détail M10 — Plan de classe interactif

- Grille virtuelle drag-and-drop (React + dnd-kit ou react-beautiful-dnd)
- Import automatique des élèves depuis la base (pas de double saisie)
- Support groupes / demi-classes
- Persistance en base SQLite

---

## Détail M11 — Module Orientation (4e / 3e)

Suivi chronologique et administratif :
- **Entretiens d'orientation** : historique RDV, présence famille, compte-rendu projet élève
- **Stage d'observation (3e)** : convention reçue/signée, rapport rendu, note soutenance
- **Vœux d'affectation** : provisoires (T2), avis conseil, définitifs (T3)
- **Démarches** : mini-stages lycée pro, salons/portes ouvertes

---

## Détail M12 — Sauvegarde automatisée externe

- Tâche APScheduler (déjà en place) — copie périodique du fichier SQLite chiffré
- Destination configurable : clé USB, dossier réseau local
- Le fichier restant chiffré (Fernet), la conformité RGPD est maintenue
- Configuration via `.env` : `BACKUP_PATH=` et `BACKUP_INTERVAL_HOURS=`

---

## Feuille de route — Sessions de développement

| Session | Contenu | Statut |
|---|---|---|
| S1 | Installation environnement (Python, Node, Vite, dépendances) | ✅ |
| S2 | Structure projet + FastAPI squelette + SQLite | ✅ |
| S3 | M2 interface React — données fictives + graphes recharts | ✅ |
| S4 | M2 fiche élève complète (absences, appréciations, score) | ✅ |
| S5 | M1 pronotepy — connexion, récupération, normalisateur | ✅ (simulation) |
| S6 | M1 scheduler APScheduler + logs | ✅ |
| S7 | M1 fallback Playwright | ⬜ (attente credentials Pronote directs) |
| S8 | Chiffrement Fernet (SQLCipher non dispo Windows) | ✅ |
| S9 | Intégration M1→M2 — données réelles dans les graphes | ⬜ (attente rentrée) |
| S10 | Packaging Tauri .exe + icône barre des tâches | ⬜ (nécessite Rust) |
| S11 | M9 — Profil & Parcours (certifications + parcours + dispositifs) | ⬜ |
| S12 | M10 — Plan de classe drag-and-drop | ⬜ |
| S13 | M11 — Module Orientation 4e/3e | ⬜ |
| S14 | M12 — Sauvegarde automatisée externe | ⬜ |
| S15 | M4 — Journal familles UI complète | ⬜ |
| S16 | M6 — Rapport hebdomadaire automatique | ⬜ |

> **Mettre à jour les statuts** : ⬜ À faire · 🔄 En cours · ✅ Terminé · ❌ Bloqué

---

## Structure du dossier projet

```
pp-tracker/
├── requirements.txt
├── Lancer PP Tracker.bat          ← double-clic pour démarrer
├── Reset et Remplir la base.bat   ← reset complet + seed
├── Arrêter PP Tracker.bat
│
├── backend/
│   ├── main.py                    ← FastAPI v0.8.0
│   ├── scheduler.py               ← APScheduler
│   ├── db.py                      ← SQLite
│   ├── crypto.py                  ← Fernet (sans DPAPI)
│   ├── normalizer.py
│   ├── seed.py                    ← données fictives (chiffrées)
│   ├── reset_db.py                ← reset clé + base + seed
│   ├── migration_chiffrement.py
│   ├── acquisition/
│   │   ├── track_a.py             ← pronotepy / simulation
│   │   └── track_b.py             ← Playwright (non implémenté)
│   └── modules/
│       ├── m2_eleve.py
│       ├── m3_dashboard.py
│       ├── m4_familles.py
│       ├── m5_dispositifs.py
│       ├── m6_rapport.py
│       ├── m7_conseil.py
│       ├── m8a_ocr.py             ← Qwen2.5VL via Ollama
│       └── m8b_synthese.py        ← DeepSeek R1 / Mistral via Ollama
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ClassePage.jsx
│   │   │   ├── FicheElevePage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ConseilPage.jsx    ← bouton ✨ Générer Ollama
│   │   │   └── OcrPage.jsx        ← upload bulletin scanné
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── data/                          ← JAMAIS versionné
├── keys/                          ← JAMAIS versionné (clé Fernet)
└── .env.example
```

---

## Points de vigilance techniques

- **Chiffrement** : Fernet sans DPAPI (DPAPI causait des clés différentes selon contexte d'exécution). Clé dans `keys/pptracker.key`. En cas de problème → lancer `Reset et Remplir la base.bat`.
- **python-multipart** : obligatoire pour l'upload M8a (UploadFile FastAPI). Inclus dans `requirements.txt`.
- **pronotepy** : simulation active (`PRONOTE_SIMULATION=true`). Credentials directs à obtenir à la rentrée. Données vie scolaire (CPE) inaccessibles via compte enseignant.
- **Ollama** : démarre automatiquement en arrière-plan sur Windows. Si le sélecteur de modèle n'apparaît pas → vérifier `http://localhost:11434`.
- **Tauri** : nécessite Rust (~1.5 Go). S10 dédiée.
- **dechiffrer() dans tous les modules** : m3_dashboard.py et m7_conseil.py doivent importer `dechiffrer` de `backend.crypto` — piège classique lors de l'ajout de nouveaux modules.

---

## Interlocuteurs IA du projet

| Rôle | Outil |
|---|---|
| Architecture, décisions techniques, code complexe, debugging | Claude (Cowork) |
| Exécution dans les fichiers, application des patches | Google Antigravity |

**Règle d'or** : toute décision d'architecture ou de choix technique revient à Claude. Antigravity exécute, il ne décide pas.

---

## Glossaire métier

- **PP** : Professeur Principal
- **PAP** : Plan d'Accompagnement Personnalisé
- **PPS** : Projet Personnalisé de Scolarisation
- **PPRE** : Programme Personnalisé de Réussite Éducative
- **ESS** : Équipe de Suivi de Scolarisation
- **ASSR** : Attestation Scolaire de Sécurité Routière
- **PIX** : Certification numérique nationale
- **PSC1** : Prévention et Secours Civiques niveau 1
- **ASNS** : Attestation du Savoir Nager en Sécurité
- **EVARS** : Éducation à la Vie Affective, Relationnelle et Sexuelle
- **PEAC** : Parcours d'Éducation Artistique et Culturelle
- **Conseil de classe** : réunion trimestrielle de l'équipe pédagogique
- **Vie scolaire** : service gérant absences, retards, incidents (CPE)

---

*Dernière mise à jour : 2026-05-22 — S1→S6 + S8 + M2 + M3 + M7 + M8a + M8b terminés*
*Prochaine étape prioritaire : S10 (Tauri) ou S11 (M9 Profil & Parcours)*
