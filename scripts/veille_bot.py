#!/usr/bin/env python3
"""
Veille Bot - Automated tech watch for AI in education
Fetches RSS feeds and updates veille.html weekly
"""

import feedparser
import json
import os
import re
from html import escape
from datetime import datetime, timedelta
from pathlib import Path
import urllib.request
import urllib.error
from urllib.parse import urlsplit, urlunsplit
import socket
import sys
from bs4 import BeautifulSoup

# Set global timeout for all socket operations (including feedparser)
socket.setdefaulttimeout(15)

# Configuration
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "data"
VEILLE_JSON = DATA_DIR / "veille.json"        # publié — n'est plus écrit par défaut
INBOX_JSON = DATA_DIR / "veille-inbox.json"   # file d'attente, relue par enrich_inbox.py
VEILLE_HTML = PROJECT_DIR / "veille.html"
MAX_STORED_ARTICLES = 100
MAX_HTML_ITEMS_PER_MONTH = 100

# Sources RSS
RSS_SOURCES = {
    "Une IA par jour": "https://www.uneiaparjour.fr/feed",
    "Mathix (A. Durand)": "https://mathix.org/linux/feed",
    "OpenAI Blog": "https://openai.com/blog/rss.xml",
    "Google AI": "https://blog.google/technology/ai/rss/",
    "Perdir (Padlet)": "https://padlet.com/feed/frederic_vedrenne/l-ia-pour-les-perdir-yruwibp5pviv2te3",
}

# Comptes Twitter — DÉSACTIVÉS.
# nitter.net a été mis en demeure par X le 24 août 2026 et s'est arrêté le lendemain ;
# c'est la cause de l'arrêt de la veille le 27 août. Les flux ci-dessous ne répondent plus
# et ne reviendront pas. La couverture X passe désormais par les signets personnels :
#   veille-extension-v3 (export)  →  scripts/enrich_inbox.py  →  tools/valider-veille.html
TWITTER_SOURCES = {}

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
    "feedback", "appréciation", "compétences", "lycée", "collège",
    "école", "université", "académique", "didactique", "enseignant"
]

BUSINESS_KEYWORDS = [
    "crypto", "cryptomonnaie", "bitcoin", "nft", "blockchain",
    "bourse", "stocks", "trading", "investisseur", "levée de fonds",
    "fundraising", "startup", "licorne", "business", "marketing",
    "seo", "vente", "revenu", "profit", "marché", "finance",
    "banque", "assurance", "immobilier", "e-commerce", "publicité"
]

SPAM_KEYWORDS = [
    "casino", "poker", "viagra", "crédit", "rencontre", "sex",
    "porn", "arnaque", "betting", "gambling"
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
             print(f"Warning parsing {source_name}: {feed.bozo_exception}")

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
                "summary": clean_summary(entry.get("summary", ""))
            })
    except (socket.timeout, urllib.error.URLError) as e:
        print(f"Network error fetching {source_name}: {e}")
    except Exception as e:
        print(f"Error fetching {source_name}: {e}")
    return articles

def clean_summary(raw: str, limit: int = 400) -> str:
    """Nettoie un résumé de flux RSS sans jamais couper en plein mot.

    L'ancienne version faisait `raw[:200]`, ce qui produisait des résumés
    finissant sur « peuvent être importés t ». On retire le HTML, puis on
    coupe sur la dernière fin de phrase disponible ; à défaut, sur un mot.
    """
    if not raw:
        return ""
    text = BeautifulSoup(str(raw), "html.parser").get_text(" ")
    text = " ".join(text.split())
    if len(text) <= limit:
        return text
    head = text[:limit]
    cut = max(head.rfind(". "), head.rfind("! "), head.rfind("? "))
    if cut > limit * 0.5:
        return head[:cut + 1]
    cut = head.rfind(" ")
    return (head[:cut] if cut > 0 else head).rstrip(",;:") + "…"


def calculate_score(article: dict) -> int:
    """Calculate relevance score for an article"""
    score = 0
    text = (article.get('title', '') + " " + article.get('summary', '')).lower()
    
    # 1. Check Keywords
    # AI Keywords (+5 points each, max 15)
    ai_matches = sum(1 for kw in AI_KEYWORDS if kw in text)
    score += min(ai_matches * 5, 15)
    
    # Education Keywords (+10 points each, max 30)
    edu_matches = sum(1 for kw in EDUCATION_KEYWORDS if kw in text)
    score += min(edu_matches * 10, 30)
    
    # Business Keywords (-20 points each)
    biz_matches = sum(1 for kw in BUSINESS_KEYWORDS if kw in text)
    score -= biz_matches * 20
    
    # Spam Keywords (-100 points each)
    spam_matches = sum(1 for kw in SPAM_KEYWORDS if kw in text)
    score -= spam_matches * 100
    
    # 2. Source Bonus/Malus
    source = article.get('source', '')
    if "OpenAI" in source or "Google" in source or "Anthropic" in source:
        # Technical blogs provided they talk about new models are relevant
        # but could be business-oriented. We trust them a bit more on AI relevance.
        score += 5
    elif "Perdir" in source:
        # Curated source, highly trusted
        score += 20
        
    return score

