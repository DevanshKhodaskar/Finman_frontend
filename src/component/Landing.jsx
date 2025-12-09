import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();
  
  const handleTelegramClick = () => {
    window.open('https://t.me/finman_dev_bot', '_blank');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-purple-50 to-blue-50'}`}>
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-colors duration-300 ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-purple-100'}`}>
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">₹</span>
              </div>
              <span className={`text-2xl font-bold hidden sm:inline ${isDark ? 'text-white' : 'text-purple-900'}`}>FinMan</span>
            </div>
            <div className={`hidden md:flex space-x-8 ${isDark ? 'text-gray-300' : 'text-purple-700'}`}>
              <a href="#features" className={`font-medium transition-colors duration-200 ${isDark ? 'hover:text-white' : 'hover:text-purple-900'}`}>Features</a>
              <a href="#how-it-works" className={`font-medium transition-colors duration-200 ${isDark ? 'hover:text-white' : 'hover:text-purple-900'}`}>How It Works</a>
              <a href="#why-choose" className={`font-medium transition-colors duration-200 ${isDark ? 'hover:text-white' : 'hover:text-purple-900'}`}>Why Us</a>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 ${isDark ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                title="Toggle dark mode"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <Link to="/login" className={`px-6 py-2 font-semibold rounded-lg transition-all duration-200 border-2 ${isDark ? 'text-indigo-400 border-indigo-500 hover:bg-indigo-500/10' : 'text-purple-700 border-purple-400 hover:bg-purple-50'}`}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-purple-900'}`}>
              Manage Your Money
              <span className={`block bg-clip-text text-transparent ${
                isDark 
                  ? 'bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400' 
                  : 'bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500'
              }`}>
                Smarter Than Ever
              </span>
            </h1>
            <p className={`text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
              Track expenses, visualize spending patterns, and take control of your finances with our powerful dashboard or Telegram bot. 
              Simple. Secure. Accessible.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              to="/login" 
              className={`px-8 py-4 text-white text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg text-center block ${
                isDark
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-purple-600/50'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/50'
              }`}
            >
              🚀 Dashboard Login
            </Link>
            <button 
              onClick={handleTelegramClick}
              className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-center ${
                isDark
                  ? 'bg-gray-700 text-white border-2 border-gray-600 hover:bg-gray-600'
                  : 'bg-white text-purple-700 border-2 border-purple-300 hover:bg-purple-50'
              }}`}
            >
              💬 Open Telegram Bot
            </button>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            <div className={`backdrop-blur rounded-xl p-4 md:p-6 border shadow-sm hover:shadow-md transition-shadow ${
              isDark
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-white/80 border-purple-100'
            }`}>
              <p className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-500">10K+</p>
              <p className={`text-sm md:text-base mt-2 ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>Active Users</p>
            </div>
            <div className={`backdrop-blur rounded-xl p-4 md:p-6 border shadow-sm hover:shadow-md transition-shadow ${
              isDark
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-white/80 border-purple-100'
            }`}>
              <p className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">∞</p>
              <p className={`text-sm md:text-base mt-2 ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>Free Forever</p>
            </div>
            <div className={`backdrop-blur rounded-xl p-4 md:p-6 border shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1 ${
              isDark
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-white/80 border-purple-100'
            }`}>
              <p className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">2</p>
              <p className={`text-sm md:text-base mt-2 ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>Platforms</p>
            </div>
          </div>
        </div>

        {/* Floating Feature Cards */}
        <div className="mt-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`group p-8 rounded-2xl border-2 hover:shadow-xl transition-all duration-300 shadow-md hover:scale-105 ${
              isDark
                ? 'bg-gray-800 border-gray-700 hover:border-purple-500'
                : 'bg-gradient-to-br from-purple-50 to-white border-purple-200 hover:border-purple-400'
            }`}>
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 className={`font-bold text-xl mb-3 ${isDark ? 'text-white' : 'text-purple-900'}`}>Beautiful Analytics</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>Interactive charts and graphs powered by Chart.js to visualize your spending patterns</p>
            </div>
            <div className={`group p-8 rounded-2xl border-2 hover:shadow-xl transition-all duration-300 shadow-md hover:scale-105 ${
              isDark
                ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
                : 'bg-gradient-to-br from-blue-50 to-white border-blue-200 hover:border-blue-400'
            }`}>
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🤖</div>
              <h3 className={`font-bold text-xl mb-3 ${isDark ? 'text-white' : 'text-purple-900'}`}>Telegram Bot</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>Quick expense tracking directly in Telegram with natural conversation style</p>
            </div>
            <div className={`group p-8 rounded-2xl border-2 hover:shadow-xl transition-all duration-300 shadow-md hover:scale-105 ${
              isDark
                ? 'bg-gray-800 border-gray-700 hover:border-green-500'
                : 'bg-gradient-to-br from-green-50 to-white border-green-200 hover:border-green-400'
            }`}>
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🔒</div>
              <h3 className={`font-bold text-xl mb-3 ${isDark ? 'text-white' : 'text-purple-900'}`}>Secure & Private</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>Your financial data is encrypted and only accessible to you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-transparent via-purple-900/20 to-transparent'
          : 'bg-gradient-to-b from-transparent via-purple-50/50 to-transparent'
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-purple-900'
            }`}>
              Powerful Features
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>Everything you need to manage your money effectively</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className={`flex gap-6 p-6 rounded-xl border hover:shadow-lg transition-all duration-300 ${
              isDark
                ? 'bg-gray-800 border-gray-700 hover:border-purple-500'
                : 'bg-white border-purple-100 hover:border-purple-300'
            }`}>
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-3xl">💰</span>
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Smart Categorization</h3>
                <p className={isDark ? 'text-gray-300' : 'text-purple-600'}>Automatically organize expenses into categories like Food, Transport, Shopping, and more</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className={`flex gap-6 p-6 rounded-xl border hover:shadow-lg transition-all duration-300 ${
              isDark
                ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
                : 'bg-white border-blue-100 hover:border-blue-300'
            }`}>
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-3xl">📱</span>
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Multi-Platform</h3>
                <p className={isDark ? 'text-gray-300' : 'text-purple-600'}>Access from web dashboard or Telegram bot, sync across all your devices</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className={`flex gap-6 p-6 rounded-xl border hover:shadow-lg transition-all duration-300 ${
              isDark
                ? 'bg-gray-800 border-gray-700 hover:border-green-500'
                : 'bg-white border-green-100 hover:border-green-300'
            }`}>
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-3xl">📈</span>
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Real-time Insights</h3>
                <p className={isDark ? 'text-gray-300' : 'text-purple-600'}>Get instant reports, spending trends, and financial summaries as you track</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className={`flex gap-6 p-6 rounded-xl border hover:shadow-lg transition-all duration-300 ${
              isDark
                ? 'bg-gray-800 border-gray-700 hover:border-pink-500'
                : 'bg-white border-pink-100 hover:border-pink-300'
            }`}>
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-3xl">⚡</span>
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Quick Tracking</h3>
                <p className={isDark ? 'text-gray-300' : 'text-purple-600'}>Log expenses in seconds from anywhere with our simple, intuitive interface</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className={`flex gap-6 p-6 rounded-xl border hover:shadow-lg transition-all duration-300 ${
              isDark
                ? 'bg-gray-800 border-gray-700 hover:border-yellow-500'
                : 'bg-white border-yellow-100 hover:border-yellow-300'
            }`}>
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-3xl">🎯</span>
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Visual Charts</h3>
                <p className={isDark ? 'text-gray-300' : 'text-purple-600'}>Beautiful pie charts, bar charts, and trend lines to understand your finances</p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className={`flex gap-6 p-6 rounded-xl border hover:shadow-lg transition-all duration-300 ${
              isDark
                ? 'bg-gray-800 border-gray-700 hover:border-indigo-500'
                : 'bg-white border-indigo-100 hover:border-indigo-300'
            }`}>
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-3xl">✏️</span>
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Edit & Delete</h3>
                <p className={isDark ? 'text-gray-300' : 'text-purple-600'}>Easily edit or delete any transaction with full control over your data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={`py-20 transition-colors duration-300 ${isDark ? 'bg-gray-900/50' : ''}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-purple-900'}`}>
              How It Works
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>Get started in four simple steps</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto justify-center items-center md:items-start">
            {/* Step 1 */}
            <div className="relative text-center flex-1">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-white text-5xl font-bold bg-gradient-to-br from-purple-500 to-purple-700`}>
                1
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-purple-900'}`}>Easy Signup</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
                Sign up quickly and easily using our Telegram chatbot. Start tracking in seconds with no hassle.
              </p>
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-blue-400"></div>
              <span className="text-3xl text-purple-400">→</span>
            </div>

            {/* Step 2 */}
            <div className="relative text-center flex-1">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-white text-5xl font-bold bg-gradient-to-br from-blue-500 to-blue-700`}>
                2
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-purple-900'}`}>Add Expenses</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
                Add expenses via Telegram bot using text or images. Categorize and track instantly from anywhere.
              </p>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
              <span className="text-3xl text-blue-400">→</span>
            </div>

            {/* Step 3 */}
            <div className="relative text-center flex-1">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-white text-5xl font-bold bg-gradient-to-br from-indigo-500 to-indigo-700`}>
                3
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-purple-900'}`}>Login to Dashboard</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
                Access your dashboard with your credentials to view all your financial data in one place.
              </p>
            </div>

            {/* Arrow 3 */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-12 h-1 bg-gradient-to-r from-indigo-400 to-green-400"></div>
              <span className="text-3xl text-indigo-400">→</span>
            </div>

            {/* Step 4 */}
            <div className="relative text-center flex-1">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-white text-5xl font-bold bg-gradient-to-br from-green-500 to-green-700`}>
                4
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-purple-900'}`}>View Data</h3>
              <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
                View beautiful charts, insights, and analytics about your spending patterns and financial health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-choose" className={`py-20 transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-transparent via-blue-900/10 to-transparent'
          : 'bg-gradient-to-b from-transparent via-blue-50/30 to-transparent'
      }`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-purple-900'}`}>
              Why Choose FinMan?
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>The smarter way to manage your finances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className={`rounded-xl p-8 border shadow-md hover:shadow-lg transition-shadow ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-purple-100'
            }`}>
              <div className="text-4xl mb-4">✨</div>
              <h3 className={`font-bold text-xl mb-3 ${isDark ? 'text-white' : 'text-purple-900'}`}>Simple & Intuitive</h3>
              <p className={isDark ? 'text-gray-300' : 'text-purple-600'}>Clean, modern interface designed with user experience in mind. No learning curve needed.</p>
            </div>
            <div className={`rounded-xl p-8 border shadow-md hover:shadow-lg transition-shadow ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-blue-100'
            }`}>
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className={`font-bold text-xl mb-3 ${isDark ? 'text-white' : 'text-purple-900'}`}>Always Available</h3>
              <p className={isDark ? 'text-gray-300' : 'text-purple-600'}>24/7 access through web dashboard or Telegram. Track anytime, anywhere, on any device.</p>
            </div>
            <div className={`rounded-xl p-8 border shadow-md hover:shadow-lg transition-shadow ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-green-100'
            }`}>
              <div className="text-4xl mb-4">🚀</div>
              <h3 className={`font-bold text-xl mb-3 ${isDark ? 'text-white' : 'text-purple-900'}`}>Fast & Reliable</h3>
              <p className={isDark ? 'text-gray-300' : 'text-purple-600'}>Lightning-fast responses and real-time data sync. Built on modern, scalable technology.</p>
            </div>
            <div className={`rounded-xl p-8 border shadow-md hover:shadow-lg transition-shadow ${
              isDark
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-pink-100'
            }`}>
              <div className="text-4xl mb-4">💪</div>
              <h3 className={`font-bold text-xl mb-3 ${isDark ? 'text-white' : 'text-purple-900'}`}>Powerful Features</h3>
              <p className={isDark ? 'text-gray-300' : 'text-purple-600'}>Advanced analytics, categorization, and insights to help you understand your money.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className={`rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto shadow-2xl ${
            isDark
              ? 'bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600'
              : 'bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Control Your Money?
            </h2>
            <p className="text-xl text-white/95 mb-12 max-w-2xl mx-auto leading-relaxed">
              Start tracking your expenses today. Join thousands of users taking control of their finances with FinMan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login"
                className="px-8 py-4 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg text-center"
              >
                Login to Dashboard
              </Link>
              <button 
                onClick={handleTelegramClick}
                className="px-8 py-4 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-all duration-200 border-2 border-white/50 text-center"
              >
                Try Telegram Bot
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t backdrop-blur transition-colors duration-300 ${
        isDark
          ? 'border-gray-700 bg-gray-900/50'
          : 'border-purple-200 bg-white/50'
      }`}>
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">₹</span>
              </div>
              <div>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>FinMan</p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-purple-600'}`}>Smart Expense Tracking</p>
              </div>
            </div>
            <div className={`text-center text-sm ${
              isDark ? 'text-gray-400' : 'text-purple-600'
            }`}>
              <p>© 2025 FinMan. All rights reserved.</p>
              <p className="mt-2">Manage your finances, your way.</p>
            </div>
            <div className="flex gap-6">
              <a href="https://t.me/finman_dev_bot" target="_blank" rel="noopener noreferrer" className={`font-medium transition-colors ${
                isDark
                  ? 'text-gray-300 hover:text-white'
                  : 'text-purple-600 hover:text-purple-900'
              }`}>
                Telegram Bot
              </a>
              <a href="#features" className={`font-medium transition-colors ${
                isDark
                  ? 'text-gray-300 hover:text-white'
                  : 'text-purple-600 hover:text-purple-900'
              }`}>
                Features
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
