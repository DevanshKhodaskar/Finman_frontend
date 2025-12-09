import React, { useState } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext.jsx";

const Signup = () => {
  const { isDark, toggleTheme } = useTheme();
  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        console.log(form);
      const res = await axios.post("https://finman-backend.vercel.app/api/auth/signup", form,{ withCredentials: true });
        console.log('Signup response:', res);
      alert(res.data.message || "Signup successful");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-purple-50 to-pink-100'}`}>
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 p-2 rounded-lg transition-all duration-200 ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        title="Toggle dark mode"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
      <div className={`w-full max-w-md rounded-2xl shadow-xl p-8 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              id="phone_number"
              name="phone_number"
              type="text"
              placeholder="Enter your phone number"
              value={form.phone_number}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 placeholder-gray-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 placeholder-gray-400"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg active:transform active:scale-95"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
