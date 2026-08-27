#!/usr/bin/env python3
"""
Agent d'analyse des newsletters IA
==================================
Analyse les newsletters stockées et extrait les outils pertinents pour les formateurs.
"""

import os
import re
import json
import sys
from datetime import datetime

# Fix encoding for Windows console (emoji support)
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
from pathlib import Path
from typing import List, Dict, Tuple
from dataclasses import dataclass, asdict

# Import configuration
from config import (
    NEWSLETTERS_DIR, OUTPUT_DIR,
    EDUCATION_KEYWORDS, AI_KEYWORDS, FREE_KEYWORDS, EXCLUDE_KEYWORDS,
    SCORE_WEIGHTS, MIN_SCORE_THRESHOLD, MAX_TOOLS_IN_DIGEST
)


@dataclass
class Tool:
    """Représente un outil IA détecté."""
    name: str
    description: str
    url: str
    score: int
    source_newsletter: str
    keywords_found: List[str]


def load_newsletters(directory: str) -> List[Tuple[str, str]]:
    """Charge tous les fichiers newsletters du répertoire."""
    newsletters = []
    newsletters_path = Path(directory)
    
    if not newsletters_path.exists():
        print(f"⚠️ Répertoire {directory} introuvable")
        return newsletters
    
    for file_path in newsletters_path.glob("*.md"):
        try:
            content = file_path.read_text(encoding="utf-8")
            newsletters.append((file_path.name, content))
            print(f"📄 Chargé: {file_path.name}")
        except Exception as e:
            print(f"❌ Erreur lecture {file_path.name}: {e}")
    
    return newsletters


def extract_urls(text: str) -> List[str]:
    """Extrait les URLs d'un texte."""
    url_pattern = r'https?://[^\s\)\]>"\']+'
    return re.findall(url_pattern, text)


def extract_tool_mentions(text: str) -> List[Dict]:
    """
    Extrait les mentions d'outils potentiels.
    Cherche des patterns comme "ToolName - description" ou "**ToolName**"
    """
    tools = []
    
    # Pattern 1: **NomOutil** ou *NomOutil*
    bold_pattern = r'\*\*([A-Z][A-Za-z0-9\s]{2,30})\*\*'
    for match in re.finditer(bold_pattern, text):
        name = match.group(1).strip()
        # Récupère le contexte autour (100 caractères après)
        start = match.end()
        end = min(start + 200, len(text))
        context = text[start:end]
        
        tools.append({
            "name": name,
            "context": context,
            "position": match.start()
        })
    
    # Pattern 2: Lignes commençant par un emoji + nom
    emoji_pattern = r'^[🔧🛠️🎯💡🚀✨🤖📝🎨🔊📊]\s*([A-Z][A-Za-z0-9\s]{2,30})'
    for match in re.finditer(emoji_pattern, text, re.MULTILINE):
        name = match.group(1).strip()
        start = match.end()
        end = min(start + 200, len(text))
        context = text[start:end]
        
        tools.append({
            "name": name,
            "context": context,
            "position": match.start()
        })
    
    # Pattern 3: "Check out X" ou "Try X" ou "Introducing X"
    intro_pattern = r'(?:Check out|Try|Introducing|Meet|Discover|New:)\s+([A-Z][A-Za-z0-9\s]{2,30})'
    for match in re.finditer(intro_pattern, text, re.IGNORECASE):
        name = match.group(1).strip()
        start = match.end()
        end = min(start + 200, len(text))
        context = text[start:end]
        
        tools.append({
            "name": name,
            "context": context,
            "position": match.start()
        })
    
    return tools


def calculate_score(text: str, context: str = "") -> Tuple[int, List[str]]:
    """
    Calcule le score de pertinence d'un texte.
    Retourne (score, liste des mots-clés trouvés)
    """
    full_text = (text + " " + context).lower()
    score = 0
    keywords_found = []
    
    # Vérifier les exclusions d'abord
    for keyword in EXCLUDE_KEYWORDS:
        if keyword.lower() in full_text:
            return (SCORE_WEIGHTS["exclude_penalty"], [f"EXCLU:{keyword}"])
    
    # Mots-clés éducation (prioritaires)
    for keyword in EDUCATION_KEYWORDS:
        if keyword.lower() in full_text:
            score += SCORE_WEIGHTS["education_keyword"]
            keywords_found.append(f"EDU:{keyword}")
    
    # Mots-clés IA
    for keyword in AI_KEYWORDS:
        if keyword.lower() in full_text:
            score += SCORE_WEIGHTS["ai_keyword"]
            keywords_found.append(f"IA:{keyword}")
    
    # Mots-clés gratuit
    for keyword in FREE_KEYWORDS:
        if keyword.lower() in full_text:
            score += SCORE_WEIGHTS["free_keyword"]
            keywords_found.append(f"FREE:{keyword}")
    
    # Bonus si URL présente
    if extract_urls(context):
        score += SCORE_WEIGHTS["has_url"]
        keywords_found.append("HAS_URL")
    
    return (score, keywords_found)


