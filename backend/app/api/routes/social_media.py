from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import logging
from app.services.reddit_service import reddit_service

logger = logging.getLogger(__name__)
router = APIRouter()

class RedditAnalysisRequest(BaseModel):
    url: str = Field(..., description="Reddit post URL to analyze")

@router.post("/reddit/analyze")
async def analyze_reddit_post(request: RedditAnalysisRequest):
    """
    Analyze a Reddit post for sentiment and authenticity
    """
    try:
        logger.info(f"Received Reddit analysis request for URL: {request.url}")
        
        if not request.url.strip():
            logger.warning("Empty URL received")
            raise HTTPException(status_code=400, detail="URL cannot be empty")
            
        if "reddit.com" not in request.url:
            logger.warning("Invalid Reddit URL")
            raise HTTPException(status_code=400, detail="Invalid Reddit URL")
        
        # Get analysis from Reddit service
        result = reddit_service.extract_post_data(request.url)
        
        logger.info("Reddit analysis completed successfully")
        return result
        
    except Exception as e:
        logger.error(f"Error analyzing Reddit post: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 