#!/usr/bin/env python3
"""
Bridge Integration Script
=========================
Parses the latest monthly JSON file from veille-outils-ia/output/
and integrates the discovered tools into the main website pages:
- index.html (Veille card description)
- outils.html (main tools grid with interactive filters)
- veille.html (summary card under monthly updates)
"""

import os
import re
import json
import glob
from datetime import datetime

# French months mapping
MONTHS_FR = {
    "01": "Janvier",
    "02": "Février",
    "03": "Mars",
    "04": "Avril",
    "05": "Mai",
    "06": "Juin",
    "07": "Juillet",
    "08": "Août",
    "09": "Septembre",
    "10": "Octobre",
    "11": "Novembre",
    "12": "Décembre"
}

def get_latest_tools_file():
    """Finds the latest tools JSON file in veille-outils-ia/output/."""
    pattern = os.path.join("veille-outils-ia", "output", "tools-*.json")
    files = glob.glob(pattern)
    if not files:
        # Check current directory fallback
        pattern = os.path.join("output", "tools-*.json")
        files = glob.glob(pattern)
        
    if not files:
        print("⚠️ No tools JSON files found in veille-outils-ia/output/ or output/")
        return None
    
    # Sort files by name (which has YYYY-MM and will naturally put the latest last)
    files.sort()
    return files[-1]

def map_keywords_to_tags(keywords):
    """Maps keywords detected by the bot to standard filtering tags."""
    tags = ["all"]
    
    # Check for gratuit / free
    is_free = False
    for kw in keywords:
        kw_l = kw.lower()
        if "gratuit" in kw_l or "free" in kw_l:
            is_free = True
            break
    
    if is_free:
        tags.append("gratuit")
        
    # Check for sans-compte / no account
    is_no_account = False
    for kw in keywords:
        kw_l = kw.lower()
        if "sans-compte" in kw_l or "sans compte" in kw_l or "no account" in kw_l:
            is_no_account = True
            break
            
    if is_no_account:
        tags.append("sans-compte")
        
    # Check for French/EU
    is_fr_eu = False
    for kw in keywords:
        kw_l = kw.lower()
        if "fr-eu" in kw_l or "france" in kw_l or "europe" in kw_l or "souverain" in kw_l:
            is_fr_eu = True
            break
            
    if is_fr_eu:
        tags.append("fr-eu")
        
    # Default school levels for tool watch to make them visible under typical filters
    tags.extend(["primaire", "college", "lycee", "superieur"])
    
    return ",".join(tags)

def update_index_html(tools_list, month_str):
    """Updates the Veille card description on index.html."""
    filepath = "index.html"
    if not os.path.exists(filepath):
        print(f"⚠️ {filepath} not found")
        return
        
    names = [t["name"] for t in tools_list]
    tools_summary = " • ".join(names)
    
    new_content = f"<strong>Dernière veille ({month_str}) :</strong> {tools_summary}"
    
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
        
    # Replace content between comments
    pattern = r"<!--\s*VEILLE_OUTILS_IA_START\s*-->.*?<!--\s*VEILLE_OUTILS_IA_END\s*-->"
    replacement = f"<!-- VEILLE_OUTILS_IA_START -->\n                        {new_content}\n                        <!-- VEILLE_OUTILS_IA_END -->"
    
    if re.search(pattern, html, re.DOTALL):
        updated_html = re.sub(pattern, replacement, html, flags=re.DOTALL)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(updated_html)
        print(f"✅ index.html updated successfully with: {tools_summary}")
    else:
        print("⚠️ index.html does not contain VEILLE_OUTILS_IA placeholder tags!")

