import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useBinanceWebSocket } from '../hooks/useBinanceWebSocket';
import { useChartData } from '../hooks/useChartData';
import { useMarketAnalysis } from '../hooks/useMarketAnalysis';
import Header from '../components/Header';
import ChartSection from '../components/ChartSection';
import SignalSection from '../components/SignalSection';
import CurrentPrice from '../components/CurrentPrice';
import { CryptoPair } from '../types';
import { LogOut } from 'lucide-react';

const CRYPTO_PAIRS: CryptoPair[] = [
  { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT' },
  { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT' },
  { symbol: 'BNBUSDT', baseAsset: 'BNB', quoteAsset: 'USDT' },
  { symbol: 'ADAUSDT', baseAsset: 'ADA', quoteAsset: 'USDT' },
  { symbol: 'DOGEUSDT', baseAsset: 'DOGE', quoteAsset: 'USDT' },
];

const Dashboard: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<CryptoPair>(CRYPTO_PAIRS[0]);
  const price = useBinanceWebSocket(selectedPair.symbol);
  const chartDataState = useChartData(selectedPair.symbol, price?.price);
  const signals = useMarketAnalysis(selectedPair.symbol);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Header />
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ChartSection
              selectedPair={selectedPair}
              chartData={chartDataState}
              onPairChange={setSelectedPair}
              cryptoPairs={CRYPTO_PAIRS}
            />
            <CurrentPrice pair={selectedPair} price={price} />
          </div>
          <div className="lg:col-span-1">
            <SignalSection signals={signals} selectedPair={selectedPair.symbol} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;