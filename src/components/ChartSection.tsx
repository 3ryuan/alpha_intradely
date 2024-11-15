import React from 'react';
import { CryptoPair, CandleData } from '../types';
import TradingViewChart from './TradingViewChart';
import ErrorBoundary from './ErrorBoundary';
import { Loader } from 'lucide-react';

interface ChartSectionProps {
  selectedPair: CryptoPair;
  chartData: {
    chartData: CandleData[];
    error: string | null;
    isLoading: boolean;
  };
  onPairChange: (pair: CryptoPair) => void;
  cryptoPairs: CryptoPair[];
}

const ChartSection: React.FC<ChartSectionProps> = ({
  selectedPair,
  chartData: { chartData, error, isLoading },
  onPairChange,
  cryptoPairs,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedPair.symbol}
          onChange={(e) => {
            const pair = cryptoPairs.find(p => p.symbol === e.target.value);
            if (pair) onPairChange(pair);
          }}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {cryptoPairs.map(pair => (
            <option key={pair.symbol} value={pair.symbol}>
              {pair.baseAsset}/{pair.quoteAsset}
            </option>
          ))}
        </select>
      </div>
      <ErrorBoundary>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <TradingViewChart data={chartData} symbol={selectedPair.symbol} />
        )}
      </ErrorBoundary>
    </div>
  );
};

export default ChartSection;