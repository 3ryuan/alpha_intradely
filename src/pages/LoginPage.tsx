import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock, Eye, EyeOff } from 'lucide-react';
import "../styles/Login.css";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Galaxy Background with Login Form */}
      <div className="flex flex-col justify-center items-start w-full md:w-1/2 px-8 md:px-16 galaxy-background relative text-white overflow-hidden">
        <div className="absolute inset-0 galaxy-animation"></div>
        <div className="relative z-10 w-full max-w-md mx-auto space-y-6">
          {/* Header with Logo and Language Selector */}
          <div className="flex items-center justify-between w-full mb-8">
            <div className="logo text-2xl font-bold">YourLogo</div>
            <select className="language-dropdown" defaultValue="EN">
              <option value="EN">EN</option>
              <option value="CH">CH</option>
            </select>
          </div>
          <h5 className="text-lg font-semibold">HELLO</h5>
          <p className="text-sm mb-4">Please enter your details below</p>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="w-full">
              <label htmlFor="username" className="input-label">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-field w-full"
              />
            </div>
            <div className="w-full relative">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field w-full"
              />
              <span
                className="toggle-password-icon"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="submit-button"
            >
              <Lock className="h-5 w-5 mr-2 inline-block" />
              Sign in
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Trading Image */}
      <div className="hidden md:flex w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(/path-to-your-trading-image.jpg)' }}>
        <div className="w-full h-full bg-black bg-opacity-30 flex items-center justify-center">
          <h2 className="text-white text-2xl font-semibold px-8 text-center">
            Stay ahead with the latest in market signals
          </h2>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
