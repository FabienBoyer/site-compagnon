"""
m7_conseil.py — Préparation conseil de classe (M7)
"""

from backend.db import get_connection
from backend.crypto import dechiffrer
from backend.modules.m2_eleve import calculer_score


def init_synthese_pp(conn):
    """Crée la table synthese_pp si elle n'existe pas (appelé au startup)."""
    conn.execute("""
        CREATE TABLE IF NOT EXISTS synthese_pp (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            eleve_id        INTEGER NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
            periode         TEXT NOT NULL,
            appreciation_pp TEXT,
            mention         TEXT,
            updated_at      TEXT DEFAULT (datetime('now')),
            UNIQUE(eleve_id, periode)
        )
    """)
    conn.commit()


def get_conseil(periode: str) -> list:
    """
    Retourne pour une période donnée la liste de tous les élèves avec :
    - leur moyenne pour cette période
    - leur nombre d'absences
    - leurs dispositifs
    - leur appréciation PP et mention déjà saisies
    - leur score d'alerte
    """
    conn = get_connection()

    eleves = conn.execute(
        "SELECT id, nom, prenom, classe FROM eleves ORDER BY nom, prenom"
    ).fetchall()

    result = []
    for e in eleves:
        eleve_id = e["id"]

        # Moyenne pour la période
        notes = conn.execute("""
            SELECT AVG(note) AS moy FROM appreciations
            WHERE eleve_id = ? AND periode = ? AND note IS NOT NULL
        """, (eleve_id, periode)).fetchone()
        moy = round(notes["moy"], 1) if notes["moy"] else None

        # Absences
        nb_abs = conn.execute(
            "SELECT COUNT(*) FROM absences WHERE eleve_id = ?", (eleve_id,)
        ).fetchone()[0]
        nb_nj = conn.execute(
            "SELECT COUNT(*) FROM absences WHERE eleve_id = ? AND justifiee = 0", (eleve_id,)
        ).fetchone()[0]

        # Dispositifs
        dispositifs = conn.execute(
            "SELECT type FROM dispositifs WHERE eleve_id = ?", (eleve_id,)
        ).fetchall()
        disp_list = [d["type"] for d in dispositifs]

        # Synthèse PP existante
        synthese = conn.execute("""
            SELECT appreciation_pp, mention FROM synthese_pp
            WHERE eleve_id = ? AND periode = ?
        """, (eleve_id, periode)).fetchone()

        result.append({
            "id":             eleve_id,
            "nom":            dechiffrer(e["nom"]),
            "prenom":         dechiffrer(e["prenom"]),
            "moyenne":        moy,
            "nb_absences":    nb_abs,
            "nb_non_just":    nb_nj,
            "dispositifs":    disp_list,
            "score":          calculer_score(eleve_id)["score"],
            "niveau":         calculer_score(eleve_id)["niveau"],
            "appreciation_pp": synthese["appreciation_pp"] if synthese else "",
            "mention":         synthese["mention"] if synthese else "",
        })

    conn.close()
    return result


def upsert_synthese(eleve_id: int, periode: str, appreciation_pp: str, mention: str):
    """Insère ou met à jour la synthèse PP d'un élève pour une période."""
    conn = get_connection()
    conn.execute("""
        INSERT INTO synthese_pp (eleve_id, periode, appreciation_pp, mention, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'))
        ON CONFLICT(eleve_id, periode) DO UPDATE SET
            appreciation_pp = excluded.appreciation_pp,
            mention         = excluded.mention,
            updated_at      = excluded.updated_at
    """, (eleve_id, periode, appreciation_pp, mention))
    conn.commit()
    conn.close()
