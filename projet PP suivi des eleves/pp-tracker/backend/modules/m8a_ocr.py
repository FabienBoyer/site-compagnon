"""
m8a_ocr.py — Lecture de bulletins scannés via Qwen2.5VL (Ollama)

Accepte une image (PNG/JPG) ou un PDF (première page extraite).
Retourne un dict structuré : {nom, prenom, classe, periode, notes: [...]}

Usage :
  from backend.modules.m8a_ocr import ocr_bulletin
  result = ocr_bulletin(image_bytes, "image/png")
"""

import base64
import json
import re
import requests
from pathlib import Path

OLLAMA_URL   = "http://localhost:11434"
MODELE_VISION = "qwen2.5vl:7b"   # Modèle vision multimodal

PROMPT_OCR = """Analyse ce bulletin scolaire scanné.
Extrais toutes les informations visibles et retourne UNIQUEMENT un objet JSON valide, sans texte avant ou après, dans ce format exact :

{
  "nom": "NOM",
  "prenom": "Prénom",
  "classe": "2nde1",
  "periode": "T1",
  "notes": [
    {
      "matiere": "Mathématiques",
      "note": 14.5,
      "appreciation": "Bon travail, continue ainsi."
    }
  ]
}

Règles :
- "note" est un nombre décimal (ex: 14.5) ou null si illisible
- "appreciation" est le texte de l'appréciation du professeur, ou "" si absent
- "periode" : T1, T2 ou T3 selon ce qui est indiqué sur le document
- Si une information est absente ou illisible, utilise null ou ""
- Retourne UNIQUEMENT le JSON, sans markdown, sans backticks, sans explication
"""


def _image_en_base64(image_bytes: bytes) -> str:
    """Encode les bytes d'une image en base64."""
    return base64.b64encode(image_bytes).decode("utf-8")


def _extraire_json(texte: str) -> dict:
    """
    Extrait le premier bloc JSON valide du texte retourné par le modèle.
    Gère les cas où le modèle ajoute du texte avant/après.
    """
    # Tentative directe
    try:
        return json.loads(texte.strip())
    except json.JSONDecodeError:
        pass

    # Cherche un bloc JSON délimité par {}
    match = re.search(r'\{[\s\S]*\}', texte)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Impossible d'extraire un JSON valide de la réponse du modèle.\nRéponse brute : {texte[:500]}")


def ocr_bulletin(image_bytes: bytes, content_type: str = "image/jpeg") -> dict:
    """
    Envoie une image à Qwen2.5VL via Ollama et retourne les données structurées.

    Args:
        image_bytes: Contenu binaire de l'image
        content_type: MIME type (image/jpeg, image/png)

    Returns:
        dict avec keys: nom, prenom, classe, periode, notes
    """
    b64 = _image_en_base64(image_bytes)

    payload = {
        "model": MODELE_VISION,
        "messages": [
            {
                "role": "user",
                "content": PROMPT_OCR,
                "images": [b64],
            }
        ],
        "stream": False,
        "options": {
            "temperature": 0.1,   # Très bas pour la précision OCR
            "num_predict": 1000,
        },
    }

    try:
        r = requests.post(
            f"{OLLAMA_URL}/api/chat",
            json=payload,
            timeout=180,
        )
        r.raise_for_status()
        contenu = r.json().get("message", {}).get("content", "").strip()
        return _extraire_json(contenu)

    except requests.exceptions.Timeout:
        raise RuntimeError("Qwen2.5VL n'a pas répondu dans les délais (180 s)")
    except requests.exceptions.ConnectionError:
        raise RuntimeError("Impossible de joindre Ollama sur localhost:11434")
    except ValueError as e:
        raise RuntimeError(str(e))
    except Exception as e:
        raise RuntimeError(f"Erreur OCR : {e}")


def ocr_bulletin_pdf(pdf_bytes: bytes) -> dict:
    """
    Extrait la première page d'un PDF et la passe à l'OCR.
    Nécessite : pip install pdf2image pillow
    """
    try:
        from pdf2image import convert_from_bytes
        import io
        pages = convert_from_bytes(pdf_bytes, first_page=1, last_page=1, dpi=200)
        if not pages:
            raise RuntimeError("PDF vide ou illisible")
        img_io = io.BytesIO()
        pages[0].save(img_io, format="PNG")
        return ocr_bulletin(img_io.getvalue(), "image/png")
    except ImportError:
        raise RuntimeError(
            "pdf2image non installé. Lance : pip install pdf2image pillow --break-system-packages\n"
            "Poppler est aussi nécessaire sur Windows : https://github.com/oschwartz10612/poppler-windows"
        )
