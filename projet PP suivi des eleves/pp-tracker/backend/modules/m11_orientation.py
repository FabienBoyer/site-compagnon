"""
m11_orientation.py — Orientation scolaire (M11)

Suivi des entretiens d'orientation, vœux de spécialités/filière
et stages de découverte professionnelle pour les élèves de 2nde.

Tables : orientation (UNIQUE par élève), stages_decouverte (1→N par élève)
"""

import json
from backend.db import get_connection


# ── Orientation ──────────────────────────────────────────────────────────────

def get_orientation(eleve_id: int) -> dict:
    """Retourne la fiche orientation d'un élève (crée une entrée vide si absente)."""
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM orientation WHERE eleve_id = ?", (eleve_id,)
    ).fetchone()

    if not row:
        conn.close()
        return {
            "eleve_id": eleve_id,
            "date_entretien": None,
            "voie_envisagee": None,
            "specialites": [],
            "projet_pro": None,
            "notes_pp": None,
            "updated_at": None,
        }

    d = dict(row)
    d["specialites"] = json.loads(d.get("specialites") or "[]")
    conn.close()
    return d


def upsert_orientation(
    eleve_id: int,
    date_entretien: str | None,
    voie_envisagee: str | None,
    specialites: list,
    projet_pro: str | None,
    notes_pp: str | None,
) -> dict:
    """Crée ou met à jour la fiche orientation d'un élève."""
    conn = get_connection()
    conn.execute("""
        INSERT INTO orientation
            (eleve_id, date_entretien, voie_envisagee, specialites, projet_pro, notes_pp, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(eleve_id) DO UPDATE SET
            date_entretien = excluded.date_entretien,
            voie_envisagee = excluded.voie_envisagee,
            specialites    = excluded.specialites,
            projet_pro     = excluded.projet_pro,
            notes_pp       = excluded.notes_pp,
            updated_at     = datetime('now')
    """, (
        eleve_id,
        date_entretien,
        voie_envisagee,
        json.dumps(specialites or []),
        projet_pro,
        notes_pp,
    ))
    conn.commit()
    conn.close()
    return get_orientation(eleve_id)


# ── Vue synthétique (liste) ──────────────────────────────────────────────────

def lister_orientations() -> list:
    """
    Retourne pour chaque élève : id, nom, prenom (chiffrés),
    voie_envisagee, nb_specialites, date_entretien, nb_stages.
    Les champs nom/prenom sont retournés tels quels (déchiffrement côté m2).
    """
    from backend.modules.m2_eleve import get_tous_les_eleves
    from backend.crypto import dechiffrer

    conn = get_connection()
    orients = {
        r["eleve_id"]: dict(r)
        for r in conn.execute("SELECT * FROM orientation").fetchall()
    }
    stages_counts = {
        r["eleve_id"]: r["nb"]
        for r in conn.execute(
            "SELECT eleve_id, COUNT(*) as nb FROM stages_decouverte GROUP BY eleve_id"
        ).fetchall()
    }
    conn.close()

    eleves = get_tous_les_eleves()  # retourne déjà nom/prenom déchiffrés
    result = []
    for e in eleves:
        eid = e["id"]
        o = orients.get(eid, {})
        specialites = json.loads(o.get("specialites") or "[]")
        result.append({
            "eleve_id":       eid,
            "nom":            e["nom"],
            "prenom":         e["prenom"],
            "voie_envisagee": o.get("voie_envisagee"),
            "nb_specialites": len(specialites),
            "specialites":    specialites,
            "date_entretien": o.get("date_entretien"),
            "nb_stages":      stages_counts.get(eid, 0),
            "updated_at":     o.get("updated_at"),
        })
    return result


# ── Stages de découverte ─────────────────────────────────────────────────────

def lister_stages(eleve_id: int) -> list:
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM stages_decouverte WHERE eleve_id = ? ORDER BY date_debut DESC",
        (eleve_id,),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def ajouter_stage(
    eleve_id: int,
    date_debut: str | None,
    date_fin: str | None,
    entreprise: str | None,
    secteur: str | None,
    bilan: str | None,
) -> int:
    conn = get_connection()
    cursor = conn.execute("""
        INSERT INTO stages_decouverte
            (eleve_id, date_debut, date_fin, entreprise, secteur, bilan)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (eleve_id, date_debut, date_fin, entreprise, secteur, bilan))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def supprimer_stage(stage_id: int) -> bool:
    conn = get_connection()
    cursor = conn.execute(
        "DELETE FROM stages_decouverte WHERE id = ?", (stage_id,)
    )
    conn.commit()
    ok = cursor.rowcount > 0
    conn.close()
    return ok
