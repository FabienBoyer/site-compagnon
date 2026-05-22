"""
seed.py — Peuplement de la base avec une classe fictive (2nde1)
À lancer une seule fois : python -m backend.seed
"""

import random
from backend.db import get_connection, init_db
from backend.crypto import chiffrer, hash_identite

ELEVES = [
    ("Martin", "Lucas"), ("Bernard", "Emma"), ("Dubois", "Noah"),
    ("Thomas", "Léa"), ("Robert", "Mathis"), ("Richard", "Chloé"),
    ("Petit", "Ethan"), ("Durand", "Inès"), ("Leroy", "Tom"),
    ("Moreau", "Jade"), ("Simon", "Hugo"), ("Laurent", "Camille"),
    ("Lefebvre", "Louis"), ("Michel", "Manon"), ("Garcia", "Théo"),
    ("David", "Zoé"), ("Bertrand", "Antoine"), ("Roux", "Lucie"),
    ("Vincent", "Raphaël"), ("Fournier", "Clara"), ("Morel", "Alexis"),
    ("Girard", "Eva"), ("Andre", "Maxime"), ("Lefevre", "Anaïs"),
    ("Mercier", "Baptiste"),
]

MATIERES = ["Mathématiques", "Français", "Histoire-Géo", "Anglais",
            "SVT", "Physique-Chimie", "EPS", "Arts plastiques"]

APPRECIATIONS_POOL = [
    "Élève sérieux, bon travail.",
    "Des efforts à fournir pour progresser.",
    "Très bons résultats, continue ainsi.",
    "Participation active en classe.",
    "Des lacunes à combler rapidement.",
    "Travail régulier et méthodique.",
    "Peut mieux faire avec plus de rigueur.",
    "Excellente progression ce trimestre.",
    "Manque de concentration en cours.",
    "Résultats satisfaisants dans l'ensemble.",
]

MOTIFS = ["Maladie", "Rendez-vous médical", "Raison familiale", None]


def seed():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    # Vider les tables pour éviter les doublons si relancé
    cursor.execute("DELETE FROM dispositifs")
    cursor.execute("DELETE FROM contacts_familles")
    cursor.execute("DELETE FROM appreciations")
    cursor.execute("DELETE FROM absences")
    cursor.execute("DELETE FROM eleves")
    cursor.execute("DELETE FROM sqlite_sequence")  # reset autoincrement

    print("Insertion des élèves...")
    for nom, prenom in ELEVES:
        cursor.execute(
            "INSERT INTO eleves (nom, prenom, nom_hash, classe) VALUES (?, ?, ?, '2nde1')",
            (chiffrer(nom), chiffrer(prenom), hash_identite(nom, prenom))
        )

    eleve_ids = [row[0] for row in cursor.execute("SELECT id FROM eleves").fetchall()]

    print("Insertion des absences...")
    mois = ["2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02"]
    for eleve_id in eleve_ids:
        nb_absences = random.randint(0, 6)
        for _ in range(nb_absences):
            mois_choisi = random.choice(mois)
            jour = random.randint(1, 28)
            date_debut = f"{mois_choisi}-{jour:02d}"
            justifiee = random.randint(0, 1)
            motif = random.choice(MOTIFS) if justifiee else None
            cursor.execute("""
                INSERT INTO absences (eleve_id, date_debut, justifiee, motif)
                VALUES (?, ?, ?, ?)
            """, (eleve_id, date_debut, justifiee, motif))

    print("Insertion des appréciations...")
    for eleve_id in eleve_ids:
        for matiere in MATIERES:
            for periode in ["T1", "T2"]:
                note = round(random.uniform(4.0, 19.0), 1)
                appreciation = random.choice(APPRECIATIONS_POOL)
                cursor.execute("""
                    INSERT INTO appreciations (eleve_id, matiere, periode, note, appreciation)
                    VALUES (?, ?, ?, ?, ?)
                """, (eleve_id, matiere, periode, note, appreciation))

    print("Insertion des dispositifs...")
    # 4 élèves avec dispositifs
    eleves_dispositifs = random.sample(eleve_ids, 4)
    types = ["PAP", "PPRE", "PAP", "PPS"]
    for eleve_id, type_d in zip(eleves_dispositifs, types):
        cursor.execute("""
            INSERT INTO dispositifs (eleve_id, type, date_debut, details)
            VALUES (?, ?, '2025-09-01', ?)
        """, (eleve_id, type_d, f"Dispositif {type_d} mis en place en début d'année."))

    print("Insertion des contacts familles...")
    # quelques contacts pour 6 élèves
    types_contact = ["appel", "mail", "rencontre"]
    for eleve_id in random.sample(eleve_ids, 6):
        cursor.execute("""
            INSERT INTO contacts_familles (eleve_id, date_contact, type_contact, contenu)
            VALUES (?, '2025-10-15', ?, ?)
        """, (eleve_id, random.choice(types_contact), "Échange concernant les résultats du premier trimestre."))

    conn.commit()
    conn.close()
    print(f"✓ Base peuplée : {len(ELEVES)} élèves, absences, appréciations T1+T2, dispositifs.")


if __name__ == "__main__":
    seed()
