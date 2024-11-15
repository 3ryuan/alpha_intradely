import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Lock, Zap, Check } from 'lucide-react';
import { Switch } from '../components/ui/switch';
import { loadStripe } from '@stripe/stripe-js';

// Define pricing data
const PRICING_DATA = {
  monthly: {
    basic: {
      price: 29,
      priceId: 'price_basic_monthly'
    },
    pro: {
      price: 79,
      priceId: 'price_pro_monthly'
    },
    enterprise: {
      price: 199,
      priceId: 'price_enterprise_monthly'
    }
  },
  yearly: {
    basic: {
      price: 290,
      priceId: 'price_basic_yearly'
    },
    pro: {
      price: 790,
      priceId: 'price_pro_yearly'
    },
    enterprise: {
      price: 1990,
      priceId: 'price_enterprise_yearly'
    }
  }
};

const HomePage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (priceId: string) => {
    try {
      setIsLoading(true);
      
      // Replace with your actual API endpoint
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          isYearly
        }),
      });

      const { sessionId } = await response.json();
      
      // Make sure to initialize Stripe with your publishable key
      const stripe = await loadStripe('your_publishable_key');
      
      if (stripe) {
        // Redirect to Stripe Checkout
        await stripe.redirectToCheckout({
          sessionId
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pricing = isYearly ? PRICING_DATA.yearly : PRICING_DATA.monthly;
  const savingPercentage = 17; // Approximately 2 months free

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <BarChart2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">CryptoSignals</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Advanced Crypto Trading</span>
            <span className="block text-blue-600">Signals & Analysis</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Get real-time trading signals, advanced technical analysis, and market insights for cryptocurrency trading.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link
              to="/pricing"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Analysis</h3>
              <p className="text-gray-600">Get instant technical analysis and trading signals for major cryptocurrencies.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Price Updates</h3>
              <p className="text-gray-600">Track cryptocurrency prices in real-time with advanced charting capabilities.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
              <p className="text-gray-600">Enterprise-grade security to protect your data and trading information.</p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that best fits your needs
            </p>
            
            {/* Billing Toggle */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className={`text-sm ${!isYearly ? 'font-semibold' : ''}`}>Monthly</span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <span className={`text-sm ${isYearly ? 'font-semibold' : ''}`}>
                Yearly
                {isYearly && (
                  <span className="ml-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    Save {savingPercentage}%
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-semibold text-gray-900">Basic</h3>
                <p className="mt-4 text-gray-500">Perfect for getting started</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${pricing.basic.price}
                  </span>
                  <span className="text-gray-500">/{isYearly ? 'year' : 'month'}</span>
                </p>
                <button
                  onClick={() => handleSubscribe(pricing.basic.priceId)}
                  disabled={isLoading}
                  className="mt-8 w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Get Started'}
                </button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Real-time price updates</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Basic technical analysis</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>5 trading pairs</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-500">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-semibold text-gray-900">Pro</h3>
                <p className="mt-4 text-gray-500">For serious traders</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${pricing.pro.price}
                  </span>
                  <span className="text-gray-500">/{isYearly ? 'year' : 'month'}</span>
                </p>
                <button
                  onClick={() => handleSubscribe(pricing.pro.priceId)}
                  disabled={isLoading}
                  className="mt-8 w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Get Started'}
                </button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>All Basic features</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Advanced technical analysis</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>20 trading pairs</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Email alerts</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-semibold text-gray-900">Enterprise</h3>
                <p className="mt-4 text-gray-500">For professional traders</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${pricing.enterprise.price}
                  </span>
                  <span className="text-gray-500">/{isYearly ? 'year' : 'month'}</span>
                </p>
                <button
                  onClick={() => handleSubscribe(pricing.enterprise.priceId)}
                  disabled={isLoading}
                  className="mt-8 w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Get Started'}
                </button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>All Pro features</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Unlimited trading pairs</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Custom indicators</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>24/7 support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;