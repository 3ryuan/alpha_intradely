import React from 'react';
import { Signal } from '../types';
import SignalCard from './SignalCard';

interface SignalSectionProps {
  signals: Signal[];
  selectedPair: string;
}

const SignalSection: React.FC<SignalSectionProps> = ({ signals, selectedPair }) => {
  const filteredSignals = signals.filter(signal => signal.symbol === selectedPair);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Trading Signals</h2>
      <div className="space-y-4">
        {filteredSignals.length > 0 ? (
          filteredSignals
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((signal, index) => (
              <SignalCard 
                key={`${signal.symbol}-${signal.timeframe}-${index}`} 
                signal={signal} 
              />
            ))
        ) : (
          <div className="text-gray-500 text-center py-4">
            No signals available for {selectedPair}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalSection;