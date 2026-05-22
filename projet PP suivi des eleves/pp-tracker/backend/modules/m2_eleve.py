"""
m2_eleve.py — Requêtes SQLite pour le module Fiche Élève (M2)
Les champs nom/prenom sont déchiffrés automatiquement à la lecture.
"""

from backend.db import get_connection
from backend.crypto import dechiffrer, chiffrer, hash_identite


def _dec(row: dict) -> dict:
    """Déchiffre nom et prenom d'un dict élève."""
    row["nom"]    = dechiffrer(row["nom"])
    row["prenom"] = dechiffrer(row["prenom"])
    return row


def get_tous_les_eleves():
    conn = get_connection()
    rows = conn.execute("""
        SELECT
            e.id, e.nom, e.prenom, e.classe,
            COUNT(a.id) AS nb_absences
        FROM eleves e
        LEFT JOIN absences a ON a.eleve_id = e.id
        GROUP BY e.id
        ORDER BY e.nom, e.prenom
    """).fetchall()
    conn.close()
    return [_dec(dict(r)) for r in rows]


def get_eleve(eleve_id: int):
    conn = get_connection()

    eleve = conn.execute(
        "SELECT * FROM eleves WHERE id = ?", (eleve_id,)
    ).fetchone()

    if not eleve:
        conn.close()
        return None

    absences = conn.execute(
        "SELECT * FROM absences WHERE eleve_id = ? ORDER BY date_debut DESC",
        (eleve_id,)
    ).fetchall()

    appreciations = conn.execute(
        "SELECT * FROM appreciations WHERE eleve_id = ? ORDER BY periode, matiere",
        (eleve_id,)
    ).fetchall()

    dispositifs = conn.execute(
        "SELECT * FROM dispositifs WHERE eleve_id = ?",
        (eleve_id,)
    ).fetchall()

    contacts = conn.execute(
        "SELECT * FROM contacts_familles WHERE eleve_id = ? ORDER BY date_contact DESC",
        (eleve_id,)
    ).fetchall()

    conn.close()

    eleve_dict = _dec(dict(eleve))
    return {
        **eleve_dict,
        "absences":     [dict(a) for a in absences],
        "appreciations":[dict(a) for a in appreciations],
        "dispositifs":  [dict(d) for d in dispositifs],
        "contacts":     [dict(c) for c in contacts],
    }


def calculer_score(eleve_id: int) -> dict:
    conn = get_connection()

    absences = conn.execute(
        "SELECT justifiee FROM absences WHERE eleve_id = ?", (eleve_id,)
    ).fetchall()

    appreciations = conn.execute(
        "SELECT note FROM appreciations WHERE eleve_id = ? AND note IS NOT NULL",
        (eleve_id,)
    ).fetchall()

    dispositifs = conn.execute(
        "SELECT id FROM dispositifs WHERE eleve_id = ?", (eleve_id,)
    ).fetchall()

    conn.close()

    nb_non_just = sum(1 for a in absences if not a["justifiee"])
    nb_just     = sum(1 for a in absences if a["justifiee"])
    pts_abs_nj  = min(nb_non_just * 5, 40)
    pts_abs_j   = min(nb_just * 2, 20)

    notes = [a["note"] for a in appreciations]
    if notes:
        moyenne = sum(notes) / len(notes)
        pts_moy = round((1 - moyenne / 20) * 30)
    else:
        pts_moy = 0

    pts_disp = 10 if dispositifs else 0
    score = min(pts_abs_nj + pts_abs_j + pts_moy + pts_disp, 100)

    if score < 30:   niveau = "ok"
    elif score < 60: niveau = "attention"
    else:            niveau = "alerte"

    return {
        "score": score,
        "niveau": niveau,
        "detail": {
            "absences_non_justifiees": nb_non_just,
            "absences_justifiees":     nb_just,
            "moyenne_generale":        round(sum(notes) / len(notes), 1) if notes else None,
            "dispositif_actif":        bool(dispositifs),
        }
    }


def ajouter_contact(eleve_id: int, date_contact: str, type_contact: str, contenu: str) -> int:
    conn = get_connection()
    cursor = conn.execute("""
        INSERT INTO contacts_familles (eleve_id, date_contact, type_contact, contenu)
        VALUES (?, ?, ?, ?)
    """, (eleve_id, date_contact, type_contact, contenu))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def ajouter_absence(eleve_id: int, date_debut: str, justifiee: bool, motif: str | None) -> int:
    conn = get_connection()
    cursor = conn.execute("""
        INSERT INTO absences (eleve_id, date_debut, justifiee, motif)
        VALUES (?, ?, ?, ?)
    """, (eleve_id, date_debut, int(justifiee), motif))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id
