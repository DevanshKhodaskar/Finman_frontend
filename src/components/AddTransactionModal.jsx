import React, { useState } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext.jsx";

const AddTransactionModal = ({ isOpen, onClose, onSuccess }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Food",
    isIncome: false,
    time: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Other"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.name.trim()) {
      setError("Transaction name is required");
      return;
    }

    if (!formData.price || formData.price <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        isIncome: formData.isIncome,
        time: formData.time,
      };

      const res = await axios.post(
        "https://finman-backend.vercel.app/api/queries/",
        payload,
        { withCredentials: true }
      );

      if (res.data && res.data.ok) {
        setFormData({
          name: "",
          price: "",
          category: "Food",
          isIncome: false,
          time: new Date().toISOString().split("T")[0],
        });
        onSuccess();
        onClose();
      } else {
        setError(res.data?.error || "Failed to add transaction");
      }
    } catch (err) {
      console.error("Add transaction error:", err);
      
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.error || "Invalid input. Please check your data.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(err.response?.data?.error || "Error adding transaction. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-6 flex items-center justify-between ${isDark ? '' : ''}`}>
          <h2 className="text-2xl font-bold text-white">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={`p-6 space-y-5 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {error && (
            <div className={`border px-4 py-3 rounded-lg flex items-start gap-3 ${isDark ? 'bg-red-900/30 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <span className="text-xl">⚠️</span>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Type Toggle */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-indigo-400' : 'text-purple-900'}`}>Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isIncome: false }))
                }
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  !formData.isIncome
                    ? "bg-red-500 text-white shadow-lg"
                    : isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                💸 Expense
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isIncome: true }))
                }
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  formData.isIncome
                    ? "bg-green-500 text-white shadow-lg"
                    : isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                💰 Income
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-indigo-400' : 'text-purple-900'}`}>
              Transaction Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Grocery Shopping"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' : 'border-purple-200 focus:border-purple-500'}`}
            />
          </div>

          {/* Amount */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-indigo-400' : 'text-purple-900'}`}>
              Amount (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' : 'border-purple-200 focus:border-purple-500'}`}
            />
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-indigo-400' : 'text-purple-900'}`}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' : 'bg-white border-purple-200 focus:border-purple-500'}`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-indigo-400' : 'text-purple-900'}`}>
              Date
            </label>
            <input
              type="date"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500' : 'border-purple-200 focus:border-purple-500'}`}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-colors ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg transition-all ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-purple-600 hover:to-purple-700 shadow-lg"
              }`}
            >
              {loading ? "Adding..." : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
