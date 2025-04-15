import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface NewsAnalysisRequest {
    text: string;
    title?: string;
    sourceUrl?: string;
    publishedDate?: string;
}

interface SentimentScores {
    positive: number;
    neutral: number;
    negative: number;
}

interface SentimentAnalysis {
    label: 'positive' | 'negative' | 'neutral';
    scores: SentimentScores;
}

export interface NewsAnalysisResponse {
    is_fake: boolean;
    confidence: number;
    sentiment: SentimentAnalysis;
    metadata?: {
        sourceUrl: string;
        publishedDate: string;
        sourceName?: string;
    };
}

export const analyzeNews = async (request: NewsAnalysisRequest): Promise<NewsAnalysisResponse> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/news/analyze`, request);
        return response.data;
    } catch (error) {
        console.error('Error analyzing news:', error);
        throw error;
    }
}; 