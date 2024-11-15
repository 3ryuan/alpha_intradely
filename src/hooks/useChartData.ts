import { useState, useEffect, useCallback, useRef } from 'react';
import { CandleData } from '../types';
import { fetchKlines } from '../services/binanceApi';

export const useChartData = (symbol: string, currentPrice: string | undefined) => {
  const [chartData, setChartData] = useState<CandleData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastUpdateRef = useRef<number>(0);

  const updateChartData = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchKlines(symbol, '1h');
      setChartData(data);
    } catch (error) {
      setError('Failed to fetch chart data');
      console.error('Error fetching klines:', error);
    } finally {
      setIsLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    setIsLoading(true);
    updateChartData();
    const intervalId = setInterval(updateChartData, 60000);
    return () => clearInterval(intervalId);
  }, [updateChartData]);

  useEffect(() => {
    if (!currentPrice || chartData.length === 0) return;

    const now = Date.now();
    if (now - lastUpdateRef.current < 1000) return; // Throttle updates to once per second
    lastUpdateRef.current = now;

    const price = parseFloat(currentPrice);
    const currentTime = Math.floor(now / 1000);
    const lastCandle = chartData[chartData.length - 1];

    if (currentTime - lastCandle.time < 3600) {
      setChartData(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.high === price && last.low === price && last.close === price) {
          return prev;
        }
        updated[updated.length - 1] = {
          ...last,
          high: Math.max(last.high, price),
          low: Math.min(last.low, price),
          close: price,
        };
        return updated;
      });
    }
  }, [currentPrice, chartData]);

  return { chartData, error, isLoading };
};