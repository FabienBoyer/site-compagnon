
import bs4
from bs4 import BeautifulSoup
from datetime import datetime
import os

# Path to the new file
FILE_PATH = "signets twitter 18 février 2.htm"
OUTPUT_FILE = "new_bookmarks_analysis_2.txt"

def parse_bookmarks():
    print(f"Reading {FILE_PATH}...")
    if not os.path.exists(FILE_PATH):
        print(f"Error: File {FILE_PATH} not found.")
        return

    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            html = f.read()
    except UnicodeDecodeError:
        print("UTF-8 decode failed, trying cp1252...")
        try:
            with open(FILE_PATH, "r", encoding="cp1252") as f:
                html = f.read()
        except:
             print("cp1252 decode failed, trying latin1...")
             with open(FILE_PATH, "r", encoding="latin1") as f:
                html = f.read()
    
    soup = BeautifulSoup(html, "html.parser")
    articles = soup.find_all("article")
    
    print(f"Found {len(articles)} total articles.")
    
    bookmarks = []
    
    for article in articles:
        # Extract Text
        tweet_text_div = article.find("div", {"data-testid": "tweetText"})
        text = tweet_text_div.get_text(separator=" ").strip() if tweet_text_div else "[No Text]"
        
        # Extract Time
        time_tag = article.find("time")
        date_str = time_tag.get("datetime") if time_tag else "Unknown Date"
        
        # Extract Link
        link = ""
        links = article.find_all("a")
        for a in links:
            href = a.get("href", "")
            if "/status/" in href and "twitter.com" not in href and "x.com" not in href:
                 link = f"https://twitter.com{href}"
                 break
            elif "/status/" in href:
                link = href
                break
        
        # Extract Author
        user_div = article.find("div", {"data-testid": "User-Name"})
        author = user_div.get_text(separator=" ").strip() if user_div else "Unknown Author"

        bookmarks.append({
            "date": date_str,
            "author": author,
            "text": text,
            "link": link
        })
    
    # Write analysis to file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(f"ANALYSIS OF {FILE_PATH}\n")
        f.write(f"Total bookmarks found: {len(bookmarks)}\n")
        f.write("="*50 + "\n\n")
        
        for i, b in enumerate(bookmarks, 1):
            f.write(f"ITEM #{i}\n")
            f.write(f"Date: {b['date']}\n")
            f.write(f"Author: {b['author']}\n")
            f.write(f"Link: {b['link']}\n")
            f.write(f"Content: {b['text']}\n")
            f.write("-" * 30 + "\n")

    print(f"Analysis written to {OUTPUT_FILE}")

if __name__ == "__main__":
    parse_bookmarks()
