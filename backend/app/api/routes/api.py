from fastapi import APIRouter
from .news import router as news_router
from .social_media import router as social_media_router

router = APIRouter()

# Include the news analysis routes
router.include_router(news_router, prefix="/news", tags=["news"])

# Include the social media analysis routes
router.include_router(social_media_router, prefix="/social", tags=["social"])

@router.get("/health-check")
async def health_check():
    return {"status": "ok"} 