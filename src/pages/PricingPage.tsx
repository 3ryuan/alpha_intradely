import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_publishable_key'); // Replace with your Stripe publishable key

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubscribe = async (priceId: string) => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // In a real application, you would make an API call to your backend to create a checkout session
      // For demo purposes, we'll just redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that best fits your needs
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Basic Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-semibold text-gray-900">Basic</h3>
              <p className="mt-4 text-gray-500">Perfect for getting started</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">$29</span>
                <span className="text-gray-500">/month</span>
              </p>
              <button
                onClick={() => handleSubscribe('price_basic')}
                className="mt-8 w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700"
              >
                Get Started
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
                <span className="text-4xl font-extrabold text-gray-900">$79</span>
                <span className="text-gray-500">/month</span>
              </p>
              <button
                onClick={() => handleSubscribe('price_pro')}
                className="mt-8 w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700"
              >
                Get Started
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
                <span className="text-4xl font-extrabold text-gray-900">$199</span>
                <span className="text-gray-500">/month</span>
              </p>
              <button
                onClick={() => handleSubscribe('price_enterprise')}
                className="mt-8 w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700"
              >
                Get Started
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
    </div>
  );
};

export default PricingPage;