import praw
import logging
from typing import Dict, Any
from .ml_service import ml_service

logger = logging.getLogger(__name__)

class RedditService:
    def __init__(self):
        # Initialize Reddit API client
        # Note: These should be moved to environment variables in production
        self.reddit = praw.Reddit(
            client_id="YOUR_CLIENT_ID",
            client_secret="YOUR_CLIENT_SECRET",
            user_agent="SentiNews/1.0"
        )
    
    def extract_post_data(self, url: str) -> Dict[str, Any]:
        """
        Extract data from a Reddit post URL
        """
        try:
            # Extract post ID from URL
            submission_id = url.split('/')[-3] if url.endswith('/') else url.split('/')[-2]
            submission = self.reddit.submission(id=submission_id)
            
            # Combine title and text for analysis
            full_text = f"{submission.title} {submission.selftext}"
            
            # Get sentiment and fake news analysis
            analysis_result = ml_service.predict_news(full_text)
            
            # Add Reddit-specific metadata
            analysis_result["metadata"] = {
                "sourceUrl": url,
                "publishedDate": submission.created_utc,
                "author": str(submission.author),
                "score": submission.score,
                "upvote_ratio": submission.upvote_ratio,
                "num_comments": submission.num_comments
            }
            
            return analysis_result
            
        except Exception as e:
            logger.error(f"Error analyzing Reddit post: {str(e)}")
            raise

# Create singleton instance
reddit_service = RedditService() 