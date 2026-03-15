from bs4 import BeautifulSoup
import os

FILE_PATH = r'C:\Users\boyoc\Desktop\HUMANISATION CLAUDE\bookmarks 1er mars.htm'
OUTPUT_FILE = r'C:\Users\boyoc\Desktop\HUMANISATION CLAUDE\site-compagnon\bookmarks_1er_mars_analysis.txt'

print(f'Reading file...')
try:
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        html = f.read()
except UnicodeDecodeError:
    print('UTF-8 failed, trying cp1252...')
    with open(FILE_PATH, 'r', encoding='cp1252') as f:
        html = f.read()

soup = BeautifulSoup(html, 'html.parser')
articles = soup.find_all('article')
print(f'Found {len(articles)} total articles.')

bookmarks = []
for article in articles:
    tweet_text_div = article.find('div', {'data-testid': 'tweetText'})
    text = tweet_text_div.get_text(separator=' ').strip() if tweet_text_div else '[No Text]'

    time_tag = article.find('time')
    date_str = time_tag.get('datetime') if time_tag else 'Unknown Date'

    link = ''
    links = article.find_all('a')
    for a in links:
        href = a.get('href', '')
        if '/status/' in href and 'twitter.com' not in href and 'x.com' not in href:
            link = 'https://twitter.com' + href
            break
        elif '/status/' in href:
            link = href
            break

    user_div = article.find('div', {'data-testid': 'User-Name'})
    author = user_div.get_text(separator=' ').strip() if user_div else 'Unknown Author'

    bookmarks.append({'date': date_str, 'author': author, 'text': text, 'link': link})

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write('ANALYSIS OF bookmarks 1er mars.htm\n')
    f.write('Total bookmarks found: ' + str(len(bookmarks)) + '\n')
    f.write('='*50 + '\n\n')
    for i, b in enumerate(bookmarks, 1):
        f.write('ITEM #' + str(i) + '\n')
        f.write('Date: ' + b['date'] + '\n')
        f.write('Author: ' + b['author'] + '\n')
        f.write('Link: ' + b['link'] + '\n')
        f.write('Content: ' + b['text'] + '\n')
        f.write('-'*30 + '\n')

print('Done! Analysis written to ' + OUTPUT_FILE)
