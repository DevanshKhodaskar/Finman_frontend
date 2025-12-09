import React, { useState, useEffect } from "react";
import axios from "axios";

const EditTransactionModal = ({ isOpen, onClose, transaction, onSuccess }) => {
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

  useEffect(() => {
    if (transaction) {
      setFormData({
        name: transaction.name || "",
        price: transaction.price || "",
        category: transaction.category || "Food",
        isIncome: transaction.isIncome || false,
        time: new Date(transaction.time).toISOString().split("T")[0],
      });
      setError("");
    }
  }, [transaction, isOpen]);

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

    if (!transaction || !transaction._id) {
      setError("Invalid transaction. Please close and try again.");
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

      const res = await axios.put(
        `http://localhost:4000/api/queries/${transaction._id}`,
        payload,
        { withCredentials: true }
      );

      if (res.data && res.data.ok) {
        onSuccess();
        onClose();
      } else {
        setError(res.data?.error || "Failed to update transaction");
      }
    } catch (err) {
      console.error("Update transaction error:", err);
      
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to edit this transaction.");
      } else if (err.response?.status === 404) {
        setError("Transaction not found. It may have been deleted.");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.error || "Invalid input. Please check your data.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(err.response?.data?.error || "Error updating transaction. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction || !transaction._id) {
      setError("Invalid transaction. Please close and try again.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) {
      try {
        setLoading(true);
        const res = await axios.delete(
          `http://localhost:4000/api/queries/${transaction._id}`,
          { withCredentials: true }
        );

        if (res.data && res.data.ok) {
          onSuccess();
          onClose();
        } else {
          setError(res.data?.error || "Failed to delete transaction");
        }
      } catch (err) {
        console.error("Delete transaction error:", err);
        
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
        } else if (err.response?.status === 403) {
          setError("You don't have permission to delete this transaction.");
        } else if (err.response?.status === 404) {
          setError("Transaction not found. It may have already been deleted.");
        } else if (err.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(err.response?.data?.error || "Error deleting transaction. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Edit Transaction</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Type Toggle */}
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-3">Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isIncome: false }))
                }
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                  !formData.isIncome
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                💰 Income
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              Transaction Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Grocery Shopping"
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">
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
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white"
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
            <label className="block text-sm font-semibold text-blue-900 mb-2">
              Date
            </label>
            <input
              type="date"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg transition-all ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-blue-600 hover:to-blue-700 shadow-lg"
              }`}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full px-4 py-3 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            🗑️ Delete Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
