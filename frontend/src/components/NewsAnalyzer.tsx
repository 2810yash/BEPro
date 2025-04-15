import React, { useState, useEffect } from 'react';
import { analyzeNews, NewsAnalysisResponse } from '../services/api';
import { motion } from 'framer-motion';
import { FaLink, FaCalendar, FaNewspaper } from 'react-icons/fa';

const NewsAnalyzer: React.FC = () => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [publishedDate, setPublishedDate] = useState('');
    const [result, setResult] = useState<NewsAnalysisResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Reset result when text changes
    useEffect(() => {
        if (text && isSubmitted) {
            setResult(null);
            setIsSubmitted(false);
        }
    }, [text, isSubmitted]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate input
        if (!text.trim()) {
            setError('Please enter some news text to analyze.');
            return;
        }
        
        setLoading(true);
        setError(null);
        setIsSubmitted(true);
        
        try {
            const response = await analyzeNews({ 
                text: text.trim(), 
                title: title.trim(),
                sourceUrl: sourceUrl.trim(),
                publishedDate: publishedDate
            });
            setResult(response);
        } catch (err) {
            setError('Failed to analyze news. Please try again.');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        setError(null);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">News Analyzer</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        <FaNewspaper className="inline mr-2" />
                        Title (optional)
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter news title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        <FaLink className="inline mr-2" />
                        Source URL (optional)
                    </label>
                    <input
                        type="url"
                        value={sourceUrl}
                        onChange={(e) => setSourceUrl(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter source URL"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        <FaCalendar className="inline mr-2" />
                        Publication Date (optional)
                    </label>
                    <input
                        type="date"
                        value={publishedDate}
                        onChange={(e) => setPublishedDate(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">News Text *</label>
                    <textarea
                        value={text}
                        onChange={handleTextChange}
                        className="w-full p-2 border rounded h-32"
                        placeholder="Enter news text"
                        required
                        minLength={10}
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading || !text.trim()}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? 'Analyzing...' : 'Analyze News'}
                </button>
            </form>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-100 text-red-700 rounded"
                >
                    {error}
                </motion.div>
            )}

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 border rounded"
                >
                    <h2 className="text-xl font-semibold mb-2">Analysis Results</h2>

                    {/* Source Information */}
                    {(sourceUrl || publishedDate) && (
                        <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
                            {sourceUrl && (
                                <p className="mb-1">
                                    <FaLink className="inline mr-2" />
                                    <a 
                                        href={sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View Source
                                    </a>
                                </p>
                            )}
                            {publishedDate && (
                                <p>
                                    <FaCalendar className="inline mr-2" />
                                    Published: {new Date(publishedDate).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Fake News Detection Results */}
                        <div className="p-4 bg-gray-50 rounded">
                            <h3 className="text-lg font-medium mb-2">Authenticity Analysis</h3>
                            <p>
                                <span className="font-medium">Verdict:</span>{' '}
                                <span className={result.is_fake ? 'text-red-600' : 'text-green-600'}>
                                    {result.is_fake ? 'Potentially Fake News' : 'Likely Authentic'}
                                </span>
                            </p>
                            <p>
                                <span className="font-medium">Confidence:</span>{' '}
                                {(result.confidence * 100).toFixed(1)}%
                            </p>
                            <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${
                                            result.is_fake ? 'bg-red-500' : 'bg-green-500'
                                        }`}
                                        style={{
                                            width: `${(result.confidence * 100)}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sentiment Analysis Results */}
                        {result.sentiment && (
                            <div className="p-4 bg-gray-50 rounded">
                                <h3 className="text-lg font-medium mb-2">Sentiment Analysis</h3>
                                <p>
                                    <span className="font-medium">Overall Tone:</span>{' '}
                                    <span className={`
                                        ${result.sentiment.label === 'positive' ? 'text-green-600' : ''}
                                        ${result.sentiment.label === 'negative' ? 'text-red-600' : ''}
                                        ${result.sentiment.label === 'neutral' ? 'text-blue-600' : ''}
                                    `}>
                                        {result.sentiment.label.charAt(0).toUpperCase() + result.sentiment.label.slice(1)}
                                    </span>
                                </p>
                                <div className="mt-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Positive</span>
                                        <span>{(result.sentiment.scores.positive * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-green-500"
                                            style={{
                                                width: `${result.sentiment.scores.positive * 100}%`
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Neutral</span>
                                        <span>{(result.sentiment.scores.neutral * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-blue-500"
                                            style={{
                                                width: `${result.sentiment.scores.neutral * 100}%`
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Negative</span>
                                        <span>{(result.sentiment.scores.negative * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-red-500"
                                            style={{
                                                width: `${result.sentiment.scores.negative * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default NewsAnalyzer; 