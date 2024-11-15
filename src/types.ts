export interface CryptoPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

export interface CryptoPrice {
  symbol: string;
  price: string;
  timestamp: number;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradingLevels {
  entry: number;
  takeProfit: number;
  stopLoss: number;
  riskRewardRatio: number;
}

export interface Signal {
  symbol: string;
  timeframe: string;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
  timestamp: number;
  reason: string;
  levels?: TradingLevels;
}

export interface NewsItem {
  title: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  published_at: string;
}

export interface NewsCache {
  [key: string]: {
    data: NewsItem[];
    timestamp: number;
  };
}

export interface AnalysisResult {
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
  reason: string;
  levels?: TradingLevels;
}