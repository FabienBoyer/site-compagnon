"""
m8b_synthese.py — Génération de synthèses PP via Ollama (DeepSeek R1 / Mistral)

Appelle l'API Ollama locale (localhost:11434) pour générer une appréciation
du professeur principal à partir des données réelles de l'élève.
"""

import requests
import json
from backend.modules.m2_eleve import get_eleve, calculer_score

OLLAMA_URL = "http://localhost:11434"
MODELE_DEFAUT = "mistral-nemo:latest"


def lister_modeles() -> list[str]:
    """Retourne la liste des modèles texte disponibles dans Ollama."""
    try:
        r = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
        r.raise_for_status()
        modeles = r.json().get("models", [])
        # On filtre les modèles vision (Qwen VL) dédiés à M8a
        return [m["name"] for m in modeles if "vl" not in m["name"].lower()]
    except Exception as e:
        raise RuntimeError(f"Ollama inaccessible : {e}")


def _construire_prompt(eleve: dict, score: dict, periode: str) -> str:
    """Construit le prompt à partir des données élève."""
    nom    = eleve["nom"]
    prenom = eleve["prenom"]

    # Absences
    absences = eleve.get("absences", [])
    nb_abs   = len(absences)
    nb_nj    = sum(1 for a in absences if not a.get("justifiee"))

    # Appréciations de la période demandée
    appr_periode = [
        a for a in eleve.get("appreciations", [])
        if a.get("periode") == periode
    ]
    appr_textes = []
    for a in appr_periode:
        matiere = a.get("matiere", "")
        note    = a.get("note")
        appr    = a.get("appreciation", "")
        ligne   = f"  - {matiere}"
        if note is not None:
            ligne += f" ({note}/20)"
        if appr:
            ligne += f" : « {appr} »"
        appr_textes.append(ligne)

    # Dispositifs
    dispositifs = [d.get("type", "") for d in eleve.get("dispositifs", [])]

    # Score
    niveau = score.get("niveau", "ok")
    detail = score.get("detail", {})
    moy    = detail.get("moyenne_generale")

    # Construction du prompt
    lignes = [
        "Tu es professeur principal d'une classe de lycée (niveau seconde).",
        f"Rédige une appréciation concise (2 à 3 phrases) pour {prenom} {nom},",
        f"destinée au bulletin du conseil de classe de la période {periode}.",
        "",
        "Données de l'élève :",
        f"  - Moyenne générale : {moy if moy is not None else 'non disponible'}/20",
        f"  - Absences : {nb_abs} au total, dont {nb_nj} non justifiée(s)",
    ]
    if dispositifs:
        lignes.append(f"  - Dispositifs actifs : {', '.join(dispositifs)}")
    if appr_textes:
        lignes.append(f"  - Appréciations des professeurs pour {periode} :")
        lignes.extend(appr_textes)
    if niveau == "alerte":
        lignes.append("  - Situation : élève en situation d'alerte, suivi renforcé nécessaire")
    elif niveau == "attention":
        lignes.append("  - Situation : élève nécessitant une attention particulière")

    lignes += [
        "",
        "Consignes de rédaction :",
        "  - Style formel et bienveillant, adapté à un bulletin scolaire français",
        "  - Ne pas mentionner de scores, d'algorithmes ou de données brutes",
        "  - Synthétiser les points forts, les axes de progrès et les encouragements",
        "  - 2 à 3 phrases maximum",
        "  - Répondre UNIQUEMENT avec l'appréciation, sans introduction ni commentaire",
    ]

    return "\n".join(lignes)


def generer_appreciation(eleve_id: int, periode: str, modele: str = MODELE_DEFAUT) -> str:
    """
    Génère une appréciation PP pour l'élève donné via Ollama.
    Retourne le texte généré.
    """
    eleve = get_eleve(eleve_id)
    if not eleve:
        raise ValueError(f"Élève {eleve_id} introuvable")

    score  = calculer_score(eleve_id)
    prompt = _construire_prompt(eleve, score, periode)

    payload = {
        "model": modele,
        "messages": [
            {
                "role": "system",
                "content": (
                    "Tu es un assistant pédagogique pour professeurs de lycée. "
                    "Tu rédiges des appréciations de conseil de classe, sobres et professionnelles."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        "stream": False,
        "options": {
            "temperature": 0.7,
            "num_predict": 200,
        },
    }

    try:
        r = requests.post(
            f"{OLLAMA_URL}/api/chat",
            json=payload,
            timeout=120,  # Les modèles raisonnants (R1) peuvent être lents
        )
        r.raise_for_status()
        data    = r.json()
        contenu = data.get("message", {}).get("content", "").strip()

        # DeepSeek R1 entoure parfois sa réponse de balises <think>…</think>
        if "<think>" in contenu and "</think>" in contenu:
            contenu = contenu.split("</think>", 1)[-1].strip()

        return contenu

    except requests.exceptions.Timeout:
        raise RuntimeError("Ollama n'a pas répondu dans les délais (120 s). Modèle trop lent ?")
    except requests.exceptions.ConnectionError:
        raise RuntimeError("Impossible de joindre Ollama sur localhost:11434. Est-il démarré ?")
    except Exception as e:
        raise RuntimeError(f"Erreur Ollama : {e}")
