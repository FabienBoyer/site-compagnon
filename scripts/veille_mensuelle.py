#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
veille_mensuelle.py — enchaîne les étapes locales de la veille en une seule commande.

    python scripts/veille_mensuelle.py

1. git pull (le workflow GitHub commite l'inbox chaque jour)
2. démarre Ollama si besoin
3. enrichit le dernier export de signets trouvé dans Téléchargements
   (veille-inbox-AAAA-MM-JJ.json) puis les entrées RSS encore brutes
4. ouvre l'outil de validation avec les entrées déjà chargées
   (copie générée dans work/, ignorée par git)

Reste à la main : l'export des signets X (il passe par votre session connectée)
et l'arbitrage dans l'outil de validation.
"""

import argparse
import json
import re
import subprocess
import sys
import time
import urllib.request
import webbrowser
from datetime import datetime, timedelta
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPT_DIR.parent
DOWNLOADS = Path.home() / "Downloads"
DONE = PROJECT_DIR / "data" / ".veille-exports-traites.txt"
TAGS_URL = "http://localhost:11434/api/tags"
MAX_AGE = timedelta(days=45)


def run(cmd):
    print("$", " ".join(str(c) for c in cmd))
    return subprocess.run(cmd, cwd=PROJECT_DIR).returncode


def ollama_models():
    try:
        with urllib.request.urlopen(TAGS_URL, timeout=3) as r:
            return [m["name"] for m in json.load(r).get("models", [])]
    except Exception:
        return None


def ensure_ollama():
    models = ollama_models()
    if models is None:
        print("Ollama ne répond pas, lancement de `ollama serve`…")
        try:
            subprocess.Popen(["ollama", "serve"], stdout=subprocess.DEVNULL,
                             stderr=subprocess.DEVNULL)
        except FileNotFoundError:
            sys.exit("Ollama est introuvable : installez-le ou lancez-le à la main.")
        for _ in range(20):
            time.sleep(1)
            models = ollama_models()
            if models is not None:
                break
    if not models:
        sys.exit("Ollama ne répond pas ou n'a aucun modèle (`ollama pull qwen3.5:9b`).")
    return next((m for m in models if m.startswith("qwen3.5")), models[0])


def new_exports():
    done = set(DONE.read_text(encoding="utf-8").split("\n")) if DONE.exists() else set()
    limit = datetime.now() - MAX_AGE
    found = []
    for p in sorted(DOWNLOADS.glob("veille-inbox-2*.json")):
        if p.name in done or datetime.fromtimestamp(p.stat().st_mtime) < limit:
            continue
        found.append(p)
    return found


def open_validator():
    """Ouvre l'outil avec l'inbox intégrée : plus de fichier à chercher ni à déposer."""
    html = (PROJECT_DIR / "tools" / "valider-veille.html").read_text(encoding="utf-8")
    # L'outil est annoncé comme local, sans appel réseau : on retire la mesure d'audience.
    html = re.sub(r"\s*<script data-goatcounter=.*?</script>", "", html)
    inbox = (PROJECT_DIR / "data" / "veille-inbox.json").read_text(encoding="utf-8")
    literal = json.dumps(inbox, ensure_ascii=False).replace("</", "<\\/")
    head, sep, tail = html.rpartition("</script>")
    out = PROJECT_DIR / "work" / "valider-veille-charge.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(f"{head}load({literal});\n{sep}{tail}", encoding="utf-8")
    webbrowser.open(out.as_uri())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--skip-pull", action="store_true")
    args = ap.parse_args()
    py = sys.executable
    enrich = str(SCRIPT_DIR / "enrich_inbox.py")

    if not args.skip_pull and run(["git", "pull", "--ff-only"]) != 0:
        sys.exit("git pull a échoué (modifications locales sur data/veille-inbox.json ?). "
                 "Commitez ou rangez-les, puis relancez.")

    model = ensure_ollama()
    print(f"Modèle : {model}")

    exports = new_exports()
    if exports:
        for p in exports:
            if run([py, enrich, str(p), "--model", model]) == 0:
                with DONE.open("a", encoding="utf-8") as f:
                    f.write(p.name + "\n")
    else:
        print(f"Aucun nouvel export veille-inbox-*.json dans {DOWNLOADS} : "
              "seules les entrées RSS seront traitées.")

    run([py, enrich, "--pending", "--model", model])

    webbrowser.open((PROJECT_DIR / "tools" / "valider-veille.html").as_uri())
    print("\nÀ vous : déposez data/veille-inbox.json dans l'outil de validation, puis\n"
          "  python scripts/fusionner_veille.py ~/Downloads/veille-selection.json\n"
          "  git add data/veille.json data/veille-inbox.json && git commit && git push")


if __name__ == "__main__":
    main()
