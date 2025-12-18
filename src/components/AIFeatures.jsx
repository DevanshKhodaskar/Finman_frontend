import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

const AIFeatures = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (


    
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-purple-50 to-lavender-100'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 border-b shadow-sm transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-lg sm:text-2xl font-bold text-white">₹</span>
              </div>
              <div className="min-w-0">
                <h1 className={`text-xl sm:text-3xl font-bold truncate ${isDark ? 'text-white' : 'text-purple-900'}`}>FinMan</h1>
                <p className={`text-xs sm:text-sm truncate ${isDark ? 'text-gray-400' : 'text-purple-600'}`}>Track your finances effortlessly</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={toggleTheme}
                className={`px-4 md:px-6 py-2 rounded-lg transition-all duration-200 shadow-md text-sm md:text-base font-semibold ${isDark ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                title="Toggle dark mode"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <Link
                to="/dashboard"
                className="flex-1 sm:flex-none px-4 md:px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md text-sm md:text-base text-center"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <div className="text-5xl md:text-7xl mb-4 md:mb-6">🤖</div>
          <h1 className={`text-2xl sm:text-3xl md:text-5xl font-bold mb-2 md:mb-4 ${isDark ? 'text-white' : 'text-purple-900'}`}>
            AI Features Coming Soon
          </h1>
          <p className={`text-sm md:text-xl max-w-2xl mx-auto px-2 ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
            We're working on advanced AI-powered features to revolutionize your financial management experience. Stay tuned!
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {/* Smart Insights */}
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 hover:shadow-xl transition-shadow duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">✨</div>
            <h3 className={`text-lg md:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Smart Insights</h3>
            <p className={`text-xs md:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
              Get AI-powered insights about your spending patterns and receive personalized recommendations to optimize your budget.
            </p>
          </div>

          {/* Predictive Analytics */}
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 hover:shadow-xl transition-shadow duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">🔮</div>
            <h3 className={`text-lg md:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Predictive Analytics</h3>
            <p className={`text-xs md:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
              Forecast your future expenses and income based on historical data and AI algorithms for better financial planning.
            </p>
          </div>

          {/* Smart Categorization */}
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 hover:shadow-xl transition-shadow duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">🏷️</div>
            <h3 className={`text-lg md:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Auto Categorization</h3>
            <p className={`text-xs md:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
              AI automatically categorizes your transactions, saving time and ensuring accurate expense tracking every time.
            </p>
          </div>

          {/* Anomaly Detection */}
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 hover:shadow-xl transition-shadow duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">🚨</div>
            <h3 className={`text-lg md:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Anomaly Detection</h3>
            <p className={`text-xs md:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
              Receive alerts when unusual spending patterns are detected, helping you identify potential fraud or overspending.
            </p>
          </div>

          {/* Budget Optimization */}
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 hover:shadow-xl transition-shadow duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">💡</div>
            <h3 className={`text-lg md:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Budget Optimizer</h3>
            <p className={`text-xs md:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
              Get AI-driven suggestions on how to allocate your budget more efficiently across different categories.
            </p>
          </div>

          {/* Intelligent Reporting */}
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 hover:shadow-xl transition-shadow duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
            <div className="text-4xl md:text-5xl mb-3 md:mb-4">📊</div>
            <h3 className={`text-lg md:text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Smart Reports</h3>
            <p className={`text-xs md:text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
              Generate comprehensive, AI-analyzed reports with deep insights and actionable recommendations for your finances.
            </p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className={`rounded-2xl shadow-xl p-6 md:p-12 text-center mb-8 md:mb-12 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-2 border-gray-700' : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'}`}>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 ${isDark ? 'text-white' : 'text-white'}`}>Stay Updated</h2>
          <p className={`text-sm md:text-lg mb-4 md:mb-6 max-w-2xl mx-auto ${isDark ? 'text-gray-300 opacity-90' : 'text-white opacity-90'}`}>
            These incredible AI features are currently under development. We're excited to bring them to you soon!
          </p>
          <div className="inline-block">
            <Link
              to="/dashboard"
              className={`px-6 md:px-8 py-2 md:py-3 font-semibold rounded-lg transition-all duration-200 inline-block text-sm md:text-base ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-purple-600 hover:bg-purple-50'}`}
            >
              Continue to Dashboard
            </Link>
          </div>
        </div>

        {/* Timeline Section */}
        <div className={`rounded-2xl shadow-lg p-6 md:p-8 border-2 mb-8 md:mb-12 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
          <h2 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center ${isDark ? 'text-white' : 'text-purple-900'}`}>Development Roadmap</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Phase 1 */}
            <div className="text-center p-4 md:p-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 ${isDark ? 'bg-gray-700' : 'bg-purple-100'}`}>
                <span className={`text-sm md:text-lg font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>1</span>
              </div>
              <h3 className={`text-base md:text-lg font-bold mb-1 md:mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Phase 1: Q1 2025</h3>
              <p className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>Smart Insights & Auto Categorization</p>
            </div>

            {/* Phase 2 */}
            <div className="text-center p-4 md:p-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 ${isDark ? 'bg-gray-700' : 'bg-purple-100'}`}>
                <span className={`text-sm md:text-lg font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>2</span>
              </div>
              <h3 className={`text-base md:text-lg font-bold mb-1 md:mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Phase 2: Q2 2025</h3>
              <p className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>Predictive Analytics & Anomaly Detection</p>
            </div>

            {/* Phase 3 */}
            <div className="text-center p-4 md:p-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 ${isDark ? 'bg-gray-700' : 'bg-purple-100'}`}>
                <span className={`text-sm md:text-lg font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>3</span>
              </div>
              <h3 className={`text-base md:text-lg font-bold mb-1 md:mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Phase 3: Q3 2025</h3>
              <p className={`text-xs md:text-sm ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>Budget Optimizer & Smart Reports</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className={`rounded-2xl shadow-lg p-6 md:p-8 border-2 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
          <h2 className={`text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center ${isDark ? 'text-white' : 'text-purple-900'}`}>Frequently Asked Questions</h2>
          <div className="space-y-4 md:space-y-6">
            <div>
              <h3 className={`text-base md:text-lg font-bold mb-1 md:mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>When will AI features be available?</h3>
              <p className={`text-xs md:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
                We're working hard to roll out AI features in phases starting from Q1 2025. Follow our updates for exact launch dates!
              </p>
            </div>

            <div>
              <h3 className={`text-base md:text-lg font-bold mb-1 md:mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Will these features be free?</h3>
              <p className={`text-xs md:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
                Yes! FinMan is committed to providing AI features free forever. Your data is safe and never shared with third parties.
              </p>
            </div>

            <div>
              <h3 className={`text-base md:text-lg font-bold mb-1 md:mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>How will AI improve my financial management?</h3>
              <p className={`text-xs md:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
                AI will help you understand spending patterns, predict future expenses, detect unusual activity, and provide actionable recommendations for better budget management.
              </p>
            </div>

            <div>
              <h3 className={`text-base md:text-lg font-bold mb-1 md:mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>Is my data secure?</h3>
              <p className={`text-xs md:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-purple-600'}`}>
                Absolutely. All AI processing happens securely on our servers. Your financial data is encrypted and protected with the highest standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t mt-8 md:mt-12 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 text-center">
          <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-purple-600'}`}>
            © 2025 FinMan. All rights reserved. | Powered by AI for Better Financial Management
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AIFeatures;
