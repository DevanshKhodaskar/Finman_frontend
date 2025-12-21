import React, { useState, useEffect } from "react";
import axios from "axios";

const EditTransactionModal = ({ isOpen, onClose, transaction, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Other",
    isIncome: false,
    time: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Other",
  ];

  useEffect(() => {
    if (transaction) {
      setFormData({
        name: transaction.name || "",
        price: transaction.price || "",
        category: transaction.category || "Other",
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

    if (!formData.name.trim()) {
      setError("Transaction name is required");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        category: formData.category,
        isIncome: formData.isIncome,
        time: formData.time, // ✅ backend converts with new Date(time)
      };

      const res = await axios.put(
        `https://finman-backend.vercel.app/api/queries/${transaction._id}`,
        payload,
        { withCredentials: true }
      );

      // ✅ BACKEND RETURNS ok:true
      if (res.data?.ok) {
        onSuccess();
        onClose();
      } else {
        setError(res.data?.error || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.error || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this transaction permanently?")) return;

    try {
      setLoading(true);

      const res = await axios.delete(
        `https://finman-backend.vercel.app/api/queries/${transaction._id}`,
        { withCredentials: true }
      );

      if (res.data?.ok) {
        onSuccess();
        onClose();
      } else {
        setError(res.data?.error || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.error || "Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Edit Transaction</h2>
          <button onClick={onClose} className="text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {/* Type */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, isIncome: false }))}
              className={`flex-1 py-2 rounded-lg font-semibold ${
                !formData.isIncome
                  ? "bg-red-500 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Expense
            </button>

            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, isIncome: true }))}
              className={`flex-1 py-2 rounded-lg font-semibold ${
                formData.isIncome
                  ? "bg-green-500 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Income
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Transaction Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 text-slate-900
                         border border-slate-300 rounded-lg
                         focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 text-slate-900
                         border border-slate-300 rounded-lg
                         focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 text-slate-900
                         border border-slate-300 rounded-lg
                         focus:outline-none focus:border-blue-500"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-50 text-slate-900
                         border border-slate-300 rounded-lg
                         focus:outline-none focus:border-blue-500"
            />
          </div>

        {/* Buttons */}
<div className="flex gap-2 pt-3">
  <button
    type="button"
    onClick={onClose}
    className="flex-1 py-2 bg-slate-100 text-black rounded-lg"
  >

              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full py-2 bg-red-100 text-red-600 rounded-lg"
          >
            Delete Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