def normalize_link(link: str) -> str:
    """Return a stable comparison key for an article URL."""
    link = str(link or '').strip()
    if not link:
        return ''
    parts = urlsplit(link)
    path = parts.path.rstrip('/') or '/'
    return urlunsplit((parts.scheme.lower(), parts.netloc.lower(), path, parts.query, ''))

def filter_ai_content(articles: list) -> list:
    """Filter articles based on score"""
    filtered = []
    seen_titles = set()
    
    print(f"Filtering {len(articles)} articles...")
    
    for article in articles:
        # Deduplication
        title_slug = re.sub(r'\W+', '', article['title'].lower())
        if title_slug in seen_titles:
            continue
        seen_titles.add(title_slug)
        
        # Scoring
        score = calculate_score(article)
        
        # Threshold logic
        # Default threshold is 10
        # This means:
        # - 1 Edu keyword (10) = Pass
        # - 2 AI keywords (10) = Pass
        # - 1 AI + 1 Edu (15) = Pass
        # - 1 AI (5) = Fail
        # - 1 Edu + 1 Business (10-20 = -10) = Fail
        
        # For trusted sources (Perdir), they get +20 bonus so they almost always pass unless spam
        
        if score >= 10:
            # print(f"  [KEEP] Score {score}: {article['title']}") # Debug
            filtered.append(article)
        else:
            # print(f"  [DROP] Score {score}: {article['title']}") # Debug
            pass
            
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
        title = str(article.get('title', 'Sans titre'))
        link = str(article.get('link', ''))
        source = str(article.get('source', 'Source inconnue'))
        tag_class = "update-new" if "nouveau" in title.lower() else "update-update"
        html_items.append(f'''
                                <div class="update-item {tag_class}">
                                    <span class="update-tag">Nouveau</span>
                                    <div class="update-content">
                                        <strong><a href="{escape(link, quote=True)}" target="_blank" rel="noopener">{escape(title)}</a></strong>
                                        <span class="update-source">— {escape(source)}</span>
                                    </div>
                                </div>''')
    
    return "\n".join(html_items)