def update_outils_html(tools_list, month_str):
    """Updates the tools list inside outils.html."""
    filepath = "outils.html"
    if not os.path.exists(filepath):
        print(f"⚠️ {filepath} not found")
        return
        
    cards_html = []
    for tool in tools_list:
        tags = map_keywords_to_tags(tool.get("keywords_found", []))
        
        # Decide tags badges
        badges = []
        if "gratuit" in tags:
            badges.append('<span class="tag tag-green">Gratuit</span>')
        else:
            badges.append('<span class="tag tag-orange">Abonnement</span>')
            
        if "sans-compte" in tags:
            badges.append('<span class="tag tag-blue">Sans compte</span>')
            
        badges_html = "\n                            ".join(badges)
        
        # Select an icon based on score/keywords
        icon = "sparkles"
        if "quiz" in str(tool.get("keywords_found", [])).lower():
            icon = "clipboard-list"
        elif "cours" in str(tool.get("keywords_found", [])).lower():
            icon = "book-open"
        elif "exercice" in str(tool.get("keywords_found", [])).lower():
            icon = "calculator"
            
        card = f"""                <!-- Tool parsed from Veille: {tool['name']} -->
                <article class="outil-card" data-tags="{tags}">
                    <div class="outil-header">
                        <div class="outil-icon outil-icon-green">
                            <i data-lucide="{icon}"></i>
                        </div>
                        <div class="outil-tags">
                            <span class="tag tag-purple">Veille {month_str}</span>
                            {badges_html}
                        </div>
                    </div>
                    <h3 class="outil-title">{tool['name']}</h3>
                    <p class="outil-category">Curation Auto • Score {tool['score']}/100</p>
                    <p class="outil-description">
                        {tool['description']}. (Source: {tool.get('source_newsletter', 'Newsletter Watch')})
                    </p>
                    <div class="outil-meta">
                        <span class="meta-item">
                            <i data-lucide="users"></i>
                            Recommandé enseignants
                        </span>
                    </div>
                    <a href="{tool['url']}" target="_blank" rel="noopener" class="btn btn-secondary outil-btn">
                        <i data-lucide="external-link"></i>
                        Découvrir
                    </a>
                </article>"""
        cards_html.append(card)
        
    new_content = "\n\n".join(cards_html)
    
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
        
    pattern = r"<!--\s*VEILLE_OUTILS_IA_START\s*-->.*?<!--\s*VEILLE_OUTILS_IA_END\s*-->"
    replacement = f"<!-- VEILLE_OUTILS_IA_START -->\n{new_content}\n                <!-- VEILLE_OUTILS_IA_END -->"
    
    if re.search(pattern, html, re.DOTALL):
        updated_html = re.sub(pattern, replacement, html, flags=re.DOTALL)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(updated_html)
        print(f"✅ outils.html updated successfully with {len(tools_list)} cards")
    else:
        print("⚠️ outils.html does not contain VEILLE_OUTILS_IA placeholder tags!")

def update_veille_html(tools_list, month_str):
    """Inserts a beautiful summary card under monthly updates on veille.html."""
    filepath = "veille.html"
    if not os.path.exists(filepath):
        print(f"⚠️ {filepath} not found")
        return
        
    items_html = []
    for tool in tools_list:
        item = f"""        <div class="update-item update-update">
            <span class="update-tag" style="background: var(--primary-color);">Score {tool['score']}</span>
            <div class="update-content">
                <strong><a href="{tool['url']}" rel="noopener" target="_blank">{tool['name']}</a></strong>
                <span style="opacity:0.8;"> — {tool['description']}</span>
            </div>
        </div>"""
        items_html.append(item)
        
    items_block = "\n".join(items_html)
    
    card_html = f"""<article class="update-card update-card-current" style="border: 1px solid rgba(139, 92, 246, 0.25); background: rgba(139, 92, 246, 0.05); backdrop-filter: blur(10px);">
    <div class="update-header">
        <span class="update-month">Veille Curation Automatique — {month_str}</span>
        <span class="update-badge" style="background: var(--primary-color); color: white;">Curation IA</span>
    </div>
    <div class="update-items">
        <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <p style="margin: 0; font-size: 0.95rem;">Curation intelligente de newsletters effectuée par l'agent de veille automatique. <strong>{len(tools_list)} outils pertinents</strong> ont été identifiés et retenus ce mois-ci pour les enseignants.</p>
        </div>
{items_block}
    </div>
</article>"""

    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
        
    pattern = r"<!--\s*VEILLE_OUTILS_IA_START\s*-->.*?<!--\s*VEILLE_OUTILS_IA_END\s*-->"
    replacement = f"<!-- VEILLE_OUTILS_IA_START -->\n{card_html}\n<!-- VEILLE_OUTILS_IA_END -->"
    
    if re.search(pattern, html, re.DOTALL):
        updated_html = re.sub(pattern, replacement, html, flags=re.DOTALL)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(updated_html)
        print(f"✅ veille.html updated successfully with curation digest card")
    else:
        print("⚠️ veille.html does not contain VEILLE_OUTILS_IA placeholder tags!")

def main():
    import sys
    if sys.platform == 'win32':
        try:
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        except AttributeError:
            pass
            
    print("=" * 60)
    print("🔄 Starting Curation Bridge Integration...")
    print("=" * 60)
    
    latest_file = get_latest_tools_file()
    if not latest_file:
        return
        
    print(f"📄 Found latest tools file: {latest_file}")
    
    # Parse date from name, e.g. tools-2026-02.json
    filename = os.path.basename(latest_file)
    date_match = re.search(r"tools-(\d{4})-(\d{2})\.json", filename)
    if date_match:
        year = date_match.group(1)
        month = date_match.group(2)
        month_name = MONTHS_FR.get(month, "Inconnu")
        month_str = f"{month_name} {year}"
    else:
        month_str = datetime.now().strftime("%B %Y")
        
    print(f"📅 Target Month: {month_str}")
    
    with open(latest_file, "r", encoding="utf-8") as f:
        tools_list = json.load(f)
        
    if not tools_list:
        print("⚠️ The tools list is empty. Nothing to integrate.")
        return
        
    print(f"🔍 Loaded {len(tools_list)} tools from curation output.")
    
    # Update pages
    update_index_html(tools_list, month_str)
    update_outils_html(tools_list, month_str)
    update_veille_html(tools_list, month_str)
    
    print("\n✨ Curation Bridge Integration completed successfully!")
    print("=" * 60)

if __name__ == "__main__":
    main()
