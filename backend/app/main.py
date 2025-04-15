from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import sys
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI(title="News Analysis API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test endpoint
@app.get("/test")
async def test_endpoint():
    logger.info("Test endpoint called")
    return {"status": "ok", "message": "API is running"}

# Health check endpoint
@app.get("/health")
async def health_check():
    try:
        # Check if models directory exists
        models_dir = Path(__file__).parent.parent.parent / "models"
        if not models_dir.exists():
            raise HTTPException(status_code=500, detail="Models directory not found")
        
        # Check if required model files exist
        required_files = ["tfidf_vectorizer.pkl", "fake_news_xgboost.pkl"]
        missing_files = [f for f in required_files if not (models_dir / f).exists()]
        
        if missing_files:
            raise HTTPException(
                status_code=500, 
                detail=f"Missing model files: {', '.join(missing_files)}"
            )
        
        logger.info("Health check passed")
        return {
            "status": "healthy",
            "models_dir": str(models_dir),
            "model_files_present": required_files
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Import and include API routes
from app.api.routes.api import router as api_router
app.include_router(api_router, prefix="/api/v1")