def update_veille_html(new_articles: list):
    """Update veille.html with new content, handling month transitions"""
    if not VEILLE_HTML.exists():
        print("veille.html not found")
        return
    
    with open(VEILLE_HTML, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Generate new update items
    new_html = generate_html_updates(new_articles)

    soup = BeautifulSoup(html, 'html.parser')
    
    # French month names mapping
    months_fr = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
                 "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    now = datetime.now()
    current_month_str = f"{months_fr[now.month - 1]} {now.year}"

    # Keep the page header synchronized even when a run finds no new article.
    # Le bandeau porte une date validée à la main : le bot ne la réécrit plus.
    # (L'ancienne version y réinjectait « 🆕 Mis à jour : <mois> » à chaque exécution,
    #  écrasant toute correction éditoriale.)

    if not new_articles:
        with open(VEILLE_HTML, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print("No new articles to include; header synchronized.")
        return
    
    # Find the container for monthly updates
    # We look for the h2 with "Mises à jour mensuelles"
    monthly_section_title = None
    
    # Method 1: Find by text content (robust to nested tags)
    for h2 in soup.find_all('h2'):
        if "Mises à jour mensuelles" in h2.get_text():
            monthly_section_title = h2
            break
            
    # Method 2: Find specifically by class if Method 1 fails
    if not monthly_section_title:
        monthly_section_title = soup.find('h2', class_='section-title-veille')
        # verify text just in case
        if monthly_section_title and "Mises à jour mensuelles" not in monthly_section_title.get_text():
             # If the first one isn't it, look at others
             for h2 in soup.find_all('h2', class_='section-title-veille'):
                 if "Mises à jour mensuelles" in h2.get_text():
                     monthly_section_title = h2
                     break
    
    if not monthly_section_title:
        print("Could not find 'Mises à jour mensuelles' section.")
        return

    # The cards are siblings after the h2, or in a container? 
    # In the file: <h2...></h2> <article class="update-card" ...>
    # They seem to be siblings of the h2 in the same parent section.
    
    # Find the first article card after the title
    first_card = monthly_section_title.find_next_sibling('article', class_='update-card')
    
    current_card = None
    if first_card:
        # Check if it corresponds to the current month
        month_span = first_card.find('span', class_='update-month')
        if month_span and month_span.text.strip() == current_month_str:
            current_card = first_card
            print(f"Found existing card for {current_month_str}")
    
    if current_card:
        # Append to existing card
        items_container = current_card.find('div', class_='update-items')
        if items_container:
            # We need to prepend new items to the top of the items list in this card? 
            # Or append? Usually specific updates are at the top.
            # Parse new HTML fragment
            new_items_soup = BeautifulSoup(new_html, 'html.parser')
            # Insert at beginning of items_container
            if items_container.contents:
                items_container.insert(0, new_items_soup)
            else:
                items_container.append(new_items_soup)
            # Keep one month readable even if a feed suddenly produces a
            # large burst of relevant items. Older months are left untouched
            # until the dedicated history migration is approved.
            month_items = items_container.find_all('div', class_='update-item', recursive=False)
            for old_item in month_items[MAX_HTML_ITEMS_PER_MONTH:]:
                old_item.decompose()
    else:
        print(f"Creating new card for {current_month_str}")
        
        # 1. Demote old current card if it exists
        if first_card and 'update-card-current' in first_card.get('class', []):
            first_card['class'].remove('update-card-current')
            # Remove "Actuel" badge
            badge = first_card.find('span', class_='update-badge')
            if badge:
                badge.decompose()
        
        # 2. Create new card
        new_card_html = f'''
        <article class="update-card update-card-current">
            <div class="update-header">
                <span class="update-month">{current_month_str}</span>
                <span class="update-badge">Actuel</span>
            </div>
            <div class="update-items">
                {new_html}
            </div>
        </article>
        '''
        new_card_soup = BeautifulSoup(new_card_html, 'html.parser')
        
        # 3. Insert after the title
        monthly_section_title.insert_after(new_card_soup)

    # Save changes
    with open(VEILLE_HTML, 'w', encoding='utf-8') as f:
        f.write(str(soup)) # soup.prettify() might mess up formatting, str() is safer for minor edits but check output
        
    print(f"Updated veille.html with {len(new_articles)} new articles")

def queue_for_review(articles: list):
    """Dépose les articles dans la boîte de réception, sans rien publier.

    Rien n'apparaît sur le site tant que ces entrées n'ont pas été enrichies
    (scripts/enrich_inbox.py) puis validées (tools/valider-veille.html).
    """
    DATA_DIR.mkdir(exist_ok=True)
    inbox = {"items": [], "last_update": None}
    if INBOX_JSON.exists():
        try:
            with open(INBOX_JSON, encoding='utf-8') as f:
                inbox = json.load(f)
        except (json.JSONDecodeError, OSError):
            print(f"  ! {INBOX_JSON.name} illisible, il sera reconstruit")

    known = {normalize_link(i.get('link', '')) for i in inbox.get('items', [])}
    fresh = []
    for a in articles:
        key = normalize_link(a.get('link', ''))
        if not key or key in known:
            continue
        known.add(key)
        fresh.append({
            "key": key, "link": a.get('link'), "date": a.get('date'),
            "source": a.get('source'), "origine": "rss", "status": "brut",
            "raw_text": f"{a.get('title', '')}. {a.get('summary', '')}".strip(),
            "links": [], "titre": "", "resume": "",
        })

    inbox['items'] = fresh + inbox.get('items', [])
    inbox['last_update'] = datetime.now().isoformat(timespec='seconds')
    with open(INBOX_JSON, 'w', encoding='utf-8') as f:
        json.dump(inbox, f, ensure_ascii=False, indent=2)
    print(f"{len(fresh)} article(s) déposé(s) dans {INBOX_JSON.name} "
          f"({len(inbox['items'])} en attente de relecture).")
    print("Suite : python scripts/enrich_inbox.py --rss")


def main():
    print("Veille Bot - Starting...")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    
    # Load existing data
    data = load_existing_data()
    existing_links = {normalize_link(a.get('link', '')) for a in data['articles']}
    pending_links = set()
    if not LEGACY_MODE and INBOX_JSON.exists():
        try:
            with open(INBOX_JSON, encoding='utf-8') as f:
                pending_links = {
                    normalize_link(item.get('link', ''))
                    for item in json.load(f).get('items', [])
                }
        except (json.JSONDecodeError, OSError):
            print(f"Warning: {INBOX_JSON.name} could not be read; pending items will be rechecked.")
    
    # Fetch all RSS feeds
    all_articles = []
    for source, url in RSS_SOURCES.items():
        print(f"Fetching {source}...")
        articles = fetch_rss(url, source)
        all_articles.extend(articles)
    
    # Fetch Twitter feeds via Nitter (links converted to twitter.com)
    for source, url in TWITTER_SOURCES.items():
        print(f"Fetching {source} (Twitter)...")
        articles = fetch_rss(url, source, is_twitter=True)
        all_articles.extend(articles)
    
    print(f"Total fetched: {len(all_articles)} articles")
    
    # Filter for AI content
    ai_articles = filter_ai_content(all_articles)
    print(f"AI-related: {len(ai_articles)} articles")
    
    # Find new articles
    new_articles = [
        a for a in ai_articles
        if normalize_link(a.get('link', '')) not in existing_links
        and normalize_link(a.get('link', '')) not in pending_links
    ]
    print(f"New articles: {len(new_articles)}")
    
    if new_articles:
        if LEGACY_MODE:
            # Ancien comportement : publication directe, sans relecture humaine.
            data['articles'] = new_articles + data['articles']
            data['articles'] = data['articles'][:MAX_STORED_ARTICLES]
            data['last_update'] = datetime.now().isoformat()
            save_data(data)
            update_veille_html(new_articles)
        else:
            queue_for_review(new_articles)

    print("Done!")
    return len(new_articles)

LEGACY_MODE = "--legacy" in sys.argv   # republication directe, sans relecture

if __name__ == "__main__":
    main()
