"""
reset_db.py — Remet la base à zéro avec une clé fraîche.
Usage : python -m backend.reset_db
"""
from pathlib import Path
from cryptography.fernet import Fernet

def reset():
    # 1. Nouvelle clé Fernet
    Path("keys").mkdir(exist_ok=True)
    cle = Fernet.generate_key()
    Path("keys/pptracker.key").write_bytes(cle)
    print("✓ Nouvelle clé générée")

    # 2. Supprimer la base
    db = Path("data/pptracker.db")
    if db.exists():
        db.unlink()
        print("✓ Ancienne base supprimée")

    # 3. Recréer la base et peupler
    from backend.seed import seed
    seed()
    print("✓ Base prête !")

if __name__ == "__main__":
    reset()
