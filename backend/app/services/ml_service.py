import joblib
import numpy as np
from pathlib import Path
from typing import Dict, Any, List
from transformers import pipeline, AutoTokenizer
import logging

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        try:
            # Get the absolute path to the models directory
            self.models_dir = Path(__file__).parent.parent.parent.parent / "models"
            logger.info(f"Loading models from: {self.models_dir}")
            
            if not self.models_dir.exists():
                raise FileNotFoundError(f"Models directory not found at {self.models_dir}")
            
            # Load the fake news detection models
            vectorizer_path = self.models_dir / "tfidf_vectorizer.pkl"
            model_path = self.models_dir / "fake_news_xgboost.pkl"
            
            if not vectorizer_path.exists():
                raise FileNotFoundError(f"TF-IDF vectorizer not found at {vectorizer_path}")
            if not model_path.exists():
                raise FileNotFoundError(f"XGBoost model not found at {model_path}")
            
            logger.info("Loading TF-IDF vectorizer...")
            self.vectorizer = joblib.load(vectorizer_path)
            
            logger.info("Loading XGBoost model...")
            self.fake_news_model = joblib.load(model_path)
            
            # Initialize sentiment analysis model and tokenizer
            logger.info("Initializing sentiment analysis model...")
            model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.sentiment_analyzer = pipeline(
                "sentiment-analysis",
                model=model_name,
                tokenizer=self.tokenizer
            )
            logger.info("All models loaded successfully")
            
        except Exception as e:
            logger.error(f"Error initializing ML service: {str(e)}")
            raise

    def chunk_text(self, text: str, max_length: int = 512) -> List[str]:
        """
        Split text into chunks that fit within model's max sequence length
        """
        words = text.split()
        chunks = []
        current_chunk = []
        current_length = 0
        
        for word in words:
            # Get the token length of this word
            word_tokens = len(self.tokenizer.encode(word))
            
            # If adding this word would exceed max_length, save current chunk and start new one
            if current_length + word_tokens > max_length:
                if current_chunk:  # Only add if chunk has content
                    chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_length = word_tokens
            else:
                current_chunk.append(word)
                current_length += word_tokens
        
        # Add the last chunk if it has content
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        return chunks

    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """
        Analyze the sentiment of the text
        
        Args:
            text (str): The text to analyze
            
        Returns:
            Dict[str, Any]: Sentiment analysis results
        """
        try:
            logger.info("Performing sentiment analysis...")
            
            # Split text into chunks if needed
            chunks = self.chunk_text(text)
            chunk_results = []
            
            # Analyze each chunk
            for chunk in chunks:
                result = self.sentiment_analyzer(chunk)[0]
                chunk_results.append({
                    'score': float(result['score']),
                    'label': result['label']
                })
            
            # Average the scores
            avg_score = sum(r['score'] for r in chunk_results) / len(chunk_results)
            
            # Convert 1-5 score to positive/neutral/negative
            if avg_score >= 4:
                label = 'positive'
                pos_score = avg_score / 5
                neg_score = 0.1
                neu_score = 1 - pos_score - neg_score
            elif avg_score <= 2:
                label = 'negative'
                neg_score = (5 - avg_score) / 5
                pos_score = 0.1
                neu_score = 1 - pos_score - neg_score
            else:
                label = 'neutral'
                neu_score = 0.6
                pos_score = 0.2
                neg_score = 0.2
            
            sentiment_result = {
                'label': label,
                'scores': {
                    'positive': pos_score,
                    'neutral': neu_score,
                    'negative': neg_score
                }
            }
            logger.info(f"Sentiment analysis completed. Label: {label}")
            return sentiment_result
            
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {str(e)}")
            raise
    
    def predict_news(self, text: str) -> Dict[str, Any]:
        """
        Analyze news text for authenticity and sentiment
        
        Args:
            text (str): The news article text to analyze
            
        Returns:
            Dict[str, Any]: Analysis results including fake news detection and sentiment
        """
        try:
            logger.info("Starting news analysis...")
            
            # Fake news detection
            logger.info("Vectorizing text...")
            text_vectorized = self.vectorizer.transform([text])
            
            logger.info("Predicting with XGBoost model...")
            prediction = self.fake_news_model.predict(text_vectorized)[0]
            probabilities = self.fake_news_model.predict_proba(text_vectorized)[0]
            
            # Sentiment analysis
            sentiment = self.analyze_sentiment(text)
            
            result = {
                "is_fake": bool(prediction),
                "confidence": float(probabilities[prediction]),
                "sentiment": sentiment
            }
            
            logger.info(f"Analysis completed successfully. Is fake: {result['is_fake']}")
            return result
            
        except Exception as e:
            logger.error(f"Error in news prediction: {str(e)}")
            raise

# Create a singleton instance
try:
    logger.info("Initializing ML service singleton...")
    ml_service = MLService()
    logger.info("ML service singleton created successfully")
except Exception as e:
    logger.error(f"Failed to initialize ML service: {str(e)}")
    raise 