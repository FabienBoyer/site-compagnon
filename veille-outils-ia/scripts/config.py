# Configuration pour l'agent de veille outils IA
# ==============================================

import os

# Email configuration
RECIPIENT_EMAIL = os.environ.get("RECIPIENT_EMAIL", "")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "")

# Ce depot est public : les adresses ne sont plus ecrites en dur.
# Elles viennent des secrets GitHub RECIPIENT_EMAIL et SENDER_EMAIL.
if not RECIPIENT_EMAIL or not SENDER_EMAIL:
    raise SystemExit(
        "Adresses manquantes : definissez les variables d'environnement "
        "RECIPIENT_EMAIL et SENDER_EMAIL (secrets GitHub)."
    )
SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY", "")

# Paths
NEWSLETTERS_DIR = "newsletters"
OUTPUT_DIR = "output"

# Mots-clés pour le filtrage
# ==========================

# Mots-clés prioritaires (éducation/formation)
EDUCATION_KEYWORDS = [
    # Français
    "enseignant", "formateur", "formation", "pédagogie", "pédagogique",
    "éducation", "éducatif", "apprentissage", "élève", "étudiant",
    "classe", "cours", "quiz", "évaluation", "exercice", "leçon",
    "scolaire", "académique", "didactique", "tutoriel",
    # Anglais
    "teacher", "educator", "teaching", "learning", "student",
    "classroom", "education", "educational", "school", "academic",
    "quiz", "assessment", "lesson", "tutorial", "course", "training"
]

# Mots-clés secondaires (outils IA)
AI_KEYWORDS = [
    # Général
    "AI", "IA", "artificial intelligence", "intelligence artificielle",
    "machine learning", "deep learning", "neural network",
    # Modèles
    "GPT", "ChatGPT", "Claude", "Gemini", "LLM", "chatbot",
    "Mistral", "Llama", "OpenAI", "Anthropic", "Google AI",
    # Fonctionnalités
    "generate", "génère", "création", "create", "automate",
    "summarize", "résumer", "text-to", "image generation",
    "voice", "transcription", "translation", "traduction"
]

# Mots-clés bonus (gratuit/accessible)
FREE_KEYWORDS = [
    "free", "gratuit", "freemium", "open source", "opensource",
    "no cost", "sans frais", "essai gratuit", "free trial",
    "free tier", "plan gratuit"
]

# Mots-clés à exclure (spam/non pertinent)
EXCLUDE_KEYWORDS = [
    "crypto", "NFT", "blockchain", "trading", "forex",
    "casino", "betting", "gambling", "adult", "xxx"
]

# Scoring
# =======

SCORE_WEIGHTS = {
    "education_keyword": 10,      # Chaque mot-clé éducation trouvé
    "ai_keyword": 5,              # Chaque mot-clé IA trouvé
    "free_keyword": 8,            # Chaque mention de gratuité
    "has_url": 3,                 # Contient un lien
    "exclude_penalty": -50        # Pénalité si mot-clé exclu
}

# Seuil minimum pour inclure un outil dans le récap
MIN_SCORE_THRESHOLD = 15

# Nombre max d'outils dans le récap mensuel
MAX_TOOLS_IN_DIGEST = 10

# Email template
# ==============

EMAIL_SUBJECT_TEMPLATE = "🤖 Veille Outils IA - Récap {month} {year}"

EMAIL_INTRO_TEMPLATE = """
Bonjour Fabien,

Voici votre récapitulatif mensuel des outils IA repérés dans les newsletters.
{tool_count} outil(s) pertinent(s) identifié(s) ce mois-ci.

"""

EMAIL_OUTRO_TEMPLATE = """
---
Ce récap a été généré automatiquement par votre agent de veille.
Pour modifier les critères de filtrage, éditez le fichier config.py dans le repository.

Bonne découverte !
"""
