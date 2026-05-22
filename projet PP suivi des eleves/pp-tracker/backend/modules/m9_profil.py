"""
m9_profil.py — Profil & Parcours élève (M9)
Gestion des certifications, parcours éducatifs et documents (PAP/PPRE/PPS/ESS).
"""

from backend.db import get_connection

# ── Certifications ────────────────────────────────────────────────────────────

CERTIFICATIONS_TYPES = ["ASSR1", "ASSR2", "PIX", "PSC1", "ASNS", "PasseportEducFi"]
STATUTS_VALIDES = ["en_attente", "valide", "repechage"]


def get_certifications(eleve_id: int) -> list[dict]:
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM certifications WHERE eleve_id = ? ORDER BY type",
        (eleve_id,)
    ).fetchall()
    conn.close()
    existantes = {r["type"]: dict(r) for r in rows}
    # Retourne toutes les certifications possibles, même celles non encore saisies
    return [
        existantes.get(t, {
            "id": None, "eleve_id": eleve_id, "type": t,
            "statut": "en_attente", "date_obtention": None, "notes": None
        })
        for t in CERTIFICATIONS_TYPES
    ]


def upsert_certification(eleve_id: int, type_cert: str, statut: str,
                          date_obtention: str = None, notes: str = None):
    conn = get_connection()
    conn.execute("""
        INSERT INTO certifications (eleve_id, type, statut, date_obtention, notes, updated_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(eleve_id, type) DO UPDATE SET
            statut = excluded.statut,
            date_obtention = excluded.date_obtention,
            notes = excluded.notes,
            updated_at = datetime('now')
    """, (eleve_id, type_cert, statut, date_obtention, notes))
    conn.commit()
    conn.close()


# ── Parcours éducatifs ────────────────────────────────────────────────────────

PARCOURS_TYPES = [
    {"type": "EVARS",   "label": "EVARS",            "detail": "Éducation à la vie affective, relationnelle et sexuelle"},
    {"type": "Citoyen", "label": "Parcours Citoyen",  "detail": "Délégué, éco-délégué, CVC"},
    {"type": "Sante",   "label": "Parcours Santé",    "detail": "Actions harcèlement, sommeil, bien-être"},
    {"type": "PEAC",    "label": "Parcours PEAC",     "detail": "Sorties culturelles, théâtre, chorale"},
]


def get_parcours(eleve_id: int, annee: str = "2025-2026") -> list[dict]:
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM parcours_educatifs WHERE eleve_id = ? AND annee_scolaire = ?",
        (eleve_id, annee)
    ).fetchall()
    conn.close()
    existants = {r["type"]: dict(r) for r in rows}
    return [
        {
            **p,
            **(existants.get(p["type"], {
                "id": None, "participation": "", "valide": 0, "annee_scolaire": annee
            }))
        }
        for p in PARCOURS_TYPES
    ]


def upsert_parcours(eleve_id: int, type_p: str, participation: str,
                    valide: bool, annee: str = "2025-2026"):
    conn = get_connection()
    conn.execute("""
        INSERT INTO parcours_educatifs (eleve_id, type, annee_scolaire, participation, valide, updated_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(eleve_id, type, annee_scolaire) DO UPDATE SET
            participation = excluded.participation,
            valide = excluded.valide,
            updated_at = datetime('now')
    """, (eleve_id, type_p, annee, participation, int(valide)))
    conn.commit()
    conn.close()


# ── Documents élève ────────────────────────────────────────────────────────────

TYPES_DOCUMENTS = ["PAP", "PPRE", "PPS", "ESS", "Autre"]


def get_documents(eleve_id: int) -> list[dict]:
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM documents_eleve WHERE eleve_id = ? ORDER BY date_document DESC",
        (eleve_id,)
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def ajouter_document(eleve_id: int, type_document: str, titre: str,
                     date_document: str = None, preconisations: str = None,
                     chemin_fichier: str = None) -> int:
    conn = get_connection()
    cursor = conn.execute("""
        INSERT INTO documents_eleve (eleve_id, type_document, titre, date_document, preconisations, chemin_fichier)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (eleve_id, type_document, titre, date_document, preconisations, chemin_fichier))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def modifier_document(doc_id: int, preconisations: str = None, titre: str = None) -> bool:
    conn = get_connection()
    cursor = conn.execute("""
        UPDATE documents_eleve SET
            preconisations = COALESCE(?, preconisations),
            titre = COALESCE(?, titre)
        WHERE id = ?
    """, (preconisations, titre, doc_id))
    conn.commit()
    conn.close()
    return cursor.rowcount > 0


def supprimer_document(doc_id: int) -> bool:
    conn = get_connection()
    cursor = conn.execute("DELETE FROM documents_eleve WHERE id = ?", (doc_id,))
    conn.commit()
    conn.close()
    return cursor.rowcount > 0


def get_profil_complet(eleve_id: int) -> dict:
    """Retourne certifications + parcours + documents en un seul appel."""
    return {
        "certifications": get_certifications(eleve_id),
        "parcours":       get_parcours(eleve_id),
        "documents":      get_documents(eleve_id),
    }
