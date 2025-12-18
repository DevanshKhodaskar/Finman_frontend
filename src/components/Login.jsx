import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [form, setForm] = useState({
    phone_number: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.phone_number || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await authLogin(form.phone_number, form.password);

      console.log("Login response:", res.data);

      if (res.data && res.data.ok === true) {
        setSuccess(true);
        // Navigate to dashboard after successful login
        navigate("/dashboard", { replace: true });
      } else {
        setError(res.data?.message || res.data?.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.response?.status === 400) {
        setError(err.response?.data?.error || "Invalid credentials");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-purple-50 to-blue-50'}`}>
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 p-2 rounded-lg transition-all duration-200 ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        title="Toggle dark mode"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Back Button */}
      <Link 
        to="/"
        className={`absolute top-6 left-6 flex items-center gap-2 font-semibold transition-colors duration-200 ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-purple-600 hover:text-purple-800'}`}
      >
        <span className="text-2xl">←</span>
        <span>Back</span>
      </Link>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">₹</span>
            </div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>FinMan</h1>
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Welcome Back</h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Login to your dashboard and manage your finances</p>
        </div>

        {/* Login Card */}
        <div className={`rounded-2xl shadow-xl p-8 border transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-100'}`}>
          {error && (
            <div className={`px-4 py-3 rounded-lg mb-6 flex items-start gap-3 border ${isDark ? 'bg-red-900/30 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <span className="text-xl">⚠️</span>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className={`px-4 py-3 rounded-lg mb-6 flex items-start gap-3 border ${isDark ? 'bg-green-900/30 border-green-700 text-green-400' : 'bg-green-50 border-green-200 text-green-700'}`}>
              <span className="text-xl">✅</span>
              <p className="text-sm">Login successful! Redirecting to dashboard...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number */}
            <div>
              <label htmlFor="phone_number" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-indigo-400' : 'text-purple-900'}`}>
                Phone Number
              </label>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                placeholder="Enter Your 10 digit number ex: 9876543210"
                value={form.phone_number}
                onChange={handleChange}
                disabled={loading}
                required
                className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-200 placeholder-gray-400 disabled:cursor-not-allowed border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500 disabled:bg-gray-600' : 'border-purple-200 focus:border-purple-500 disabled:bg-gray-100'}`}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={`block text-sm font-semibold mb-2 ${isDark ? 'text-indigo-400' : 'text-purple-900'}`}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
                className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-200 placeholder-gray-400 disabled:cursor-not-allowed border-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500 disabled:bg-gray-600' : 'border-purple-200 focus:border-purple-500 disabled:bg-gray-100'}`}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:transform active:scale-95 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDark ? 'border-gray-600' : 'border-purple-200'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
            </div>
          </div>

          {/* Telegram Option */}
          <button 
            type="button"
            onClick={() => window.open('https://t.me/finman_dev_bot', '_blank')}
            className={`w-full flex items-center justify-center gap-3 font-semibold py-3 px-4 rounded-lg transition-all duration-200 border-2 ${isDark ? 'bg-gray-700 border-blue-600 hover:border-blue-500 hover:bg-gray-600 text-blue-400' : 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100 text-blue-700'}`}
          >
            <span className="text-2xl">💬</span>
            <span>Use Telegram Bot Instead</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account? 
            <span className={`font-semibold ml-1 ${isDark ? 'text-indigo-400' : 'text-purple-600'}`}>Use Telegram Bot to get started!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
