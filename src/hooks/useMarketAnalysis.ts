import { useState, useEffect } from 'react';
import { Signal } from '../types';
import { fetchKlines } from '../services/binanceApi';
import { analyzeMarket } from '../services/technicalAnalysis';

const TIMEFRAMES = ['15m', '30m', '1h', '4h'] as const;
const ANALYSIS_INTERVAL = 60000; // 1 minute

export const useMarketAnalysis = (symbol: string) => {
  const [signals, setSignals] = useState<Signal[]>([]);

  useEffect(() => {
    const analyzeTimeframe = async (timeframe: string) => {
      try {
        const data = await fetchKlines(symbol, timeframe);
        const analysis = await analyzeMarket(data, symbol);
        
        setSignals(prev => {
          const newSignals = prev.filter(s => 
            s.symbol !== symbol || s.timeframe !== timeframe
          );
          return [{
            symbol,
            timeframe,
            signal: analysis.signal,
            strength: analysis.strength,
            timestamp: Date.now(),
            reason: analysis.reason,
          }, ...newSignals].slice(0, 20);
        });
      } catch (error) {
        console.error(`Error analyzing ${timeframe}:`, error);
      }
    };

    const analyzeAllTimeframes = () => {
      TIMEFRAMES.forEach(timeframe => {
        analyzeTimeframe(timeframe);
      });
    };

    analyzeAllTimeframes();
    const intervalId = setInterval(analyzeAllTimeframes, ANALYSIS_INTERVAL);

    return () => clearInterval(intervalId);
  }, [symbol]);

  return signals;
};