def analyze_newsletters(newsletters: List[Tuple[str, str]]) -> List[Tool]:
    """Analyse toutes les newsletters et extrait les outils pertinents."""
    all_tools = []
    seen_names = set()
    
    for filename, content in newsletters:
        print(f"\n🔍 Analyse de {filename}...")
        
        # Extraire les mentions d'outils
        tool_mentions = extract_tool_mentions(content)
        print(f"   → {len(tool_mentions)} mentions d'outils détectées")
        
        for mention in tool_mentions:
            name = mention["name"]
            
            # Éviter les doublons
            name_lower = name.lower()
            if name_lower in seen_names:
                continue
            
            # Calculer le score
            score, keywords = calculate_score(name, mention["context"])
            
            # Filtrer selon le seuil
            if score >= MIN_SCORE_THRESHOLD:
                seen_names.add(name_lower)
                
                # Extraire la première URL du contexte
                urls = extract_urls(mention["context"])
                url = urls[0] if urls else ""
                
                # Créer la description (première phrase du contexte)
                desc = mention["context"].split('.')[0].strip()
                if len(desc) > 150:
                    desc = desc[:147] + "..."
                
                tool = Tool(
                    name=name,
                    description=desc,
                    url=url,
                    score=score,
                    source_newsletter=filename,
                    keywords_found=keywords
                )
                all_tools.append(tool)
                print(f"   ✅ {name} (score: {score})")
    
    # Trier par score décroissant
    all_tools.sort(key=lambda t: t.score, reverse=True)
    
    # Limiter au nombre max
    return all_tools[:MAX_TOOLS_IN_DIGEST]


def generate_digest(tools: List[Tool]) -> str:
    """Génère le récapitulatif formaté en Markdown."""
    now = datetime.now()
    month_names_fr = [
        "", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ]
    
    month = month_names_fr[now.month]
    year = now.year
    
    digest = f"""# 🤖 Récap Veille Outils IA - {month} {year}

> **{len(tools)} outil(s)** pertinent(s) identifié(s) ce mois-ci.
> Généré automatiquement le {now.strftime('%d/%m/%Y à %H:%M')}

---

"""
    
    if not tools:
        digest += """
## Aucun nouvel outil ce mois-ci

Les newsletters analysées n'ont pas révélé de nouveaux outils correspondant à vos critères (éducation, formation, gratuit).

Soit c'est une période calme, soit les critères peuvent être ajustés dans `config.py`.
"""
    else:
        digest += "## 🏆 Top outils du mois\n\n"
        
        for i, tool in enumerate(tools, 1):
            # Emoji selon le rang
            if i == 1:
                emoji = "🥇"
            elif i == 2:
                emoji = "🥈"
            elif i == 3:
                emoji = "🥉"
            else:
                emoji = "📌"
            
            digest += f"""### {emoji} {i}. {tool.name}

**Score de pertinence** : {tool.score} points

{tool.description}

"""
            if tool.url:
                digest += f"🔗 **Lien** : {tool.url}\n\n"
            
            # Tags des mots-clés
            tags = " ".join([f"`{kw}`" for kw in tool.keywords_found[:5]])
            digest += f"**Tags** : {tags}\n\n"
            digest += f"*Source : {tool.source_newsletter}*\n\n"
            digest += "---\n\n"
    
    digest += """
## 📊 Statistiques

| Métrique | Valeur |
|----------|--------|
| Newsletters analysées | {newsletters_count} |
| Outils détectés | {tools_detected} |
| Outils retenus | {tools_kept} |

---

*Ce récap est généré automatiquement. Pour modifier les critères, éditez `config.py`.*
""".format(
        newsletters_count="[À compléter]",
        tools_detected="[À compléter]",
        tools_kept=len(tools)
    )
    
    return digest


def save_digest(digest: str, tools: List[Tool]) -> str:
    """Sauvegarde le digest et les données brutes."""
    now = datetime.now()
    output_path = Path(OUTPUT_DIR)
    output_path.mkdir(exist_ok=True)
    
    # Nom de fichier avec date
    date_str = now.strftime("%Y-%m")
    
    # Sauvegarder le Markdown
    md_file = output_path / f"digest-{date_str}.md"
    md_file.write_text(digest, encoding="utf-8")
    print(f"\n📝 Digest sauvegardé: {md_file}")
    
    # Sauvegarder les données JSON
    json_file = output_path / f"tools-{date_str}.json"
    tools_data = [asdict(t) for t in tools]
    json_file.write_text(json.dumps(tools_data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"📊 Données sauvegardées: {json_file}")
    
    return str(md_file)


def main():
    """Point d'entrée principal."""
    print("=" * 50)
    print("🤖 Agent de Veille Outils IA")
    print("=" * 50)
    print(f"📅 Exécution: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print()
    
    # Charger les newsletters
    print("📥 Chargement des newsletters...")
    newsletters = load_newsletters(NEWSLETTERS_DIR)
    
    if not newsletters:
        print("⚠️ Aucune newsletter trouvée dans", NEWSLETTERS_DIR)
        print("   Créez des fichiers .md dans ce dossier ou configurez Zapier.")
        return None, []
    
    print(f"\n📚 {len(newsletters)} newsletter(s) chargée(s)")
    
    # Analyser
    print("\n" + "=" * 50)
    print("🔍 Analyse en cours...")
    tools = analyze_newsletters(newsletters)
    
    print(f"\n✅ {len(tools)} outil(s) retenu(s) (seuil: {MIN_SCORE_THRESHOLD})")
    
    # Générer le digest
    print("\n" + "=" * 50)
    print("📝 Génération du récapitulatif...")
    digest = generate_digest(tools)
    
    # Sauvegarder
    digest_path = save_digest(digest, tools)
    
    print("\n" + "=" * 50)
    print("✨ Analyse terminée avec succès!")
    print("=" * 50)
    
    return digest_path, tools


if __name__ == "__main__":
    main()
