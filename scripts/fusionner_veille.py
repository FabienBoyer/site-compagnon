#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ajoute une sélection validée à la veille publique sans effacer les archives.

Usage :
    python scripts/fusionner_veille.py ~/Téléchargements/veille-selection.json
"""

import argparse
import json
from datetime import datetime
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit


PROJECT_DIR = Path(__file__).resolve().parent.parent
PUBLIC_FILE = PROJECT_DIR / "data" / "veille.json"
REQUIRED = ("title", "link", "date", "source", "summary", "categorie", "niveau")


def load(path: Path) -> dict:
    try:
        with open(path, encoding="utf-8") as handle:
            data = json.load(handle)
    except (OSError, json.JSONDecodeError) as exc:
        raise SystemExit(f"Fichier illisible : {path} ({exc})") from exc
    if not isinstance(data, dict) or not isinstance(data.get("articles"), list):
        raise SystemExit(f"{path.name} n'est pas un export de veille valide.")
    return data


def key(article: dict) -> str:
    link = str(article.get("link") or "").strip()
    if link:
        parsed = urlsplit(link)
        return urlunsplit((parsed.scheme.lower(),
                           parsed.netloc.lower().replace("twitter.com", "x.com"),
                           parsed.path.rstrip("/") or "/", "", ""))
    return "|".join(str(article.get(field) or "") for field in ("title", "date", "source"))


def validate(articles: list, origin: str) -> None:
    incomplete = [index + 1 for index, article in enumerate(articles)
                  if not isinstance(article, dict) or any(not article.get(field) for field in REQUIRED)]
    if incomplete:
        listed = ", ".join(map(str, incomplete[:10]))
        raise SystemExit(f"{origin} contient des entrées incomplètes (positions {listed}).")


def save(data: dict) -> None:
    temp = PUBLIC_FILE.with_suffix(".tmp")
    with open(temp, "w", encoding="utf-8") as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2)
    temp.replace(PUBLIC_FILE)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("selection", type=Path, help="export veille-selection.json issu de l'outil de validation")
    args = parser.parse_args()

    incoming = load(args.selection)
    validate(incoming["articles"], args.selection.name)
    public = load(PUBLIC_FILE) if PUBLIC_FILE.exists() else {"articles": []}

    merged = {key(article): article for article in public.get("articles", [])}
    added = updated = 0
    for article in incoming["articles"]:
        article_key = key(article)
        if article_key in merged:
            updated += 1
        else:
            added += 1
        merged[article_key] = article

    articles = sorted(merged.values(), key=lambda article: str(article.get("date") or ""), reverse=True)
    result = {
        "last_update": datetime.now().isoformat(timespec="seconds"),
        "sources": list(dict.fromkeys(article["source"] for article in articles if article.get("source"))),
        "articles": articles,
    }
    save(result)
    print(f"Veille fusionnée : {added} ajout(s), {updated} mise(s) à jour, {len(articles)} au total.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
