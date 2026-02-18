
import bs4
from bs4 import BeautifulSoup
from datetime import datetime
import json
import re

# Configuration for next time:
# 1. Save your Twitter bookmarks as 'bookmarks.html' in this folder
# 2. Update the CUTOFF_DATE below if needed
FILE_PATH = "bookmarks.html"
OUTPUT_FILE = "signets_twitter_extracted.html"
CUTOFF_DATE = datetime.now() # Default to today, or set specific date: datetime(2026, 1, 20)

def clean_text(text):
    return text.replace('\n', ' ').strip()

def fix_link(url):
    if not url: return ""
    if url.startswith("https://"):
        return url
    return f"https://twitter.com{url}"

def parse_bookmarks():
    print(f"Reading {FILE_PATH}...")
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            html = f.read()
    except UnicodeDecodeError:
        print("UTF-8 decode failed, trying cp1252...")
        with open(FILE_PATH, "r", encoding="cp1252") as f:
            html = f.read()
    
    soup = BeautifulSoup(html, "html.parser")
    articles = soup.find_all("article")
    
    print(f"Found {len(articles)} total articles. Filtering...")
    
    valid_bookmarks = []
    
    for article in articles:
        # Extract Date
        time_tag = article.find("time")
        if not time_tag:
            continue
            
        date_str = time_tag.get("datetime")
        if not date_str:
            continue
            
        try:
            # Parse date (ISO format with Z)
            dt = datetime.strptime(date_str.replace("Z", "+0000"), "%Y-%m-%dT%H:%M:%S.%f%z")
            # Convert to naive date for comparison or keep timezone aware
            # Let's compare just the date part
            article_date = dt.date()
            if article_date > CUTOFF_DATE.date():
                continue # Skip newer articles
        except ValueError as e:
            print(f"Error parsing date {date_str}: {e}")
            continue

        # Extract Text
        tweet_text_div = article.find("div", {"data-testid": "tweetText"})
        text = tweet_text_div.get_text(separator=" ").strip() if tweet_text_div else ""
        
        # Extract Link
        link = ""
        links = article.find_all("a")
        for a in links:
            href = a.get("href", "")
            if "/status/" in href:
                # Some hrefs might be relative, some absolute
                if href.startswith("http"):
                    link = href
                else:
                    link = f"https://twitter.com{href}"
                break
        
        # Extract Author & Handle
        user_div = article.find("div", {"data-testid": "User-Name"})
        author = "Unknown"
        handle = ""
        if user_div:
            user_text = user_div.get_text(separator="|").strip()
            parts = user_text.split('|')
            author = parts[0] if parts else "Unknown"
            # Try to find handle starting with @
            for p in parts:
                if p.strip().startswith('@'):
                    handle = p.strip()
                    break
        
        # Determine Source Name (Author + Handle)
        source_name = f"{author} ({handle})" if handle else author
        
        valid_bookmarks.append({
            "date": dt,
            "date_display": dt.strftime("%d/%m/%Y"),
            "text": text,
            "link": link,
            "source": source_name
        })
    
    # Sort by date descending
    valid_bookmarks.sort(key=lambda x: x["date"], reverse=True)
    
    print(f"Kept {len(valid_bookmarks)} bookmarks <= {CUTOFF_DATE.date()}.")
    
    # Generate HTML Output
    html_content = generate_html(valid_bookmarks)
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"Successfully generated {OUTPUT_FILE}")

def generate_html(bookmarks):
    items_html = ""
    for b in bookmarks:
        items_html += f"""
        <div class="bookmark-card">
            <div class="bookmark-header">
                <span class="bookmark-date">{b['date_display']}</span>
                <span class="bookmark-source">{b['source']}</span>
            </div>
            <div class="bookmark-content">
                <p>{b['text']}</p>
                <a href="{b['link']}" target="_blank" class="bookmark-link">Voir le tweet</a>
            </div>
        </div>
        """
        
    return f"""
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Mes Signets Twitter (jusqu'au 20/01/2026)</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f8fa; }}
        h1 {{ text-align: center; color: #1da1f2; }}
        .bookmark-card {{ background: white; border-radius: 12px; padding: 15px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }}
        .bookmark-header {{ display: flex; justify-content: space-between; color: #657786; font-size: 0.9em; margin-bottom: 10px; }}
        .bookmark-content p {{ margin: 0 0 10px 0; line-height: 1.5; }}
        .bookmark-link {{ display: inline-block; color: #1da1f2; text-decoration: none; font-weight: bold; }}
        .bookmark-link:hover {{ text-decoration: underline; }}
    </style>
</head>
<body>
    <h1>Signets Twitter conservés ({len(bookmarks)})</h1>
    <div class="bookmarks-list">
        {items_html}
    </div>
</body>
</html>
    """

if __name__ == "__main__":
    parse_bookmarks()
