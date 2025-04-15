import React, { useState, useEffect } from "react";
import "../styles/NewsSentiment.css";
import { FaCheckCircle, FaChartBar, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const NewsSentiment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Location state:", location.state); // Debug: entire location state
    const fetchAnalysis = async () => {
      try {
        const url = location.state?.url;
        console.log("Location object:", location); // Debug: full location object
        console.log("URL from state:", url); // Debug: extracted URL
        
        if (!url) {
          console.log("No URL found in state"); // Debug: URL missing case
          setError("No URL provided for analysis");
          setLoading(false);
          return;
        }

        console.log("Making API call to analyze URL:", url); // Debug log
        const response = await axios.post('http://localhost:8000/api/v1/news/analyze-url', {
          url: url
        });
        console.log("API Response:", response.data); // Debug log

        setAnalysisResult(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Analysis Error:", err.response?.data || err.message); // Enhanced error logging
        setError(err.response?.data?.detail || err.message || "Failed to analyze content");
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [location]);

  if (loading) {
    return (
      <div className="news-container">
        <header className="news-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1>SentiNews</h1>
        </header>
        <div className="loading-container">
          <div className="loading">Analyzing content...</div>
          <div className="loading-details">Please wait while we analyze your article</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-container">
        <header className="news-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1>SentiNews</h1>
        </header>
        <div className="error-container">
          <div className="error">Error: {error}</div>
          <button onClick={() => navigate('/dashboard')} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="news-container">
        <header className="news-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1>SentiNews</h1>
        </header>
        <div className="error-container">
          <div className="error">No analysis results available</div>
          <button onClick={() => navigate('/dashboard')} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-container">
      <header className="news-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>SentiNews</h1>
      </header>

      <main className="news-content">
        <section className="news-article">
          <h2 className="news-title">{analysisResult.metadata?.title || "Untitled Article"}</h2>
          <div className="article-meta">
            <span>Published: {new Date(analysisResult.metadata?.publishedDate).toLocaleDateString()}</span>
            <span>Source: {analysisResult.metadata?.source}</span>
          </div>
          <div className="article-content">
            {analysisResult.metadata?.text && (
              <p className="news-body">{analysisResult.metadata.text}</p>
            )}
          </div>
        </section>

        <section className="sentiment-analysis">
          <div className="analysis-header">
            <FaChartBar className="analysis-icon" />
            <h3>Sentiment Analysis Results</h3>
          </div>

          <div className="metrics-grid">
            <div className="metrics-distribution">
              <h4>Sentiment Distribution</h4>
              <div className="distribution-bars">
                {analysisResult.sentiment?.scores && (
                  <>
                    <div className="bar-item">
                      <div className="bar-label">Positive</div>
                      <div className="bar-container">
                        <div 
                          className="bar positive" 
                          style={{ width: `${analysisResult.sentiment.scores.positive * 100}%` }}
                        ></div>
                        <span>{(analysisResult.sentiment.scores.positive * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="bar-item">
                      <div className="bar-label">Negative</div>
                      <div className="bar-container">
                        <div 
                          className="bar negative" 
                          style={{ width: `${analysisResult.sentiment.scores.negative * 100}%` }}
                        ></div>
                        <span>{(analysisResult.sentiment.scores.negative * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="bar-item">
                      <div className="bar-label">Neutral</div>
                      <div className="bar-container">
                        <div 
                          className="bar neutral" 
                          style={{ width: `${analysisResult.sentiment.scores.neutral * 100}%` }}
                        ></div>
                        <span>{(analysisResult.sentiment.scores.neutral * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="key-metrics">
              <h4>Analysis Metrics</h4>
              <div className="metrics-grid-container">
                <div className="metric-box">
                  <h5>Overall Sentiment</h5>
                  <span className={`metric-value ${analysisResult.sentiment?.label || 'neutral'}`}>
                    {analysisResult.sentiment?.label ? 
                      (analysisResult.sentiment.label.charAt(0).toUpperCase() + analysisResult.sentiment.label.slice(1)) :
                      'Unknown'
                    }
                  </span>
                </div>
                <div className="metric-box">
                  <h5>Authenticity</h5>
                  <span className={`metric-value ${analysisResult.is_fake ? 'negative' : 'positive'}`}>
                    {analysisResult.is_fake ? 'Potentially Fake' : 'Likely Authentic'}
                  </span>
                </div>
                <div className="metric-box">
                  <h5>Confidence Score</h5>
                  <span className="metric-value">{(analysisResult.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overall-sentiment">
            <div className="sentiment-summary">
              <FaCheckCircle className="check-icon" />
              <div>
                <h4>Final Analysis</h4>
                <p>
                  This article has been analyzed as {analysisResult.is_fake ? 'potentially fake' : 'likely authentic'} with 
                  {' '}{(analysisResult.confidence * 100).toFixed(1)}% confidence. The overall tone is {analysisResult.sentiment?.label || 'neutral'}, 
                  with {(analysisResult.sentiment?.scores.positive * 100).toFixed(1)}% positive, 
                  {(analysisResult.sentiment?.scores.negative * 100).toFixed(1)}% negative, and 
                  {(analysisResult.sentiment?.scores.neutral * 100).toFixed(1)}% neutral content.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NewsSentiment;
