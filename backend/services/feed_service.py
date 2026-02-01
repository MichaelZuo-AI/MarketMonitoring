import feedparser
from datetime import datetime
from typing import List, Dict

# Default RSS Feeds
FEEDS = [
    "http://feeds.bbci.co.uk/news/world/rss.xml",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"
]

class FeedService:
    def __init__(self):
        self.feeds = FEEDS

    def fetch_all(self) -> List[Dict]:
        all_articles = []
        for url in self.feeds:
            try:
                feed = feedparser.parse(url)
                for entry in feed.entries[:5]: # limit to 5 per source for now
                    article = {
                        "title": entry.get("title", "No Title"),
                        "link": entry.get("link", ""),
                        "published": entry.get("published", datetime.now().isoformat()),
                        "summary_raw": entry.get("summary", ""),
                        "source": feed.feed.get("title", "Unknown Source")
                    }
                    all_articles.append(article)
            except Exception as e:
                print(f"Error fetching {url}: {e}")
        
        return all_articles
