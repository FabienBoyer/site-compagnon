"""
track_a.py — Acquisition via pronotepy (Track A — nominal)

MODE SIMULATION : actif tant que PRONOTE_USERNAME n'est pas renseigné dans .env.
Dès que tu as tes credentials Pronote directs :
  1. Renseigne PRONOTE_URL, PRONOTE_USERNAME, PRONOTE_PASSWORD dans .env
  2. Mets PRONOTE_SIMULATION=false dans .env
  → Les vraies données Pronote seront récupérées automatiquement.

Notes sur le compte enseignant pronotepy :
  - Notes + appréciations de toutes les matières ✅
  - Liste des élèves de la classe ✅
  - Absences vie scolaire ❌ (gérées par CPE, non accessibles compte prof)
  - Bulletins trimestriels ✅
"""

import os
import random
from datetime import date, timedelta
from dotenv import load_dotenv

load_dotenv()

PRONOTE_URL      = os.getenv("PRONOTE_URL", "")
PRONOTE_USERNAME = os.getenv("PRONOTE_USERNAME", "")
PRONOTE_PASSWORD = os.getenv("PRONOTE_PASSWORD", "")
SIMULATION       = os.getenv("PRONOTE_SIMULATION", "true").lower() == "true"

# ── Données de simulation ────────────────────────────────────────────────────

ELEVES_FICTIFS = [
    ("Martin", "Lucas"), ("Bernard", "Emma"), ("Dubois", "Noah"),
    ("Thomas", "Léa"), ("Robert", "Mathis"), ("Richard", "Chloé"),
    ("Petit", "Ethan"), ("Durand", "Inès"), ("Leroy", "Tom"),
    ("Moreau", "Jade"), ("Simon", "Hugo"), ("Laurent", "Camille"),
    ("Lefebvre", "Louis"), ("Michel", "Manon"), ("Garcia", "Théo"),
    ("David", "Zoé"), ("Bertrand", "Antoine"), ("Roux", "Lucie"),
    ("Vincent", "Raphaël"), ("Fournier", "Clara"), ("Morel", "Alexis"),
    ("Girard", "Eva"), ("Andre", "Maxime"), ("Lefevre", "Anaïs"),
    ("Mercier", "Baptiste"),
]

MATIERES = [
    "Mathématiques", "Français", "Histoire-Géo", "Anglais",
    "SVT", "Physique-Chimie", "EPS", "Arts plastiques"
]

APPRES_POOL = [
    "Élève sérieux, bon travail.", "Des efforts à fournir.",
    "Très bons résultats, continue ainsi.", "Participation active en classe.",
    "Des lacunes à combler rapidement.", "Travail régulier et méthodique.",
    "Peut mieux faire avec plus de rigueur.", "Excellente progression.",
    "Manque de concentration.", "Résultats satisfaisants.",
]


def _simuler_donnees(periode: str) -> dict:
    """Génère des données simulées au format normalisé."""
    eleves = []
    for nom, prenom in ELEVES_FICTIFS:
        notes = []
        for matiere in MATIERES:
            note = round(random.uniform(4.0, 19.0), 1)
            notes.append({
                "matiere":      matiere,
                "note":         note,
                "appreciation": random.choice(APPRES_POOL),
                "periode":      periode,
            })

        # Quelques absences simulées
        absences = []
        for _ in range(random.randint(0, 4)):
            j = date.today() - timedelta(days=random.randint(5, 90))
            absences.append({
                "date_debut": j.isoformat(),
                "justifiee":  random.choice([True, False]),
                "motif":      random.choice(["Maladie", "RDV médical", None]),
            })

        eleves.append({
            "nom":      nom,
            "prenom":   prenom,
            "classe":   "2nde1",
            "notes":    notes,
            "absences": absences,
        })

    return {"eleves": eleves, "periode": periode, "source": "simulation"}


def _fetch_pronote(periode: str) -> dict:
    """
    Connexion réelle à Pronote via pronotepy.
    Activé quand PRONOTE_SIMULATION=false et credentials renseignés.
    """
    try:
        import pronotepy

        client = pronotepy.Client(
            PRONOTE_URL,
            username=PRONOTE_USERNAME,
            password=PRONOTE_PASSWORD,
        )

        if not client.logged_in:
            raise ConnectionError("Échec de connexion Pronote — vérifier les credentials.")

        # Récupérer la période active
        periodes = client.periods
        periode_obj = next(
            (p for p in periodes if p.name and periode.lower() in p.name.lower()),
            periodes[0] if periodes else None
        )
        if not periode_obj:
            raise ValueError(f"Période '{periode}' introuvable dans Pronote.")

        eleves_data = []

        # Récupérer les élèves via le carnet de notes
        for eleve_pronote in client.students:
            notes = []
            try:
                for grade in periode_obj.grades:
                    if str(grade.student) != str(eleve_pronote):
                        continue
                    notes.append({
                        "matiere":      str(grade.subject),
                        "note":         float(str(grade.grade).replace(",", ".")),
                        "appreciation": "",
                        "periode":      periode,
                    })
            except Exception:
                pass

            # Appréciations bulletin
            try:
                for appre in periode_obj.report_card(eleve_pronote):
                    notes_mat = [n for n in notes if n["matiere"] == str(appre.subject)]
                    if notes_mat:
                        notes_mat[0]["appreciation"] = str(appre.appreciation or "")
                    else:
                        notes.append({
                            "matiere":      str(appre.subject),
                            "note":         None,
                            "appreciation": str(appre.appreciation or ""),
                            "periode":      periode,
                        })
            except Exception:
                pass

            eleves_data.append({
                "nom":      str(eleve_pronote).split()[-1],
                "prenom":   " ".join(str(eleve_pronote).split()[:-1]),
                "classe":   "2nde1",
                "notes":    notes,
                "absences": [],  # absences vie scolaire non dispo compte prof
            })

        client.session.close()
        return {"eleves": eleves_data, "periode": periode, "source": "pronote"}

    except ImportError:
        raise ImportError("pronotepy n'est pas installé : pip install pronotepy")
    except Exception as e:
        raise RuntimeError(f"Erreur Pronote : {e}")


def fetch(periode: str = "T1") -> dict:
    """
    Point d'entrée principal. Utilise la simulation ou Pronote selon .env.
    Retourne un dict normalisé prêt pour normalizer.py.
    """
    if SIMULATION or not PRONOTE_USERNAME:
        print(f"[Track A] Mode simulation — période {periode}")
        return _simuler_donnees(periode)
    else:
        print(f"[Track A] Connexion Pronote réelle — période {periode}")
        return _fetch_pronote(periode)
