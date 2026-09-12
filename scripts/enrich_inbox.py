#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
enrich_inbox.py — étape 2 de la chaîne de veille.

Prend un export de signets X (produit par l'extension veille-extension-v3),
le fusionne avec la boîte de réception, écarte ce qui est déjà publié,
puis fait rédiger par un modèle LOCAL (Ollama) un titre et un résumé en français.

Principe : on ne tronque jamais. On reformule, ou on laisse le texte intégral.
C'est ce qui distingue cette étape du `[:200]` de l'ancien bot.

Usage :
    python enrich_inbox.py veille-inbox-2026-09-11.json
    python enrich_inbox.py *.json --model qwen3.5 --dry-run
    python enrich_inbox.py --rss          # enrichit ce que veille_bot.py a déposé

Sortie : data/veille-inbox.json, à ouvrir ensuite dans tools/valider-veille.html
"""

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "data"
INBOX = DATA_DIR / "veille-inbox.json"
PUBLISHED = DATA_DIR / "veille.json"

OLLAMA_URL = "http://localhost:11434/api/chat"
DEFAULT_MODEL = "qwen3.5"
TIMEOUT = 120

CATEGORIES = ["Outil", "Pratique pédagogique", "Cadre & éthique",
              "Modèle & technique", "Réflexion", "Institutionnel"]
NIVEAUX = ["collège", "lycée", "transversal", "hors classe"]

# Tous les signets n'ont pas vocation à finir dans le fil d'actualité : certains
# alimentent une rubrique durable du site. Reprend le tri de ROADMAP_SIGNETS_TWITTER.md.
DESTINATIONS = ["Fil de veille", "Outils", "Formation", "Éthique", "Disciplines"]

SYSTEM = """Tu prépares une veille destinée à des enseignants français du second degré.
On te donne le contenu brut d'un signet (souvent un tweet, parfois en anglais).
Tu réponds UNIQUEMENT par un objet JSON valide, sans texte autour, avec ces clés :

- "titre"      : 4 à 9 mots, en français, factuel. Pas de titre racoleur, pas de point final.
- "resume"     : exactement deux phrases complètes en français. Tu REFORMULES, tu ne recopies pas.
                 Jamais de phrase coupée. Si le contenu est trop maigre pour deux phrases,
                 écris une seule phrase complète.
- "categorie"  : une valeur parmi %s
- "niveau"     : une valeur parmi %s
- "pertinence" : entier de 0 à 5. 0 = publicité, annonce commerciale, promotion de prix,
                 contenu sans rapport avec l'enseignement. 5 = directement utilisable en classe.
- "langue_source" : "fr" ou "en" ou autre code court.
- "destination" : où ce contenu a sa place sur le site, parmi %s.
                  "Outils" pour une application à essayer, "Formation" pour une ressource
                  institutionnelle ou un dossier, "Éthique" pour le cadre légal, RGPD ou
                  un débat de fond, "Disciplines" pour un usage propre à une matière,
                  "Fil de veille" pour une actualité qui n'a pas vocation à rester.

Si le contenu est une annonce commerciale ou promotionnelle, mets pertinence à 0
sans chercher à l'enjoliver.""" % (CATEGORIES, NIVEAUX, DESTINATIONS)


def normalize_link(link: str) -> str:
    link = str(link or "").strip()
    if not link:
        return ""
    p = urlsplit(link)
    path = p.path.rstrip("/") or "/"
    return urlunsplit((p.scheme.lower(), p.netloc.lower().replace("twitter.com", "x.com"),
                       path, "", ""))


def load_json(path: Path, default):
    if not path.exists():
        return default
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as e:
        print(f"  ! {path.name} illisible ({e}) — ignoré", file=sys.stderr)
        return default


def published_keys() -> set:
    data = load_json(PUBLISHED, {})
    keys = set()
    for a in (data.get("articles") or []):
        k = normalize_link(a.get("link"))
        if k:
            keys.add(k)
    return keys


def call_ollama(model: str, text: str, links: list) -> dict | None:
    prompt = text.strip()
    if links:
        prompt += "\n\nLiens cités : " + ", ".join(links[:5])
    body = json.dumps({
        "model": model,
        "messages": [{"role": "system", "content": SYSTEM},
                     {"role": "user", "content": prompt}],
        "stream": False,
        "format": "json",
        "options": {"temperature": 0.2},
    }).encode("utf-8")

    req = urllib.request.Request(OLLAMA_URL, data=body,
                                 headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            payload = json.loads(r.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        raise RuntimeError(f"Ollama injoignable sur {OLLAMA_URL} : {e}")

    content = (payload.get("message") or {}).get("content", "")
    content = re.sub(r"^```(?:json)?|```$", "", content.strip(), flags=re.M).strip()
    try:
        out = json.loads(content)
    except json.JSONDecodeError:
        return None
    return out if isinstance(out, dict) else None


def sanity(enr: dict, raw_text: str) -> dict:
    """Le modèle peut déraper : on rattrape sans jamais tronquer en plein mot."""
    titre = str(enr.get("titre") or "").strip().rstrip(".")
    resume = " ".join(str(enr.get("resume") or "").split())
    if not resume:
        resume = " ".join(raw_text.split())          # repli : texte intégral
    cat = enr.get("categorie") if enr.get("categorie") in CATEGORIES else "Réflexion"
    niv = enr.get("niveau") if enr.get("niveau") in NIVEAUX else "transversal"
    try:
        pert = max(0, min(5, int(enr.get("pertinence", 3))))
    except (TypeError, ValueError):
        pert = 3
    if not titre:
        # premier bout de phrase complet, coupé sur une ponctuation et non au caractère
        m = re.split(r"(?<=[.!?])\s", resume)
        titre = (m[0] if m else resume)[:90].strip()
    dest = enr.get("destination") if enr.get("destination") in DESTINATIONS else "Fil de veille"
    return {"titre": titre, "resume": resume, "categorie": cat, "destination": dest,
            "niveau": niv, "pertinence": pert,
            "langue_source": str(enr.get("langue_source") or "").strip()[:5] or "fr"}


def to_item(raw: dict) -> dict:
    """Normalise un signet X ou un article RSS vers le format commun de l'inbox."""
    if "text" in raw:                                  # signet X
        return {"key": normalize_link(raw.get("url")),
                "link": raw.get("url"), "date": raw.get("date"),
                "source": (raw.get("handle") or raw.get("author") or "X").strip(),
                "raw_text": raw.get("text") or "", "links": raw.get("links") or [],
                "origine": "signet"}
    return {"key": normalize_link(raw.get("link")),    # article RSS
            "link": raw.get("link"), "date": raw.get("date"),
            "source": raw.get("source") or "RSS",
            "raw_text": ((raw.get("title") or "") + ". " + (raw.get("summary") or "")).strip(),
            "links": [], "origine": "rss"}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="*", type=Path, help="exports JSON de l'extension")
    ap.add_argument("--rss", action="store_true",
                    help="reprendre aussi les articles déjà déposés dans l'inbox par veille_bot.py")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--dry-run", action="store_true",
                    help="n'appelle pas le modèle : range les signets tels quels")
    args = ap.parse_args()

    if not args.files and not args.rss:
        ap.error("indiquez au moins un fichier d'export, ou --rss")

    inbox = load_json(INBOX, {"items": [], "last_update": None})
    known = {i.get("key") for i in inbox["items"] if i.get("key")}
    already = published_keys()

    incoming = []
    for path in args.files:
        payload = load_json(path, None)
        if not payload:
            print(f"  ! {path} : illisible, ignoré", file=sys.stderr)
            continue
        items = payload.get("items") if isinstance(payload, dict) else payload
        incoming += list(items or [])
        print(f"  · {path.name} : {len(items or [])} entrées")
    if args.rss:
        incoming += [i for i in inbox["items"] if i.get("origine") == "rss"
                     and i.get("status") == "brut"]

    fresh, skipped_pub, skipped_dup = [], 0, 0
    for raw in incoming:
        item = to_item(raw)
        if not item["key"]:
            continue
        if item["key"] in already:
            skipped_pub += 1
            continue
        if item["key"] in known:
            skipped_dup += 1
            continue
        known.add(item["key"])
        fresh.append(item)

    print(f"\n{len(fresh)} nouveaux · {skipped_dup} déjà en attente · {skipped_pub} déjà publiés")
    if not fresh:
        print("Rien à enrichir.")
        return 0

    if args.dry_run:
        for it in fresh:
            it.update({"status": "brut", "titre": "", "resume": it["raw_text"]})
    else:
        print(f"Enrichissement local via {args.model}…")
        failures = 0
        for n, it in enumerate(fresh, 1):
            try:
                enr = call_ollama(args.model, it["raw_text"], it["links"])
            except RuntimeError as e:
                print(f"\n{e}\nAstuce : `ollama serve` puis `ollama pull {args.model}`.",
                      file=sys.stderr)
                print("Les signets sont conservés bruts, relancez plus tard.", file=sys.stderr)
                for rest in fresh[n - 1:]:
                    rest.update({"status": "brut", "titre": "", "resume": rest["raw_text"]})
                break
            if enr is None:
                failures += 1
                it.update({"status": "brut", "titre": "", "resume": it["raw_text"]})
            else:
                it.update(sanity(enr, it["raw_text"]))
                it["status"] = "a_valider"
            print(f"\r  {n}/{len(fresh)}", end="", flush=True)
        print()
        if failures:
            print(f"  ({failures} réponses du modèle illisibles → laissées brutes)")

    inbox["items"] = fresh + inbox["items"]
    inbox["last_update"] = datetime.now().isoformat(timespec="seconds")
    DATA_DIR.mkdir(exist_ok=True)
    with open(INBOX, "w", encoding="utf-8") as f:
        json.dump(inbox, f, ensure_ascii=False, indent=2)

    pub = sum(1 for i in fresh if i.get("pertinence", 3) >= 3)
    print(f"\nÉcrit dans {INBOX.relative_to(PROJECT_DIR)} — {len(inbox['items'])} en attente "
          f"({pub} avec une pertinence ≥ 3).")
    print("Étape suivante : ouvrez tools/valider-veille.html et déposez-y ce fichier.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
