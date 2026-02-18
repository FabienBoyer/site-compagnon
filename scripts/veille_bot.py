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
from bs4 import BeautifulSoup

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
                "summary": entry.get("summary", "")[:200] if entry.get("summary") else ""
            })
    except (socket.timeout, urllib.error.URLError) as e:
        print(f"Network error fetching {source_name}: {e}")
    except Exception as e:
        print(f"Error fetching {source_name}: {e}")
    return articles

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

    soup = BeautifulSoup(html, 'html.parser')
    
    # French month names mapping
    months_fr = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
                 "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    now = datetime.now()
    current_month_str = f"{months_fr[now.month - 1]} {now.year}"
    
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

def main():
    print("Veille Bot - Starting...")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    
    # Load existing data
    data = load_existing_data()
    existing_links = {a['link'] for a in data['articles']}
    
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
    new_articles = [a for a in ai_articles if a['link'] not in existing_links]
    print(f"New articles: {len(new_articles)}")
    
    if new_articles:
        # Update data
        data['articles'] = new_articles + data['articles']
        data['articles'] = data['articles'][:100]  # Keep last 100
        data['last_update'] = datetime.now().isoformat()
        save_data(data)
        
    # Always update HTML with latest data (top 20)
    update_veille_html(data['articles'])
    
    print("Done!")
    return len(new_articles)

if __name__ == "__main__":
    main()
