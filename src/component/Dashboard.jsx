import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, Filler, PointElement, LineElement } from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import AddTransactionModal from "./AddTransactionModal";
import EditTransactionModal from "./EditTransactionModal";
import DownloadReportModal from "./DownloadReportModal";
import { useTheme } from "../context/ThemeContext.jsx";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, Filler, PointElement, LineElement);

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("https://finman-backend.vercel.app/api/queries/", {
        withCredentials: true,
      });

      if (res.data && res.data.ok && Array.isArray(res.data.queries)) {
        setQueries(res.data.queries);
      } else {
        setError("Failed to fetch queries - Invalid response format");
        setQueries([]);
      }
    } catch (err) {
      console.error("Fetch queries error:", err);
      
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to access this data.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(err.response?.data?.error || "Error fetching transactions. Please check your connection.");
      }
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setError("");
    fetchQueries();
  };

  const handleEditClick = (transaction) => {
    if (!transaction || !transaction._id) {
      setError("Invalid transaction selected");
      return;
    }
    setSelectedTransaction(transaction);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setError("");
    fetchQueries();
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "https://finman-backend.vercel.app/api/auth/logout",
        {},
        { withCredentials: true }
      );
      
      if (res.data && res.data.ok) {
        // Clear local state before reloading
        setQueries([]);
        setError("");
        // Reload the page to clear auth state
        window.location.href = "/";
      } else {
        setError("Logout failed. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      
      // Still redirect even if logout API fails (token might be invalid)
      if (err.response?.status === 401) {
        window.location.href = "/";
      } else {
        setError(err.response?.data?.error || "Error logging out. Redirecting...");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    try {
      const totalExpenses = queries
        .filter((q) => q && !q.isIncome)
        .reduce((sum, q) => {
          const price = Number(q.price) || 0;
          return sum + (isNaN(price) ? 0 : price);
        }, 0);
      
      const totalIncome = queries
        .filter((q) => q && q.isIncome)
        .reduce((sum, q) => {
          const price = Number(q.price) || 0;
          return sum + (isNaN(price) ? 0 : price);
        }, 0);
      
      const balance = totalIncome - totalExpenses;

      // Category breakdown
      const categoryData = {};
      queries
        .filter((q) => q && !q.isIncome)
        .forEach((q) => {
          const cat = q.category || "Other";
          const price = Number(q.price) || 0;
          if (!isNaN(price)) {
            categoryData[cat] = (categoryData[cat] || 0) + price;
          }
        });

      // Sort all queries by newest first
      const sortedQueries = [...queries]
        .filter((q) => q && q.time)
        .sort((a, b) => new Date(b.time) - new Date(a.time));
      
      // Recent transactions - first 5 of sorted queries
      const recentTransactions = sortedQueries.slice(0, 5);

      // Daily trends for current month - from 1st to today
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      const currentDay = now.getDate();

      // Initialize all days from 1st to today with zero values
      const dailyData = {};
      for (let day = 1; day <= currentDay; day++) {
        const dayKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayLabel = `${day}`;
        dailyData[dayKey] = { income: 0, expense: 0, label: dayLabel };
      }

      // Fill in actual transaction data for current month
      queries
        .filter((q) => q && q.time)
        .forEach((q) => {
          try {
            const date = new Date(q.time);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();

            // Only include transactions from current month
            if (year === currentYear && month === currentMonth && day <= currentDay) {
              const dayKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const price = Number(q.price) || 0;
              if (!isNaN(price)) {
                if (q.isIncome) {
                  dailyData[dayKey].income += price;
                } else {
                  dailyData[dayKey].expense += price;
                }
              }
            }
          } catch (e) {
            console.warn("Error processing transaction date:", q.time, e);
          }
        });

      return { totalExpenses, totalIncome, balance, categoryData, recentTransactions, dailyData };
    } catch (err) {
      console.error("Error calculating stats:", err);
      return {
        totalExpenses: 0,
        totalIncome: 0,
        balance: 0,
        categoryData: {},
        recentTransactions: [],
        dailyData: {},
      };
    }
  };

  const stats = queries.length > 0 ? calculateStats() : null;

  // Chart data configurations with memoization
  const getCategoryPieChartData = () => {
    if (!stats || Object.keys(stats.categoryData).length === 0) {
      return { labels: [], datasets: [] };
    }
    
    return {
      labels: Object.keys(stats.categoryData),
      datasets: [
        {
          label: 'Expenses by Category',
          data: Object.values(stats.categoryData),
          backgroundColor: [
            '#8b5cf6',
            '#a78bfa',
            '#c4b5fd',
            '#ddd6fe',
            '#ede9fe',
            '#f5f3ff',
          ],
          borderColor: isDark ? '#1f2937' : '#ffffff',
          borderWidth: 2,
          hoverOffset: 15,
        },
      ],
    };
  };

  const getDailyChartData = () => {
    if (!stats || Object.keys(stats.dailyData).length === 0) {
      return { labels: [], datasets: [] };
    }

    // Sort day keys chronologically
    const sortedDayKeys = Object.keys(stats.dailyData).sort();
    const labels = sortedDayKeys.map(key => stats.dailyData[key].label);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Income',
          data: sortedDayKeys.map(d => stats.dailyData[d].income),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#10b981',
          pointBorderColor: isDark ? '#111827' : '#fff',
          pointBorderWidth: 2,
        },
        {
          label: 'Expense',
          data: sortedDayKeys.map(d => stats.dailyData[d].expense),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: isDark ? '#111827' : '#fff',
          pointBorderWidth: 2,
        },
      ],
    };
  };

  const getDailyBarChartData = () => {
    if (!stats || Object.keys(stats.dailyData).length === 0) {
      return { labels: [], datasets: [] };
    }

    // Sort day keys chronologically
    const sortedDayKeys = Object.keys(stats.dailyData).sort();
    const labels = sortedDayKeys.map(key => stats.dailyData[key].label);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Income',
          data: sortedDayKeys.map(d => stats.dailyData[d].income),
          backgroundColor: '#10b981',
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Expense',
          data: sortedDayKeys.map(d => stats.dailyData[d].expense),
          backgroundColor: '#ef4444',
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? '#d1d5db' : '#374151',
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#f3f4f6' : '#111827',
        bodyColor: isDark ? '#e5e7eb' : '#374151',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
      },
    },
    scales: {
      y: {
        ticks: { 
          color: isDark ? '#d1d5db' : '#374151',
          font: { size: 11 },
        },
        grid: { 
          color: isDark ? '#374151' : '#e5e7eb',
          drawBorder: false,
        },
      },
      x: {
        ticks: { 
          color: isDark ? '#d1d5db' : '#374151',
          font: { size: 11 },
        },
        grid: { 
          color: isDark ? '#374151' : '#e5e7eb',
          drawBorder: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-purple-50 to-lavender-100'}`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4 ${isDark ? 'border-purple-400 border-t-transparent' : 'border-purple-500 border-t-transparent'}`}></div>
          <p className={`font-medium ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-lavender-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border-2 border-red-200">
          <div className="text-6xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 text-center mb-2">Error</h2>
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!queries.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-lavender-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full border-2 border-purple-200 text-center">
          <div className="text-6xl mb-6">📊</div>
          <h2 className="text-2xl font-bold text-purple-900 mb-4">No Transactions Yet</h2>
          <p className="text-purple-600 mb-6">Start tracking your expenses to see beautiful insights here!</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md">
            Add First Transaction
          </button>
        </div>
        <AddTransactionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      </div>
    );
  }

  const categoryColors = {
    Food: "bg-purple-500",
    Transport: "bg-purple-400",
    Shopping: "bg-purple-600",
    Entertainment: "bg-purple-300",
    Bills: "bg-purple-700",
    Other: "bg-purple-500",
  };

  const maxCategoryAmount = Math.max(...Object.values(stats.categoryData));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-purple-50 to-lavender-100'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 border-b shadow-sm transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white font-bold text-2xl">₹</span>
              </div>
              <div>
                <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>FinMan</h1>
                <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-purple-600'}`}>Track your finances effortlessly</p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={toggleTheme}
                className={`px-2 sm:px-4 md:px-6 py-2 rounded-lg transition-all duration-200 shadow-md text-xs sm:text-sm md:text-base flex items-center justify-center ${isDark ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                title="Toggle dark mode"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex-1 sm:flex-none px-2 sm:px-4 md:px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-md text-xs sm:text-sm md:text-base flex items-center justify-center gap-1 sm:gap-2">
                <span>➕</span> <span className="truncate">Add</span> <span className="hidden sm:inline truncate">Transaction</span>
              </button>
              <button
                onClick={() => setShowDownloadModal(true)}
                className={`flex-1 sm:flex-none px-2 sm:px-4 md:px-6 py-2 font-semibold border-2 rounded-lg transition-all duration-200 shadow-md flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base ${isDark ? 'bg-gray-700 text-blue-400 border-blue-600 hover:bg-gray-600' : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'}`}
              >
                <span>📥</span> <span className="truncate">Report</span>
              </button>
              <Link
                to="/ai-features"
                className={`flex-1 sm:flex-none px-2 sm:px-4 md:px-6 py-2 font-semibold border-2 rounded-lg transition-all duration-200 shadow-md flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base ${isDark ? 'bg-gray-700 text-indigo-400 border-indigo-600 hover:bg-gray-600' : 'bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50'}`}
              >
                <span>🤖</span> <span className="truncate">AI</span> <span className="hidden sm:inline truncate">Features</span>
              </Link>
              <button
                onClick={handleLogout}
                className={`flex-1 sm:flex-none px-2 sm:px-4 md:px-6 py-2 font-semibold border-2 rounded-lg transition-all duration-200 shadow-md flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base ${isDark ? 'bg-gray-700 text-red-400 border-red-600 hover:bg-gray-600' : 'bg-white text-red-600 border-red-300 hover:bg-red-50'}`}
              >
                <span>🚪</span> <span className="truncate">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Total Income Card */}
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 hover:shadow-xl transition-all duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-green-900' : 'bg-green-100'}`}>
                <span className="text-2xl">💰</span>
              </div>
              <span className={`text-xs md:text-sm font-semibold px-3 py-1 rounded-full ${isDark ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-50'}`}>Income</span>
            </div>
            <h3 className={`text-xs md:text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Income</h3>
            <p className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>₹{stats.totalIncome.toLocaleString()}</p>
          </div>

          {/* Total Expenses Card */}
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 hover:shadow-xl transition-all duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-red-900' : 'bg-red-100'}`}>
                <span className="text-2xl">💸</span>
              </div>
              <span className={`text-xs md:text-sm font-semibold px-3 py-1 rounded-full ${isDark ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-50'}`}>Expenses</span>
            </div>
            <h3 className={`text-xs md:text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Expenses</h3>
            <p className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>₹{stats.totalExpenses.toLocaleString()}</p>
          </div>

          {/* Balance Card */}
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1 bg-gradient-to-br ${isDark ? 'from-purple-600 to-purple-700 border-purple-600' : 'from-purple-500 to-purple-600 border-purple-400'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <span className="text-white text-xs md:text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">Balance</span>
            </div>
            <h3 className="text-purple-100 text-xs md:text-sm font-medium mb-1">Current Balance</h3>
            <p className={`text-2xl md:text-3xl font-bold ${stats.balance >= 0 ? 'text-white' : 'text-red-200'}`}>
              ₹{stats.balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Pie Chart */}
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <span className="text-xl">🥧</span>
              </div>
              <h2 className={`text-lg md:text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>Expense Distribution</h2>
            </div>
            
            {stats && Object.keys(stats.categoryData).length > 0 && (
              <div className="flex items-center justify-center">
                <div className="w-full max-w-xs h-64 md:h-80">
                  <Pie 
                    key={`pie-${queries.length}`}
                    data={getCategoryPieChartData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: isDark ? '#d1d5db' : '#374151',
                            font: { size: 12, weight: 'bold' },
                            padding: 15,
                          },
                        },
                        tooltip: {
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          titleColor: isDark ? '#f3f4f6' : '#111827',
                          bodyColor: isDark ? '#e5e7eb' : '#374151',
                          borderColor: isDark ? '#374151' : '#e5e7eb',
                          borderWidth: 1,
                          padding: 12,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Daily Bar Chart - Current Month */}
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <span className="text-xl">📊</span>
              </div>
              <h2 className={`text-lg md:text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>Daily Comparison ({new Date().toLocaleDateString('en-US', { month: 'long' })})</h2>
            </div>

            {stats && Object.keys(stats.dailyData).length > 0 && (
              <div className="w-full h-64 md:h-80">
                <Bar
                  key={`bar-${queries.length}`}
                  data={getDailyBarChartData()}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        position: 'top',
                        labels: {
                          color: isDark ? '#d1d5db' : '#374151',
                          font: { size: 12, weight: 'bold' },
                          padding: 15,
                        },
                      },
                    },
                    scales: {
                      y: {
                        ...chartOptions.scales.y,
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Daily Trend Line Chart - Current Month */}
        <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 transition-colors duration-300 mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
              <span className="text-xl">📈</span>
            </div>
            <h2 className={`text-lg md:text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>Income vs Expenses Trend ({new Date().toLocaleDateString('en-US', { month: 'long' })})</h2>
          </div>

          {stats && Object.keys(stats.dailyData).length > 0 && (
            <div className="w-full h-64 md:h-80">
              <Line
                key={`line-${queries.length}`}
                data={getDailyChartData()}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'top',
                      labels: {
                        color: isDark ? '#d1d5db' : '#374151',
                        font: { size: 12, weight: 'bold' },
                        padding: 15,
                      },
                    },
                  },
                  scales: {
                    y: {
                      ...chartOptions.scales.y,
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <span className="text-xl">💹</span>
              </div>
              <h2 className={`text-lg md:text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>Category Breakdown</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(stats.categoryData).map(([category, amount]) => {
                const percentage = (amount / maxCategoryAmount) * 100;
                const color = categoryColors[category] || categoryColors.Other;
                
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-medium text-sm md:text-base ${isDark ? 'text-gray-300' : 'text-purple-700'}`}>{category}</span>
                      <span className={`font-bold text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-purple-900'}`}>₹{amount.toLocaleString()}</span>
                    </div>
                    <div className={`w-full rounded-full h-3 overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-purple-100'}`}>
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-500 shadow-sm`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Stats */}
          <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <span className="text-xl">📋</span>
              </div>
              <h2 className={`text-lg md:text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>Statistics</h2>
            </div>
            
            <div className="space-y-4">
              <div className={`rounded-lg p-4 ${isDark ? 'bg-purple-900/30 border border-purple-700' : 'bg-purple-50'}`}>
                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Total Categories</p>
                <p className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>{Object.keys(stats.categoryData).length}</p>
              </div>
              <div className={`rounded-lg p-4 ${isDark ? 'bg-green-900/30 border border-green-700' : 'bg-green-50'}`}>
                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-green-300' : 'text-green-600'}`}>Total Income</p>
                <p className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-green-400' : 'text-green-900'}`}>₹{stats.totalIncome.toLocaleString()}</p>
              </div>
              <div className={`rounded-lg p-4 ${isDark ? 'bg-red-900/30 border border-red-700' : 'bg-red-50'}`}>
                <p className={`text-sm font-medium mb-1 ${isDark ? 'text-red-300' : 'text-red-600'}`}>Total Expenses</p>
                <p className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-red-400' : 'text-red-900'}`}>₹{stats.totalExpenses.toLocaleString()}</p>
              </div>
              <div className={`rounded-lg p-4 ${isDark ? (stats.balance >= 0 ? 'bg-blue-900/30 border border-blue-700' : 'bg-orange-900/30 border border-orange-700') : (stats.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50')}`}>
                <p className={`text-sm font-medium mb-1 ${isDark ? (stats.balance >= 0 ? 'text-blue-300' : 'text-orange-300') : (stats.balance >= 0 ? 'text-blue-600' : 'text-orange-600')}`}>Net Balance</p>
                <p className={`text-2xl md:text-3xl font-bold ${isDark ? (stats.balance >= 0 ? 'text-blue-400' : 'text-orange-400') : (stats.balance >= 0 ? 'text-blue-900' : 'text-orange-900')}`}>₹{stats.balance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 transition-colors duration-300 mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
          <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <span className="text-xl">📝</span>
              </div>
              <h2 className={`text-lg md:text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>Recent Transactions</h2>
            </div>
          </div>

          <div className="space-y-3">
            {stats.recentTransactions.map((transaction) => (
              <div
                key={transaction._id}
                onClick={() => handleEditClick(transaction)}
                className={`flex items-center justify-between p-3 md:p-4 rounded-xl cursor-pointer transition-all duration-200 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-50 hover:bg-purple-100'} hover:shadow-md`}
              >
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div className={`w-10 md:w-12 h-10 md:h-12 ${isDark ? (transaction.isIncome ? 'bg-green-900' : 'bg-red-900') : (transaction.isIncome ? 'bg-green-100' : 'bg-red-100')} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-lg md:text-xl">{transaction.isIncome ? '💰' : '💸'}</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm md:text-base truncate ${isDark ? 'text-gray-200' : 'text-purple-900'}`}>{transaction.category || 'Other'}</p>
                    <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-purple-600'}`}>{new Date(transaction.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className={`text-base md:text-xl font-bold ${transaction.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.isIncome ? '+' : '-'}₹{Number(transaction.price).toLocaleString()}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-purple-500'}`}>{transaction.name || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Transactions List */}
        <div className={`rounded-2xl shadow-lg p-4 md:p-6 border-2 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-purple-200'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-900' : 'bg-purple-100'}`}>
              <span className="text-xl">📊</span>
            </div>
            <h2 className={`text-lg md:text-2xl font-bold ${isDark ? 'text-white' : 'text-purple-900'}`}>All Transactions</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className={`border-b-2 ${isDark ? 'border-gray-700' : 'border-purple-200'}`}>
                  <th className={`text-left py-3 px-2 md:px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-purple-900'}`}>Date</th>
                  <th className={`text-left py-3 px-2 md:px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-purple-900'}`}>Category</th>
                  <th className={`text-left py-3 px-2 md:px-4 font-semibold hidden md:table-cell ${isDark ? 'text-gray-300' : 'text-purple-900'}`}>Name</th>
                  <th className={`text-left py-3 px-2 md:px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-purple-900'}`}>Type</th>
                  <th className={`text-right py-3 px-2 md:px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-purple-900'}`}>Amount</th>
                  <th className={`text-center py-3 px-2 md:px-4 font-semibold ${isDark ? 'text-gray-300' : 'text-purple-900'}`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {[...queries]
                  .filter((q) => q && q.time)
                  .sort((a, b) => new Date(b.time) - new Date(a.time))
                  .map((transaction) => (
                  <tr key={transaction._id} className={`border-b transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-purple-100 hover:bg-purple-50'}`}>
                    <td className={`py-3 px-2 md:px-4 ${isDark ? 'text-gray-300' : 'text-purple-700'}`}>
                      {new Date(transaction.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-2 md:px-4">
                      <span className={`${isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'} px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium`}>
                        {transaction.category || 'Other'}
                      </span>
                    </td>
                    <td className={`py-3 px-2 md:px-4 hidden md:table-cell truncate ${isDark ? 'text-gray-300' : 'text-purple-700'}`}>{transaction.name || 'N/A'}</td>
                    <td className="py-3 px-2 md:px-4">
                      <span className={`${isDark ? (transaction.isIncome ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400') : (transaction.isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')} px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium`}>
                        {transaction.isIncome ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className={`py-3 px-2 md:px-4 text-right font-bold ${transaction.isIncome ? 'text-green-600' : 'text-red-600'} text-xs md:text-base`}>
                      {transaction.isIncome ? '+' : '-'}₹{Number(transaction.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-2 md:px-4 text-center">
                      <button
                        onClick={() => handleEditClick(transaction)}
                        className={`font-semibold transition-colors text-xs md:text-sm ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-purple-600 hover:text-purple-800'}`}
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
      <EditTransactionModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        transaction={selectedTransaction}
        onSuccess={handleEditSuccess}
      />
      <DownloadReportModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        transactions={queries}
      />
    </div>
  );
};

export default Dashboard;
