import React from "react";
import "../styles/NewsSentiment.css";
import { FaCheckCircle, FaChartBar, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NewsSentiment = () => {
  const navigate = useNavigate();

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
          <h2 className="news-title">
            Global Economic Recovery Shows Promising Signs Despite Challenges
          </h2>
          <div className="article-meta">
            <span>Published: March 15, 2025</span>
            <span>Source: Global Economics Times</span>
          </div>
          <p className="news-body">
            The global economy is showing signs of recovery in early 2025, with
            major economies reporting better-than-expected growth figures.
            Financial markets have responded positively to these developments,
            with major indices reaching new highs.
          </p>
          <p className="news-body">
            However, challenges remain as inflation concerns persist in several
            regions. Central banks are maintaining a cautious approach to
            monetary policy, balancing growth objectives with price stability.
          </p>
          <p className="news-body">
            Emerging markets are experiencing varied outcomes, with some
            showing robust recovery while others face continued headwinds from
            currency pressures and supply chain disruptions.
          </p>
        </section>

        <section className="sentiment-analysis">
          <div className="analysis-header">
            <FaChartBar className="analysis-icon" />
            <h3>Sentiment Analysis Results</h3>
          </div>

          <div className="sentence-analysis">
            <h4>Sentence-wise Analysis</h4>
            <div className="sentence-item positive">
              <span className="sentence-text">"The global economy is showing signs of recovery in early 2025..."</span>
              <div className="sentiment-tag">
                <span className="tag">Positive</span>
                <span className="confidence">92%</span>
              </div>
            </div>
            <div className="sentence-item negative">
              <span className="sentence-text">"However, challenges remain as inflation concerns persist..."</span>
              <div className="sentiment-tag">
                <span className="tag">Negative</span>
                <span className="confidence">85%</span>
              </div>
            </div>
            <div className="sentence-item neutral">
              <span className="sentence-text">"Central banks are maintaining a cautious approach..."</span>
              <div className="sentiment-tag">
                <span className="tag">Neutral</span>
                <span className="confidence">78%</span>
              </div>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="metrics-distribution">
              <h4>Sentiment Distribution</h4>
              <div className="distribution-bars">
                <div className="bar-item">
                  <div className="bar-label">Positive</div>
                  <div className="bar-container">
                    <div className="bar positive" style={{ width: '45%' }}></div>
                    <span>45%</span>
                  </div>
                </div>
                <div className="bar-item">
                  <div className="bar-label">Negative</div>
                  <div className="bar-container">
                    <div className="bar negative" style={{ width: '30%' }}></div>
                    <span>30%</span>
                  </div>
                </div>
                <div className="bar-item">
                  <div className="bar-label">Neutral</div>
                  <div className="bar-container">
                    <div className="bar neutral" style={{ width: '25%' }}></div>
                    <span>25%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="key-metrics">
              <h4>Analysis Metrics</h4>
              <div className="metrics-grid-container">
                <div className="metric-box">
                  <h5>Overall Sentiment</h5>
                  <span className="metric-value positive">Positive</span>
                </div>
                <div className="metric-box">
                  <h5>Confidence Score</h5>
                  <span className="metric-value">85%</span>
                </div>
                <div className="metric-box">
                  <h5>Bias Detection</h5>
                  <span className="metric-value">Low</span>
                </div>
                <div className="metric-box">
                  <h5>Objectivity</h5>
                  <span className="metric-value">High</span>
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
                  The article maintains a predominantly positive tone while acknowledging
                  potential challenges. The balanced presentation of both positive and
                  negative aspects suggests a credible and nuanced analysis of the
                  global economic situation.
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
