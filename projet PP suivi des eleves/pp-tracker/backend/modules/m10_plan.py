"""
m10_plan.py — Plan de classe interactif (M10)

Stocke des plans de placement dans la table plan_classe.
La grille est un JSON { "ligne-colonne": eleve_id } (ex: { "0-2": 14, "1-0": 3 }).
"""

import json
from backend.db import get_connection


def lister_plans() -> list:
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, nom, nb_lignes, nb_colonnes, updated_at FROM plan_classe ORDER BY id"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_plan(plan_id: int) -> dict | None:
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM plan_classe WHERE id = ?", (plan_id,)
    ).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d["grille"] = json.loads(d["grille"])
    return d


def creer_plan(nom: str, nb_lignes: int, nb_colonnes: int) -> dict:
    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO plan_classe (nom, nb_lignes, nb_colonnes, grille) VALUES (?, ?, ?, ?)",
        (nom, nb_lignes, nb_colonnes, "{}"),
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"id": new_id, "nom": nom, "nb_lignes": nb_lignes, "nb_colonnes": nb_colonnes, "grille": {}}


def sauver_plan(plan_id: int, nom: str, nb_lignes: int, nb_colonnes: int, grille: dict) -> dict:
    """Met à jour un plan existant (nom, dimensions, grille)."""
    # Nettoyer la grille : ne garder que les cases avec un élève assigné
    grille_propre = {k: v for k, v in grille.items() if v is not None}
    conn = get_connection()
    conn.execute("""
        UPDATE plan_classe
        SET nom = ?, nb_lignes = ?, nb_colonnes = ?, grille = ?, updated_at = datetime('now')
        WHERE id = ?
    """, (nom, nb_lignes, nb_colonnes, json.dumps(grille_propre), plan_id))
    conn.commit()
    conn.close()
    return {"id": plan_id, "nom": nom, "nb_lignes": nb_lignes, "nb_colonnes": nb_colonnes, "grille": grille_propre}


def supprimer_plan(plan_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM plan_classe WHERE id = ?", (plan_id,))
    conn.commit()
    conn.close()
