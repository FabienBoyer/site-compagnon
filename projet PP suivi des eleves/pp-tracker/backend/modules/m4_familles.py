"""
m4_familles.py — Journal des contacts familles (M4)
Vue globale chronologique de tous les contacts, tous élèves confondus.
"""

from backend.db import get_connection
from backend.crypto import dechiffrer


def get_tous_contacts(type_contact: str = None) -> list[dict]:
    """
    Retourne tous les contacts familles, triés par date décroissante.
    Optionnellement filtré par type_contact.
    """
    conn = get_connection()

    query = """
        SELECT
            cf.id,
            cf.eleve_id,
            e.nom,
            e.prenom,
            cf.date_contact,
            cf.type_contact,
            cf.contenu,
            cf.created_at
        FROM contacts_familles cf
        JOIN eleves e ON e.id = cf.eleve_id
    """
    params = []
    if type_contact:
        query += " WHERE cf.type_contact = ?"
        params.append(type_contact)

    query += " ORDER BY cf.date_contact DESC, cf.created_at DESC"

    rows = conn.execute(query, params).fetchall()
    conn.close()

    return [
        {
            **dict(r),
            "nom":    dechiffrer(r["nom"]),
            "prenom": dechiffrer(r["prenom"]),
        }
        for r in rows
    ]


def supprimer_contact(contact_id: int) -> bool:
    """Supprime un contact par son ID. Retourne True si supprimé."""
    conn = get_connection()
    cursor = conn.execute(
        "DELETE FROM contacts_familles WHERE id = ?", (contact_id,)
    )
    conn.commit()
    conn.close()
    return cursor.rowcount > 0
