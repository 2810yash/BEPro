from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional
import logging
from app.services.ml_service import ml_service
from app.services.news_service import news_service

logger = logging.getLogger(__name__)
router = APIRouter()

class NewsAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=10, description="News text to analyze (minimum 10 characters)")
    title: Optional[str] = Field(None, min_length=3, description="Optional news title (minimum 3 characters if provided)")
    sourceUrl: Optional[str] = Field(None, description="Source URL of the news article")
    publishedDate: Optional[str] = Field(None, description="Publication date of the news article")

class NewsAnalysisResponse(BaseModel):
    is_fake: bool
    confidence: float
    sentiment: dict
    metadata: Optional[dict] = None

class NewsUrlAnalysisRequest(BaseModel):
    url: HttpUrl = Field(..., description="News article URL to analyze")

@router.post("/analyze", response_model=NewsAnalysisResponse)
async def analyze_news(request: NewsAnalysisRequest):
    """
    Analyze a news article to determine if it's fake or real and perform sentiment analysis
    """
    try:
        logger.info(f"Received analysis request for text: {request.text[:100]}...")
        
        # Validate input text
        if not request.text.strip():
            logger.warning("Empty text received")
            raise HTTPException(status_code=400, detail="News text cannot be empty")
        
        # Combine title and text if title is provided
        full_text = f"{request.title} {request.text}" if request.title else request.text
        
        # Get prediction from ML service
        logger.info("Calling ML service for analysis")
        result = ml_service.predict_news(full_text)
        
        # Add metadata if provided
        if request.sourceUrl or request.publishedDate:
            result["metadata"] = {
                "sourceUrl": request.sourceUrl,
                "publishedDate": request.publishedDate
            }
        
        logger.info(f"Analysis completed. Is fake: {result['is_fake']}, Confidence: {result['confidence']}")
        return result
        
    except Exception as e:
        logger.error(f"Error analyzing news: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-url")
async def analyze_news_url(request: NewsUrlAnalysisRequest):
    """
    Analyze a news article from its URL
    """
    try:
        logger.info(f"Received URL analysis request: {request.url}")
        
        # Get analysis from news service
        result = news_service.extract_article_content(str(request.url))
        
        logger.info("URL analysis completed successfully")
        return result
        
    except Exception as e:
        logger.error(f"Error analyzing news URL: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 