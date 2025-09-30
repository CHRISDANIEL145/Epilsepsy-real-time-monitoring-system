
import React, { useState } from 'react';
import { UserRole } from '../types';
import type { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('patient@health.io');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin({
        id: 'patient-01',
        name: 'Jane Doe',
        role: UserRole.Patient,
        photoUrl: 'https://picsum.photos/100',
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-300">Epilepsy Monitoring</h1>
            <p className="text-blue-400/80">Real-time insights, real-time care.</p>
        </div>
        <div className="bg-[#16213e]/60 backdrop-blur-sm border border-blue-900/50 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-200 mb-6">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-800/60 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="mb-6">
               <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-blue-800/60 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="********"
                required
              />
            </div>
            <div className="flex items-center justify-between mb-6">
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition">Forgot Password?</a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                    'Login'
                )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;