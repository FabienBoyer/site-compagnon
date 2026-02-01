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
}

# Twitter accounts via Nitter (open-source Twitter mirror)
TWITTER_SOURCES = {
    "@nsi_xyz": "https://nitter.net/nsi_xyz/rss",
    "@sophiaefrance": "https://nitter.net/sophiaefrance/rss",
}

# Keywords to filter AI-related content
AI_KEYWORDS = [
    "ia", "ai", "intelligence artificielle", "artificial intelligence",
    "chatgpt", "claude", "gemini", "gpt", "llm", "machine learning",
    "deep learning", "neural", "génératif", "generative", "mistral",
    "openai", "anthropic", "éducation", "enseignement", "pédagogie"
]

def fetch_rss(url: str, source_name: str) -> list:
    """Fetch and parse RSS feed"""
    articles = []
    try:
        feed = feedparser.parse(url)
        for entry in feed.entries[:10]:  # Last 10 entries
            pub_date = None
            if hasattr(entry, 'published_parsed') and entry.published_parsed:
                pub_date = datetime(*entry.published_parsed[:6]).isoformat()
            elif hasattr(entry, 'updated_parsed') and entry.updated_parsed:
                pub_date = datetime(*entry.updated_parsed[:6]).isoformat()
            
            articles.append({
                "title": entry.get("title", "Sans titre"),
                "link": entry.get("link", ""),
                "date": pub_date or datetime.now().isoformat(),
                "source": source_name,
                "summary": entry.get("summary", "")[:200] if entry.get("summary") else ""
            })
    except Exception as e:
        print(f"Error fetching {source_name}: {e}")
    return articles

def filter_ai_content(articles: list) -> list:
    """Filter articles related to AI"""
    filtered = []
    for article in articles:
        text = f"{article['title']} {article['summary']}".lower()
        if any(kw in text for kw in AI_KEYWORDS):
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
    for article in articles[:5]:  # Top 5 most recent
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
    """Update veille.html with new content"""
    if not VEILLE_HTML.exists():
        print("veille.html not found")
        return
    
    with open(VEILLE_HTML, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Generate new update items
    new_html = generate_html_updates(new_articles)
    
    # Find and update the current month section
    current_month = datetime.now().strftime("%B %Y").capitalize()
    
    # Simple replacement - add after update-items div
    marker = '<div class="update-items">'
    if marker in html and new_html:
        html = html.replace(marker, marker + new_html, 1)
        
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
    
    # Fetch Twitter feeds via Nitter
    for source, url in TWITTER_SOURCES.items():
        print(f"🐦 Fetching {source}...")
        articles = fetch_rss(url, source)
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
        
        # Update HTML
        update_veille_html(new_articles)
    
    print("✅ Done!")
    return len(new_articles)

if __name__ == "__main__":
    main()
