"""
db.py — Connexion SQLite et création des tables PP Tracker
Chiffrement : champs nom/prenom via Fernet + DPAPI (voir crypto.py)
"""

import sqlite3
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

DB_PATH = Path(os.getenv("DB_PATH", "data/pptracker.db"))


def get_connection() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    """Crée toutes les tables si elles n'existent pas."""
    from backend.crypto import init_crypto
    init_crypto()

    conn = get_connection()
    cursor = conn.cursor()

    # ── Élèves ──────────────────────────────────────────────────────────────
    # nom et prenom sont stockés chiffrés (Fernet)
    # nom_hash permet les correspondances sans déchiffrement
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS eleves (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            nom         TEXT NOT NULL,
            prenom      TEXT NOT NULL,
            nom_hash    TEXT NOT NULL DEFAULT '',
            classe      TEXT NOT NULL DEFAULT '2nde1',
            date_nais   TEXT,
            created_at  TEXT DEFAULT (datetime('now'))
        )
    """)

    # Ajouter nom_hash si table existante sans cette colonne (migration)
    try:
        cursor.execute("ALTER TABLE eleves ADD COLUMN nom_hash TEXT NOT NULL DEFAULT ''")
        conn.commit()
    except Exception:
        pass  # colonne déjà présente

    # ── Absences ────────────────────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS absences (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            eleve_id    INTEGER NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
            date_debut  TEXT NOT NULL,
            date_fin    TEXT,
            justifiee   INTEGER DEFAULT 0,
            motif       TEXT,
            created_at  TEXT DEFAULT (datetime('now'))
        )
    """)

    # ── Appréciations ────────────────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS appreciations (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            eleve_id    INTEGER NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
            matiere     TEXT NOT NULL,
            periode     TEXT NOT NULL,
            note        REAL,
            appreciation TEXT,
            created_at  TEXT DEFAULT (datetime('now'))
        )
    """)

    # ── Contacts familles ────────────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contacts_familles (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            eleve_id    INTEGER NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
            date_contact TEXT NOT NULL,
            type_contact TEXT NOT NULL,
            contenu     TEXT,
            created_at  TEXT DEFAULT (datetime('now'))
        )
    """)

    # ── Dispositifs ───────────────────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS dispositifs (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            eleve_id    INTEGER NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
            type        TEXT NOT NULL,
            date_debut  TEXT,
            date_fin    TEXT,
            details     TEXT,
            created_at  TEXT DEFAULT (datetime('now'))
        )
    """)

    # ── Certifications ───────────────────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS certifications (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            eleve_id        INTEGER NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
            type            TEXT NOT NULL,
            statut          TEXT DEFAULT 'en_attente',
            date_obtention  TEXT,
            notes           TEXT,
            updated_at      TEXT DEFAULT (datetime('now')),
            UNIQUE(eleve_id, type)
        )
    """)

    # ── Parcours éducatifs ───────────────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS parcours_educatifs (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            eleve_id        INTEGER NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
            type            TEXT NOT NULL,
            annee_scolaire  TEXT DEFAULT '2025-2026',
            participation   TEXT,
            valide          INTEGER DEFAULT 0,
            updated_at      TEXT DEFAULT (datetime('now')),
            UNIQUE(eleve_id, type, annee_scolaire)
        )
    """)

    # ── Documents élève (PAP, PPRE, PPS, ESS…) ──────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents_eleve (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            eleve_id        INTEGER NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
            type_document   TEXT NOT NULL,
            titre           TEXT NOT NULL,
            date_document   TEXT,
            preconisations  TEXT,
            chemin_fichier  TEXT,
            created_at      TEXT DEFAULT (datetime('now'))
        )
    """)

    # ── Orientation (M11) ────────────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orientation (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            eleve_id        INTEGER NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
            date_entretien  TEXT,
            voie_envisagee  TEXT,
            specialites     TEXT DEFAULT '[]',
            projet_pro      TEXT,
            notes_pp        TEXT,
            updated_at      TEXT DEFAULT (datetime('now')),
            UNIQUE(eleve_id)
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS stages_decouverte (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            eleve_id    INTEGER NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
            date_debut  TEXT,
            date_fin    TEXT,
            entreprise  TEXT,
            secteur     TEXT,
            bilan       TEXT,
            created_at  TEXT DEFAULT (datetime('now'))
        )
    """)

    # ── Plan de classe (M10) ─────────────────────────────────────────────────
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS plan_classe (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            nom         TEXT NOT NULL DEFAULT 'Plan 1',
            nb_lignes   INTEGER NOT NULL DEFAULT 5,
            nb_colonnes INTEGER NOT NULL DEFAULT 6,
            grille      TEXT NOT NULL DEFAULT '{}',
            created_at  TEXT DEFAULT (datetime('now')),
            updated_at  TEXT DEFAULT (datetime('now'))
        )
    """)

    conn.commit()
    conn.close()
    print("Base de données initialisée ✓")


if __name__ == "__main__":
    init_db()
