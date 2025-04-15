import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FakeNews.css';
import { FaYoutube, FaRedditAlien, FaTwitter, FaQuestionCircle } from 'react-icons/fa';
import { BiNews } from 'react-icons/bi';
import { BsShareFill } from 'react-icons/bs';

const FakeNewsPage = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [url, setUrl] = useState('');

  const handleSelect = (option) => {
    setSelectedOption(option);
    setSelectedPlatform(null);
    setUrl('');
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
  };

  const getUrlPlaceholder = () => {
    if (selectedOption === 'news') {
      return 'Enter news article URL (e.g., https://reuters.com/article...)';
    }
    switch (selectedPlatform) {
      case 'youtube':
        return 'Enter YouTube video URL (e.g., https://youtube.com/watch?v=...)';
      case 'reddit':
        return 'Enter Reddit post URL (e.g., https://reddit.com/r/...)';
      case 'twitter':
        return 'Enter Twitter post URL (e.g., https://twitter.com/...)';
      default:
        return 'Enter URL...';
    }
  };

  const handleAnalyze = () => {
    if (url.trim()) {
      navigate('/news_sentiment', { state: { url: url.trim() } });
    }
  };

  return (
    <div className="fake-news-page">
      <header className="header">
        <div className="logo">SentiGuard</div>
        <nav className="nav">
          <a href="#" className="active">Dashboard</a>
          <a href="#">Documentation</a>
          <a href="#">API</a>
        </nav>
      </header>

      <main className="main">
        <h1 className="title">Advanced Sentiment Analysis & Fake News Detection</h1>
        <p className="subtitle">
          Powerful tool for news articles and social media content verification
        </p>

        <div className="analysis-options">
          <div className={`card ${selectedOption === 'news' ? 'selected' : ''}`}>
            <div className="card-header">
              <BiNews className="icon" />
              <FaQuestionCircle className="help-icon" title="Analyze sentiment and authenticity of news articles" />
            </div>
            <h2>News Article Analysis</h2>
            <p>Analyze sentiment and verify authenticity of news articles</p>
            <button 
              className="select-btn"
              onClick={() => handleSelect('news')}
            >
              Select
            </button>
          </div>

          <div className={`card ${selectedOption === 'social' ? 'selected' : ''}`}>
            <div className="card-header">
              <BsShareFill className="icon" />
              <FaQuestionCircle className="help-icon" title="Analyze content from social media platforms" />
            </div>
            <h2>Social Media Analysis</h2>
            <p>Analyze content from major social media platforms</p>
            <button 
              className="select-btn"
              onClick={() => handleSelect('social')}
            >
              Select
            </button>
          </div>
        </div>

        {selectedOption === 'social' && (
          <>
            <h3 className="platform-label">Select Platform</h3>
            <div className="platforms">
              <div 
                className={`platform ${selectedPlatform === 'youtube' ? 'selected' : ''}`}
                onClick={() => handlePlatformSelect('youtube')}
              >
                <FaYoutube className="platform-icon" /> YouTube
              </div>
              <div 
                className={`platform ${selectedPlatform === 'reddit' ? 'selected' : ''}`}
                onClick={() => handlePlatformSelect('reddit')}
              >
                <FaRedditAlien className="platform-icon" /> Reddit
              </div>
              <div 
                className={`platform ${selectedPlatform === 'twitter' ? 'selected' : ''}`}
                onClick={() => handlePlatformSelect('twitter')}
              >
                <FaTwitter className="platform-icon" /> Twitter
              </div>
            </div>
          </>
        )}

        {(selectedOption === 'news' || selectedPlatform) && (
          <div className="content-analysis">
            <h3>Content Analysis</h3>
            <div className="url-input-container">
              <input 
                type="text" 
                placeholder={getUrlPlaceholder()}
                className="url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {url && !url.startsWith('http') && (
                <div className="url-error">URL must start with http:// or https://</div>
              )}
            </div>
            <button 
              className={`analyze-btn ${!url.trim() ? 'disabled' : ''}`}
              onClick={handleAnalyze}
              disabled={!url.trim()}
            >
              Analyze Content
            </button>
          </div>
        )}

        {selectedOption && (
          <div className="helper-text">
            {selectedOption === 'news' ? (
              <p>📝 Paste a news article URL to analyze its sentiment and verify its authenticity</p>
            ) : (
              selectedPlatform ? (
                <p>📱 Paste a {selectedPlatform} URL to analyze the content's sentiment</p>
              ) : (
                <p>👆 Select a platform to continue</p>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default FakeNewsPage;
