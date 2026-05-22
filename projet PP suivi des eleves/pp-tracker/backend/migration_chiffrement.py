"""
migration_chiffrement.py — Chiffre les données existantes en base

À lancer UNE SEULE FOIS après installation de crypto.py :
  python -m backend.migration_chiffrement

Chiffre les colonnes nom/prenom de tous les élèves existants
et calcule leur hash d'identité.
"""

from backend.db import get_connection
from backend.crypto import init_crypto, chiffrer, hash_identite, dechiffrer


def migrer():
    init_crypto()
    conn = get_connection()

    eleves = conn.execute("SELECT id, nom, prenom FROM eleves").fetchall()
    print(f"{len(eleves)} élèves à migrer…")

    deja_chiffres = 0
    migres = 0

    for e in eleves:
        nom    = e["nom"]
        prenom = e["prenom"]

        # Détection si déjà chiffré (les tokens Fernet commencent par 'gAAA')
        if nom.startswith("gAAA"):
            deja_chiffres += 1
            continue

        nom_chiffre    = chiffrer(nom)
        prenom_chiffre = chiffrer(prenom)
        h              = hash_identite(nom, prenom)

        conn.execute("""
            UPDATE eleves
            SET nom = ?, prenom = ?, nom_hash = ?
            WHERE id = ?
        """, (nom_chiffre, prenom_chiffre, h, e["id"]))
        migres += 1

    conn.commit()
    conn.close()

    print(f"✓ Migration terminée : {migres} chiffrés, {deja_chiffres} déjà chiffrés.")


if __name__ == "__main__":
    migrer()
