export interface CryptoPrice {
  symbol: string;
  price: string;
  timestamp: number;
}

export interface Signal {
  symbol: string;
  timeframe: string;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
  timestamp: number;
  reason: string;
}

export type Timeframe = '15m' | '30m' | '1h' | '4h';

export interface CryptoPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AnalysisResult {
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
  reason: string;
}