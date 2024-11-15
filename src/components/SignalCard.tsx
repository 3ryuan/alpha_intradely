import React from 'react';
import { Signal } from '../types';
import { TrendingUp, TrendingDown, Minus, Target, ArrowUpDown, Brain, LineChart } from 'lucide-react';

interface SignalCardProps {
  signal: Signal;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  const getSignalColor = (signal: Signal) => {
    switch (signal.signal) {
      case 'buy':
        return 'bg-green-100 text-green-800';
      case 'sell':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSignalIcon = (signal: Signal) => {
    switch (signal.signal) {
      case 'buy':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'sell':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatPrice = (price: number) => {
    return price >= 1 
      ? price.toFixed(2) 
      : price.toFixed(8);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{signal.symbol}</span>
          <span className="text-sm text-gray-500">({signal.timeframe})</span>
        </div>
        {getSignalIcon(signal)}
      </div>

      {/* Signal Strength */}
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSignalColor(signal)} mb-4`}>
        {signal.signal.toUpperCase()} ({signal.strength}%)
      </div>
      
      {/* Trading Levels Section */}
      {signal.levels && (
        <div className="mb-4 bg-blue-50 p-3 rounded-md border border-blue-100">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-1">
              <ArrowUpDown className="w-4 h-4 text-blue-600" />
              <span className="text-gray-600">Entry:</span>
            </div>
            <span className="font-medium">${formatPrice(signal.levels?.entry ?? 0)}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-gray-600">Take Profit:</span>
            </div>
            <span className="font-medium text-green-600">
              ${formatPrice(signal.levels.takeProfit)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-red-600" />
              <span className="text-gray-600">Stop Loss:</span>
            </div>
            <span className="font-medium text-red-600">
              ${formatPrice(signal.levels.stopLoss)}
            </span>
          </div>
          
          <div className="text-xs text-gray-500 mt-2 text-center">
            Risk/Reward Ratio: {signal.levels.riskRewardRatio}:1
          </div>
        </div>
      )}

      {/* Analysis Sections */}
      <div className="space-y-3">
        {/* Technical Analysis */}
        <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <LineChart className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Technical Analysis</span>
          </div>
          <p className="text-sm text-gray-600">
            {signal.reason.split('ML model predicts')[0].trim()}
          </p>
        </div>

        {/* ML Prediction */}
        {signal.reason.includes('ML model predicts') && (
          <div className="bg-purple-50 p-3 rounded-md border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">ML Prediction</span>
            </div>
            <p className="text-sm text-gray-600">
              {signal.reason.split('ML model predicts')[1].split('.')[0].trim()}
            </p>
          </div>
        )}
      </div>

      {/* Timestamp */}
      <div className="text-xs text-gray-400 mt-3 text-right">
        {new Date(signal.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SignalCard;