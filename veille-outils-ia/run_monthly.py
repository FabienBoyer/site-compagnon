#!/usr/bin/env python3
"""
Script principal - Exécute l'analyse et envoie le récap
========================================================
Ce script est appelé par GitHub Actions chaque mois.
"""

import sys
import os

# Ajouter le dossier scripts au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'scripts'))

from scripts.analyze_newsletters import main as analyze_main
from scripts.send_email import send_digest


def main():
    """Exécute le workflow complet."""
    print("🚀 Démarrage du workflow de veille mensuelle")
    print()
    
    # Étape 1: Analyser les newsletters
    digest_path, tools = analyze_main()
    
    if digest_path is None:
        print("\n⚠️ Aucun digest généré. Arrêt.")
        return 1
    
    # Étape 2: Envoyer par email
    success = send_digest(digest_path, len(tools))
    
    if not success:
        print("\n⚠️ L'email n'a pas pu être envoyé.")
        print("   Le digest est disponible localement dans output/")
        # Continuer quand même l'intégration locale si l'email échoue (ex: pas de clé API locale)
    
    # Étape 3: Lancement de l'intégration locale
    print("\n🔄 Lancement de l'intégration des outils sur le site...")
    import subprocess
    bridge_script = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'scripts', 'integrate_curated_tools.py')
    if os.path.exists(bridge_script):
        try:
            subprocess.run([sys.executable, bridge_script], check=True)
            print("✅ Intégration locale sur le site réussie !")
        except Exception as e:
            print(f"❌ Erreur lors de l'intégration : {e}")
    else:
        print(f"⚠️ Script d'intégration introuvable à {bridge_script}")
    
    print("\n✨ Workflow terminé avec succès!")
    return 0


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
