import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin, user, loading: authLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [form, setForm] = useState({
    phone_number: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, user, navigate]);

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

      if (res.data?.ok) {
        setSuccess(true);
        navigate("/dashboard", { replace: true });
      } else {
        setError(res.data?.message || "Login failed");
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.error || "Invalid credentials");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prevent login page flicker while checking session
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Checking session...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-white via-purple-50 to-blue-50"
      }`}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 p-2 rounded-lg ${
          isDark
            ? "bg-gray-800 text-yellow-400"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        {isDark ? "☀️" : "🌙"}
      </button>

      {/* Back */}
      <Link
        to="/"
        className={`absolute top-6 left-6 font-semibold ${
          isDark ? "text-indigo-400" : "text-purple-600"
        }`}
      >
        ← Back
      </Link>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">₹</span>
            </div>
            <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-purple-900"}`}>
              FinMan
            </h1>
          </div>
          <h2 className={`text-3xl font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
            Welcome Back
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Login to your dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className={`rounded-2xl shadow-xl p-8 border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-purple-100"
          }`}
        >
          {error && (
            <div className="mb-4 text-sm text-red-500">{error}</div>
          )}

          {success && (
            <div className="mb-4 text-sm text-green-500">
              Login successful! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="phone_number"
              type="tel"
              placeholder="Phone Number"
              value={form.phone_number}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg border"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg border"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="my-6 text-center text-sm text-gray-500">
            Or continue with
          </div>

          <button
            type="button"
            onClick={() => window.open("https://t.me/finman_dev_bot", "_blank")}
            className="w-full py-3 rounded-lg border text-blue-600"
          >
            Use Telegram Bot
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
