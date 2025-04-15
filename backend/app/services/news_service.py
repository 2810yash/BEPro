import requests
from bs4 import BeautifulSoup
import logging
from typing import Dict, Any
from datetime import datetime
from .ml_service import ml_service

logger = logging.getLogger(__name__)

class NewsService:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def extract_article_content(self, url: str) -> Dict[str, Any]:
        """
        Extract content from a news article URL
        """
        try:
            logger.info(f"Fetching content from URL: {url}")
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract title - try different common patterns
            title = None
            title_tags = soup.find('h1') or soup.find('title')
            if title_tags:
                title = title_tags.get_text().strip()
            
            # Extract main content - focus on article body, paragraphs
            content = []
            article_body = soup.find('article') or soup.find(class_=['article-body', 'story-body', 'content-body'])
            
            if article_body:
                paragraphs = article_body.find_all('p')
            else:
                # Fallback to all paragraphs if no article body found
                paragraphs = soup.find_all('p')
            
            for p in paragraphs:
                text = p.get_text().strip()
                if text and len(text) > 20:  # Filter out short snippets
                    content.append(text)
            
            # Combine paragraphs into full text
            full_text = ' '.join(content)
            
            # Get analysis from ML service
            analysis_result = ml_service.predict_news(full_text)
            
            # Add metadata
            analysis_result["metadata"] = {
                "sourceUrl": url,
                "title": title,
                "publishedDate": datetime.now().isoformat(),
                "source": url.split('/')[2]  # Extract domain as source
            }
            
            logger.info("Article content extracted and analyzed successfully")
            return analysis_result
            
        except Exception as e:
            logger.error(f"Error processing news URL: {str(e)}")
            raise

# Create singleton instance
news_service = NewsService() 