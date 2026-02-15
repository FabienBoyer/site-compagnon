#!/usr/bin/env python3
"""
Veille Bot - Automated tech watch for AI in education
Fetches RSS feeds and updates veille.html weekly
"""

import feedparser
import json
import os
import re
from datetime import datetime, timedelta
from pathlib import Path
import urllib.request
import urllib.error
import socket

# Set global timeout for all socket operations (including feedparser)
socket.setdefaulttimeout(15)

# Configuration
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "data"
VEILLE_JSON = DATA_DIR / "veille.json"
VEILLE_HTML = PROJECT_DIR / "veille.html"

# Sources RSS
RSS_SOURCES = {
    "Une IA par jour": "https://www.uneiaparjour.fr/feed",
    "Mathix (A. Durand)": "https://mathix.org/linux/feed",
    "OpenAI Blog": "https://openai.com/blog/rss.xml",
    "Google AI": "https://blog.google/technology/ai/rss/",
    "Perdir (Padlet)": "https://padlet.com/feed/frederic_vedrenne/l-ia-pour-les-perdir-yruwibp5pviv2te3",
}

# Twitter accounts via Nitter (open-source Twitter mirror)
TWITTER_SOURCES = {
    "@nsi_xyz": "https://nitter.net/nsi_xyz/rss",
    "@sophiaefrance": "https://nitter.net/sophiaefrance/rss",
    # Official AI Labs
    "@AnthropicAI": "https://nitter.net/AnthropicAI/rss",
    "@MistralAI": "https://nitter.net/MistralAI/rss",
    "@deepseek_ai": "https://nitter.net/deepseek_ai/rss",
    "@OpenAI": "https://nitter.net/OpenAI/rss",
    # EdTech Community
    "@outiltice": "https://nitter.net/outiltice/rss",
    "@Fabien_Mikol": "https://nitter.net/Fabien_Mikol/rss",
    "@MIKL_Bertrand": "https://nitter.net/MIKL_Bertrand/rss",
}

# Keywords to filter AI-related content
AI_KEYWORDS = [
    # IA générale
    "ia", "ai", "intelligence artificielle", "artificial intelligence",
    "chatgpt", "claude", "gemini", "gpt", "llm", "machine learning",
    "deep learning", "neural", "génératif", "generative", "mistral",
    "openai", "anthropic", "llama", "deepseek", "qwen", "falcon",
    "perplexity", "copilot", "midjourney", "stable diffusion",
    # Concepts spécifiques IA
    "prompt", "prompting", "token", "chatbot", "agent", "rag",
    "rag", "fine-tuning",
    # Éducation + IA (combinaisons)
    "ia en classe", "ia à l'école", "ia pour les profs", "ia pédagogique"
]

EDUCATION_KEYWORDS = [
    "éducation", "enseignement", "pédagogie", "élève", "professeur",
    "classe", "cours", "apprentissage", "formation",
    "correction", "copies", "évaluation", "notation", "barème",
    "feedback", "appréciation", "compétences"
]

def nitter_to_twitter(url: str) -> str:
    """Convert Nitter URL to Twitter/X URL"""
    if "nitter" in url.lower():
        # Replace nitter.net (or any nitter instance) with twitter.com
        url = re.sub(r'https?://[^/]*nitter[^/]*/','https://twitter.com/', url)
    return url

def fetch_rss(url: str, source_name: str, is_twitter: bool = False) -> list:
    """Fetch and parse RSS feed"""
    articles = []
    try:
        feed = feedparser.parse(url)
        
        # Check if feedparser encountered an error (bozo exception)
        if feed.bozo:
             # Just log it but try to process entries if any
             print(f"⚠️ Warning parsing {source_name}: {feed.bozo_exception}")

        for entry in feed.entries[:10]:  # Last 10 entries
            pub_date = None
            if hasattr(entry, 'published_parsed') and entry.published_parsed:
                pub_date = datetime(*entry.published_parsed[:6]).isoformat()
            elif hasattr(entry, 'updated_parsed') and entry.updated_parsed:
                pub_date = datetime(*entry.updated_parsed[:6]).isoformat()
            
            # Get the link and convert if from Nitter
            link = entry.get("link", "")
            if is_twitter:
                link = nitter_to_twitter(link)
            
            articles.append({
                "title": entry.get("title", "Sans titre"),
                "link": link,
                "date": pub_date or datetime.now().isoformat(),
                "source": source_name,
                "summary": entry.get("summary", "")[:200] if entry.get("summary") else ""
            })
    except (socket.timeout, urllib.error.URLError) as e:
        print(f"❌ Network error fetching {source_name}: {e}")
    except Exception as e:
        print(f"❌ Error fetching {source_name}: {e}")
    return articles

def filter_ai_content(articles: list) -> list:
    """Filter articles related to AI"""
    filtered = []
    for article in articles:
        text = f"{article['title']} {article['summary']}".lower()
        
        # Check for AI keywords (Mandatory)
        has_ai = any(kw in text for kw in AI_KEYWORDS)
        
        # Check for Education keywords (Optional context, but kept as requested)
        has_edu = any(kw in text for kw in EDUCATION_KEYWORDS)
        
        # Logic: Must have AI keywords. 
        # Education keywords alone are not enough (avoids generic education news),
        # but they are preserved in the codebase for potential future scoring/tagging.
        if has_ai:
            filtered.append(article)
    return filtered

