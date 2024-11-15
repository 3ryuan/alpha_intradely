import { CandleData } from '../types';

const BASE_API_URL = 'https://api.binance.com/api/v3';

export async function fetchKlines(symbol: string, interval: string, limit: number = 100): Promise<CandleData[]> {
  const response = await fetch(
    `${BASE_API_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );
  const data = await response.json();
  
  return data.map((d: any[]) => ({
    time: d[0] / 1000,
    open: parseFloat(d[1]),
    high: parseFloat(d[2]),
    low: parseFloat(d[3]),
    close: parseFloat(d[4]),
    volume: parseFloat(d[5]),
  }));
}