import { NewsItem, NewsCache } from '../types';

const NEWS_CACHE_TIME = 15 * 60 * 1000; // 15 minutes
const newsCache: NewsCache = {};

// Fallback to mock news data when API is unavailable
const getMockNews = (currency: string): NewsItem[] => [
  {
    title: `${currency} Market Analysis Update`,
    sentiment: 'neutral',
    published_at: new Date().toISOString(),
  }
];

export async function fetchCryptoNews(currency: string): Promise<NewsItem[]> {
  const now = Date.now();
  const cached = newsCache[currency];

  if (cached && now - cached.timestamp < NEWS_CACHE_TIME) {
    return cached.data;
  }

  try {
    // Using alternative free API for demo purposes
    const response = await fetch(
      `https://api.coingecko.com/api/v3/news/${currency.toLowerCase()}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const news: NewsItem[] = data.map((item: any) => ({
      title: item.title,
      sentiment: analyzeSentiment(item.title),
      published_at: item.published_at,
    }));

    newsCache[currency] = {
      data: news,
      timestamp: now,
    };

    return news;
  } catch (error) {
    console.warn('Using mock news data due to API error:', error);
    return getMockNews(currency);
  }
}

// Simple sentiment analysis based on keyword matching
function analyzeSentiment(title: string): 'positive' | 'negative' | 'neutral' {
  const text = title.toLowerCase();
  
  const positiveWords = ['bullish', 'surge', 'gain', 'rally', 'up', 'high', 'rise'];
  const negativeWords = ['bearish', 'drop', 'fall', 'down', 'low', 'crash', 'decline'];
  
  const posCount = positiveWords.filter(word => text.includes(word)).length;
  const negCount = negativeWords.filter(word => text.includes(word)).length;
  
  if (posCount > negCount) return 'positive';
  if (negCount > posCount) return 'negative';
  return 'neutral';
}