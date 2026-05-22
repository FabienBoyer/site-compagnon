"""
crypto.py — Chiffrement des données personnelles (RGPD)

Stratégie :
  - Clé Fernet (AES-128 CBC + HMAC) générée une fois, stockée dans keys/pptracker.key
  - Le fichier clé est protégé par les permissions NTFS du système (accès limité à l'utilisateur)
  - Champs chiffrés : eleves.nom, eleves.prenom
  - Hash SHA-256 pour les correspondances sans déchiffrement
"""

import hashlib
from pathlib import Path
from cryptography.fernet import Fernet

KEY_PATH = Path("keys/pptracker.key")

_fernet_instance = None  # Cache pour éviter de relire la clé à chaque appel


def init_crypto():
    """
    Initialise le système de chiffrement.
    Génère la clé si elle n'existe pas encore.
    """
    global _fernet_instance
    KEY_PATH.parent.mkdir(exist_ok=True)

    if not KEY_PATH.exists():
        cle = Fernet.generate_key()
        KEY_PATH.write_bytes(cle)
        print("Clé de chiffrement générée ✓")
    else:
        print("Clé de chiffrement chargée ✓")

    _fernet_instance = Fernet(KEY_PATH.read_bytes())


def _get_fernet() -> Fernet:
    """Retourne l'instance Fernet, en l'initialisant si besoin."""
    global _fernet_instance
    if _fernet_instance is None:
        init_crypto()
    return _fernet_instance


def chiffrer(texte: str) -> str:
    """Chiffre une chaîne. Retourne un token base64 commençant par gAAA."""
    if not texte:
        return ""
    return _get_fernet().encrypt(texte.encode()).decode()


def dechiffrer(token: str) -> str:
    """
    Déchiffre un token Fernet.
    Si le token n'est pas chiffré (données legacy), le retourne tel quel.
    """
    if not token:
        return ""
    if not token.startswith("gAAA"):
        return token  # Donnée non chiffrée — compatibilité ascendante
    try:
        return _get_fernet().decrypt(token.encode()).decode()
    except Exception as e:
        print(f"[CRYPTO] Erreur déchiffrement : {e}")
        return "[illisible]"


def hash_identite(nom: str, prenom: str) -> str:
    """Hash SHA-256 de l'identité pour les correspondances internes."""
    cle = f"{nom.strip().lower()}|{prenom.strip().lower()}"
    return hashlib.sha256(cle.encode()).hexdigest()