def load_existing_data() -> dict:
    """Load existing veille data"""
    if VEILLE_JSON.exists():
        with open(VEILLE_JSON, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"articles": [], "last_update": None}

def save_data(data: dict):
    """Save veille data to JSON"""
    DATA_DIR.mkdir(exist_ok=True)
    with open(VEILLE_JSON, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def generate_html_updates(articles: list) -> str:
    """Generate HTML for new articles"""
    if not articles:
        return ""
    
    html_items = []
    for article in articles[:20]:  # Top 20 most recent
        tag_class = "update-new" if "nouveau" in article.get('title', '').lower() else "update-update"
        html_items.append(f'''
                                <div class="update-item {tag_class}">
                                    <span class="update-tag">Nouveau</span>
                                    <div class="update-content">
                                        <strong><a href="{article['link']}" target="_blank" rel="noopener">{article['title']}</a></strong>
                                        <span class="update-source">— {article['source']}</span>
                                    </div>
                                </div>''')
    
    return "\n".join(html_items)

def update_veille_html(new_articles: list):
    """Update veille.html with new content, handling month transitions"""
    if not VEILLE_HTML.exists():
        print("veille.html not found")
        return
    
    if not new_articles:
        print("No new articles to include.")
        return

    with open(VEILLE_HTML, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Generate new update items
    new_html = generate_html_updates(new_articles)
    
    # Logic to check the current month section
    # We use French month names as used in existing HTML
    months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
              "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    now = datetime.now()
    current_month_str = f"{months[now.month - 1]} {now.year}"
    
    # Check if current month section exists as the "current" card
    # Pattern: <article class="update-card update-card-current">...<span class="update-month">MONTH YEAR</span>
    # We accept checking for the string inside the first update-card-current
    
    is_same_month = False
    
    # Extract the month from the current card using regex
    match = re.search(r'<article class="update-card update-card-current">.*?<span class="update-month">(.*?)</span>', html, re.DOTALL)
    
    if match:
        existing_month = match.group(1).strip()
        print(f"Current section in HTML is: {existing_month}")
        if existing_month == current_month_str:
            is_same_month = True
    
    if is_same_month:
        print(f"Same month ({current_month_str}). Appending to existing section.")
        # Simple replacement - add after update-items div
        marker = '<div class="update-items">'
        if marker in html:
            # Insert AFTER the marker
            html = html.replace(marker, marker + new_html, 1)
    else:
        print(f"New month detected ({current_month_str})! Creating new section.")
        
        # 1. Archive the old current section (if any)
        # Remove 'update-card-current' class and 'Actuel' badge from the OLD current card
        # Regex replacement to turn the first update-card-current into update-card
        # and remove the "Actuel" badge inside it.
        
        # We process the file content. 
        # First, find the start of the current card to ensure we edit the right one.
        if match:
             # We need to replace "update-card update-card-current" with "update-card" for the first occurrence
             html = html.replace('class="update-card update-card-current"', 'class="update-card"', 1)
             
             # Remove the <span class="update-badge">Actuel</span> (first occurrence)
             html = html.replace('<span class="update-badge">Actuel</span>', '', 1)
        
        # 2. Create the new section
        new_section = f'''<article class="update-card update-card-current">
                            <div class="update-header"><span class="update-month">{current_month_str}</span><span
                                    class="update-badge">Actuel</span></div>
                            <div class="update-items">{new_html}
                            </div>
                        </article>'''
        
        # 3. Insert new section at the top of the list
        # We look for the container header
        insert_marker = '<h2 class="section-title-veille"><i data-lucide="calendar"></i>Mises à jour mensuelles</h2>'
        if insert_marker in html:
            html = html.replace(insert_marker, insert_marker + '\n' + new_section, 1)
        
    with open(VEILLE_HTML, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Updated veille.html with {len(new_articles)} new articles")

def main():
    print("🤖 Veille Bot - Starting...")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    
    # Load existing data
    data = load_existing_data()
    existing_links = {a['link'] for a in data['articles']}
    
    # Fetch all RSS feeds
    all_articles = []
    for source, url in RSS_SOURCES.items():
        print(f"📡 Fetching {source}...")
        articles = fetch_rss(url, source)
        all_articles.extend(articles)
    
    # Fetch Twitter feeds via Nitter (links converted to twitter.com)
    for source, url in TWITTER_SOURCES.items():
        print(f"🐦 Fetching {source}...")
        articles = fetch_rss(url, source, is_twitter=True)
        all_articles.extend(articles)
    
    print(f"📥 Total fetched: {len(all_articles)} articles")
    
    # Filter for AI content
    ai_articles = filter_ai_content(all_articles)
    print(f"🎯 AI-related: {len(ai_articles)} articles")
    
    # Find new articles
    new_articles = [a for a in ai_articles if a['link'] not in existing_links]
    print(f"✨ New articles: {len(new_articles)}")
    
    if new_articles:
        # Update data
        data['articles'] = new_articles + data['articles']
        data['articles'] = data['articles'][:100]  # Keep last 100
        data['last_update'] = datetime.now().isoformat()
        save_data(data)
        
    # Always update HTML with latest data (top 20)
    update_veille_html(data['articles'])
    
    print("✅ Done!")
    return len(new_articles)

if __name__ == "__main__":
    main()
