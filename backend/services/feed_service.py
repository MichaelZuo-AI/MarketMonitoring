import feedparser
from datetime import datetime
from typing import List, Dict

# Market Watcher Feed Configuration
CATEGORIES = {
    "All": [], # Will be calculated dynamically
    "Global Markets": [
        "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664", # CNBC Finance
        "https://feeds.content.dowjones.io/public/rss/mw_topstories" # MarketWatch
    ],
    "Technology": [
        "https://techcrunch.com/feed/",
        "https://www.theverge.com/rss/index.xml"
    ],
    "Geopolitics": [
        "http://feeds.bbci.co.uk/news/world/rss.xml",
        "https://www.aljazeera.com/xml/rss/all.xml"
    ],
    "Crypto": [
         "https://www.coindesk.com/arc/outboundfeeds/rss/"
    ],
    "Startups": [
        "https://techcrunch.com/category/startups/feed/"
    ]
}

class FeedService:
    def __init__(self):
        self.categories = CATEGORIES

    def fetch_all(self, category: str = "All", language: str = "English", gemini_service=None) -> List[Dict]:
        target_urls = []
        if category == "All" or category not in self.categories:
            # Flatten all unique URLs for "All" view (taking 1 from each to avoid spam, or just mix)
            # For "All", let's pick 1 top source from each category to keep it diverse
            seen = set()
            for cat, urls in self.categories.items():
                if cat == "All": continue
                for url in urls:
                    if url not in seen:
                        target_urls.append(url)
                        seen.add(url)
                        break # Take only first source of each category for "All"
        else:
            target_urls = self.categories[category]

        all_articles = []
        for url in target_urls:
            try:
                feed = feedparser.parse(url)
                limit = 5 if category != "All" else 2 # Fewer articles per source in All view
                for entry in feed.entries[:limit]:
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
        
        # Batch Translation if language is not English
        if language != "English":
            if gemini_service and all_articles:
                try:
                    titles = [a["title"] for a in all_articles]
                    translated_titles = gemini_service.translate_batch(titles, language)
                    
                    # Check for length mismatch in case LLM hallucinations/errors
                    if len(translated_titles) == len(all_articles):
                        for i, article in enumerate(all_articles):
                            article["title"] = translated_titles[i]
                except Exception as e:
                    print(f"Translation Flow Error: {e}")
        
        return all_articles
