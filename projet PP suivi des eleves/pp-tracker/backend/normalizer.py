"""
normalizer.py — Normalisation et import en base des données Pronote / simulation
Les noms/prénoms sont chiffrés avant insertion, le hash permet les correspondances.
"""

from backend.db import get_connection
from backend.crypto import chiffrer, hash_identite


def importer(data: dict) -> dict:
    conn = get_connection()
    cursor = conn.cursor()

    eleves_data = data.get("eleves", [])
    periode     = data.get("periode", "T1")
    source      = data.get("source", "inconnu")

    nb_eleves   = 0
    nb_notes    = 0
    nb_absences = 0

    for e in eleves_data:
        nom    = e["nom"]
        prenom = e["prenom"]
        h      = hash_identite(nom, prenom)

        # ── Upsert élève via hash ──────────────────────────────────────────
        existing = cursor.execute(
            "SELECT id FROM eleves WHERE nom_hash = ?", (h,)
        ).fetchone()

        if existing:
            eleve_id = existing["id"]
        else:
            nom_c    = chiffrer(nom)
            prenom_c = chiffrer(prenom)
            cursor.execute(
                "INSERT INTO eleves (nom, prenom, nom_hash, classe) VALUES (?, ?, ?, ?)",
                (nom_c, prenom_c, h, e.get("classe", "2nde1"))
            )
            eleve_id = cursor.lastrowid
            nb_eleves += 1

        # ── Upsert notes ──────────────────────────────────────────────────
        for note in e.get("notes", []):
            existing_note = cursor.execute("""
                SELECT id FROM appreciations
                WHERE eleve_id = ? AND matiere = ? AND periode = ?
            """, (eleve_id, note["matiere"], note["periode"])).fetchone()

            if existing_note:
                cursor.execute("""
                    UPDATE appreciations SET note = ?, appreciation = ?
                    WHERE id = ?
                """, (note.get("note"), note.get("appreciation", ""), existing_note["id"]))
            else:
                cursor.execute("""
                    INSERT INTO appreciations (eleve_id, matiere, periode, note, appreciation)
                    VALUES (?, ?, ?, ?, ?)
                """, (eleve_id, note["matiere"], note["periode"],
                      note.get("note"), note.get("appreciation", "")))
                nb_notes += 1

        # ── Absences ──────────────────────────────────────────────────────
        for abs_data in e.get("absences", []):
            existing_abs = cursor.execute("""
                SELECT id FROM absences WHERE eleve_id = ? AND date_debut = ?
            """, (eleve_id, abs_data["date_debut"])).fetchone()

            if not existing_abs:
                cursor.execute("""
                    INSERT INTO absences (eleve_id, date_debut, justifiee, motif)
                    VALUES (?, ?, ?, ?)
                """, (eleve_id, abs_data["date_debut"],
                      int(abs_data.get("justifiee", False)), abs_data.get("motif")))
                nb_absences += 1

    conn.commit()
    conn.close()

    return {
        "source":       source,
        "periode":      periode,
        "eleves_sync":  len(eleves_data),
        "eleves_new":   nb_eleves,
        "notes_new":    nb_notes,
        "absences_new": nb_absences,
    }
