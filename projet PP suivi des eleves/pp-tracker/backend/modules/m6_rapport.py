"""
m6_rapport.py — Rapport hebdomadaire PP Tracker

Génère un rapport structuré de la semaine en cours :
  - Alertes PP (élèves score ≥ 30, niveaux attention/alerte)
  - Absences enregistrées cette semaine
  - Élèves sans contact famille depuis plus de 30 jours
  - Stats globales de la semaine
"""

from datetime import datetime, timedelta
from backend.db import get_connection
from backend.modules.m2_eleve import calculer_score
from backend.crypto import dechiffrer


def _debut_semaine() -> str:
    """Retourne le lundi de la semaine courante au format ISO."""
    today = datetime.today()
    lundi = today - timedelta(days=today.weekday())
    return lundi.strftime("%Y-%m-%d")


def _il_y_a(jours: int) -> str:
    return (datetime.today() - timedelta(days=jours)).strftime("%Y-%m-%d")


def get_rapport_hebdo() -> dict:
    conn = get_connection()
    debut_semaine = _debut_semaine()
    seuil_contact = _il_y_a(30)

    # ── Liste de tous les élèves ──────────────────────────────────────────────
    eleves = conn.execute(
        "SELECT id, nom, prenom FROM eleves ORDER BY nom, prenom"
    ).fetchall()

    # ── Absences de la semaine ────────────────────────────────────────────────
    absences_semaine = conn.execute("""
        SELECT a.id, a.eleve_id, a.date_debut, a.date_fin, a.justifiee, a.motif,
               e.nom, e.prenom
        FROM absences a
        JOIN eleves e ON e.id = a.eleve_id
        WHERE a.date_debut >= ?
        ORDER BY a.date_debut DESC
    """, (debut_semaine,)).fetchall()

    abs_liste = [
        {
            "eleve_id":   r["eleve_id"],
            "nom":        dechiffrer(r["nom"]),
            "prenom":     dechiffrer(r["prenom"]),
            "date_debut": r["date_debut"],
            "date_fin":   r["date_fin"],
            "justifiee":  bool(r["justifiee"]),
            "motif":      r["motif"] or "",
        }
        for r in absences_semaine
    ]

    # ── Dernier contact famille par élève ─────────────────────────────────────
    derniers_contacts = conn.execute("""
        SELECT eleve_id, MAX(date_contact) AS dernier
        FROM contacts_familles
        GROUP BY eleve_id
    """).fetchall()
    contact_par_eleve = {r["eleve_id"]: r["dernier"] for r in derniers_contacts}

    # ── Alertes PP + sans contact ─────────────────────────────────────────────
    alertes = []
    sans_contact = []

    for e in eleves:
        eid    = e["id"]
        nom    = dechiffrer(e["nom"])
        prenom = dechiffrer(e["prenom"])
        score_data = calculer_score(eid)
        dernier    = contact_par_eleve.get(eid)

        if score_data["niveau"] in ("attention", "alerte"):
            alertes.append({
                "eleve_id": eid,
                "nom":      nom,
                "prenom":   prenom,
                "score":    score_data["score"],
                "niveau":   score_data["niveau"],
                "detail":   score_data["detail"],
            })

        if dernier is None or dernier < seuil_contact:
            sans_contact.append({
                "eleve_id":           eid,
                "nom":                nom,
                "prenom":             prenom,
                "dernier_contact":    dernier,
                "jours_sans_contact": (
                    (datetime.today() - datetime.strptime(dernier, "%Y-%m-%d")).days
                    if dernier else None
                ),
            })

    alertes.sort(key=lambda x: x["score"], reverse=True)
    sans_contact.sort(key=lambda x: (x["dernier_contact"] or "0000-00-00"))

    # ── Stats globales semaine ────────────────────────────────────────────────
    nb_contacts_semaine = conn.execute(
        "SELECT COUNT(*) FROM contacts_familles WHERE date_contact >= ?",
        (debut_semaine,)
    ).fetchone()[0]

    nb_absences_non_just = sum(1 for a in abs_liste if not a["justifiee"])
    nb_eleves_touches    = len({a["eleve_id"] for a in abs_liste})

    notes_semaine = conn.execute("""
        SELECT COUNT(*) AS nb, AVG(note) AS moy
        FROM appreciations
        WHERE created_at >= ? AND note IS NOT NULL
    """, (debut_semaine,)).fetchone()

    conn.close()

    return {
        "genere_le":     datetime.now().strftime("%d/%m/%Y à %H:%M"),
        "semaine_debut": debut_semaine,
        "nb_eleves":     len(eleves),

        "stats": {
            "nb_absences_semaine":  len(abs_liste),
            "nb_absences_non_just": nb_absences_non_just,
            "nb_eleves_touches":    nb_eleves_touches,
            "nb_contacts_semaine":  nb_contacts_semaine,
            "nb_notes_semaine":     notes_semaine["nb"] or 0,
            "moy_notes_semaine":    round(notes_semaine["moy"], 1) if notes_semaine["moy"] else None,
        },

        "alertes":      alertes,
        "absences":     abs_liste,
        "sans_contact": sans_contact,
    }
