"""
m3_dashboard.py — Stats agrégées pour le tableau de bord classe (M3)
"""

from backend.db import get_connection
from backend.modules.m2_eleve import calculer_score
from backend.crypto import dechiffrer


def get_dashboard() -> dict:
    conn = get_connection()

    # ── Élèves ───────────────────────────────────────────────────────────────
    eleves = conn.execute("SELECT id, nom, prenom FROM eleves").fetchall()
    nb_eleves = len(eleves)

    # ── Absences ─────────────────────────────────────────────────────────────
    abs_rows = conn.execute("SELECT justifiee FROM absences").fetchall()
    total_absences    = len(abs_rows)
    abs_non_just      = sum(1 for a in abs_rows if not a["justifiee"])
    moy_abs_eleve     = round(total_absences / nb_eleves, 1) if nb_eleves else 0

    # ── Moyennes par matière (toutes périodes confondues) ────────────────────
    notes_matiere = conn.execute("""
        SELECT matiere, AVG(note) AS moy
        FROM appreciations
        WHERE note IS NOT NULL
        GROUP BY matiere
        ORDER BY moy ASC
    """).fetchall()

    matieres_stats = [
        {"matiere": r["matiere"], "moyenne": round(r["moy"], 1)}
        for r in notes_matiere
    ]

    # ── Moyenne générale classe ───────────────────────────────────────────────
    moy_generale_row = conn.execute(
        "SELECT AVG(note) AS moy FROM appreciations WHERE note IS NOT NULL"
    ).fetchone()
    moy_generale = round(moy_generale_row["moy"], 1) if moy_generale_row["moy"] else None

    # ── Dispositifs ───────────────────────────────────────────────────────────
    nb_dispositifs = conn.execute(
        "SELECT COUNT(DISTINCT eleve_id) FROM dispositifs"
    ).fetchone()[0]

    conn.close()

    # ── Scores individuels (calcul pour chaque élève) ─────────────────────────
    scores = []
    for e in eleves:
        s = calculer_score(e["id"])
        scores.append({
            "id": e["id"],
            "nom": dechiffrer(e["nom"]),
            "prenom": dechiffrer(e["prenom"]),
            "score": s["score"],
            "niveau": s["niveau"],
        })

    scores.sort(key=lambda x: x["score"], reverse=True)

    repartition = {
        "ok":        sum(1 for s in scores if s["niveau"] == "ok"),
        "attention": sum(1 for s in scores if s["niveau"] == "attention"),
        "alerte":    sum(1 for s in scores if s["niveau"] == "alerte"),
    }

    top_alerte = scores[:8]  # Les 8 élèves avec le score le plus élevé

    return {
        "nb_eleves":       nb_eleves,
        "total_absences":  total_absences,
        "abs_non_just":    abs_non_just,
        "moy_abs_eleve":   moy_abs_eleve,
        "moy_generale":    moy_generale,
        "nb_dispositifs":  nb_dispositifs,
        "matieres_stats":  matieres_stats,
        "repartition":     repartition,
        "top_alerte":      top_alerte,
    }
