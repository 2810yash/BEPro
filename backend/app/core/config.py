from typing import List, Optional, Union
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    """
    Application settings and configuration.
    
    Attributes:
        API_V1_STR: API version prefix
        PROJECT_NAME: Name of the project
        PROJECT_DESCRIPTION: Brief description of the project
        VERSION: Current version of the application
        DATABASE_URL: Connection string for the database
        BACKEND_CORS_ORIGINS: List of allowed CORS origins
        SECRET_KEY: Secret key for JWT token generation
        ACCESS_TOKEN_EXPIRE_MINUTES: Token expiration time in minutes
    """
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "SentiSnel"
    PROJECT_DESCRIPTION: str = "A sentiment analysis application for social media monitoring"
    VERSION: str = "1.0.0"
    
    # Database configuration
    DATABASE_URL: Optional[str] = None
    
    # CORS configuration
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",  # React frontend default port
        "http://localhost:8000",  # FastAPI backend default port
    ]
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"  # Change this in production!
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        """Validate and process CORS origins."""
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
