import React from 'react';
import { CryptoPair } from '../types';
import { TrendingUp } from 'lucide-react';

interface Props {
  pairs: CryptoPair[];
  prices: Record<string, { price: string }>;
}

const PriceDisplay: React.FC<Props> = ({ pairs, prices }) => {
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice >= 1 
      ? numPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : numPrice.toPrecision(6);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Live Prices</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {pairs.map(pair => {
          const currentPrice = prices[pair.symbol]?.price;
          return (
            <div 
              key={pair.symbol} 
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{pair.baseAsset}</span>
                <span className="text-xs text-gray-500">{pair.quoteAsset}</span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                ${currentPrice ? formatPrice(currentPrice) : '---'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceDisplay;