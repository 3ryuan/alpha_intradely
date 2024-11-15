import React from 'react';
import { TrendingUp } from 'lucide-react';
import { CryptoPair } from '../types';

interface Props {
  pair: CryptoPair;
  price: { price: string; timestamp: number } | null;
}

const CurrentPrice: React.FC<Props> = ({ pair, price }) => {
  const formatPrice = (priceStr: string) => {
    const numPrice = parseFloat(priceStr);
    return numPrice >= 1 
      ? numPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : numPrice.toPrecision(6);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Current Price</h2>
        </div>
        <span className="text-sm font-medium text-gray-500">
          {pair.baseAsset}/{pair.quoteAsset}
        </span>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <div className="text-3xl font-bold text-gray-900 text-center">
          ${price ? formatPrice(price.price) : '---'}
        </div>
        {price && (
          <div className="text-xs text-gray-500 text-center mt-2">
            Last updated: {new Date(price.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentPrice;