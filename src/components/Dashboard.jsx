import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Filler,
  PointElement,
  LineElement,
} from "chart.js"
import { Pie, Bar, Line } from "react-chartjs-2"
import AddTransactionModal from "./AddTransactionModal"
import EditTransactionModal from "./EditTransactionModal"
import DownloadReportModal from "./DownloadReportModal"
import { useTheme } from "../context/ThemeContext.jsx"

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Filler,
  PointElement,
  LineElement,
)

const Dashboard = () => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [filterCategory, setFilterCategory] = useState("All")
  const [deferredPrompt, setDeferredPrompt] = useState(null)
const [showInstall, setShowInstall] = useState(false)

useEffect(() => {
  const handler = (e) => {
    e.preventDefault()
    setDeferredPrompt(e)
    setShowInstall(true)
  }

  window.addEventListener("beforeinstallprompt", handler)

  return () => window.removeEventListener("beforeinstallprompt", handler)
}, [])
const handleInstall = async () => {
  if (!deferredPrompt) return

  deferredPrompt.prompt()
  const choice = await deferredPrompt.userChoice

  if (choice.outcome === "accepted") {
    setShowInstall(false)
  }
}

const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return

  const permission = await Notification.requestPermission()
  if (permission === "granted") {
    new Notification("FinMan Ready 🚀", {
      body: "Track expenses instantly from your home screen",
      icon: "/icons/icon-192.png",
    })
  }
}


  useEffect(() => {
    fetchQueries()
    requestNotificationPermission()
  }, [])

  const fetchQueries = async () => {
    try {
      setLoading(true)
      setError("")
      const res = await axios.get("https://finman-backend.vercel.app/api/queries/", {
        withCredentials: true,
      })

      if (res.data && res.data.ok && Array.isArray(res.data.queries)) {
        setQueries(res.data.queries)
      } else {
        setError("Failed to fetch queries - Invalid response format")
        setQueries([])
      }
    } catch (err) {
      console.error("Fetch queries error:", err)

      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.")
      } else if (err.response?.status === 403) {
        setError("You don't have permission to access this data.")
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.")
      } else {
        setError(err.response?.data?.error || "Error fetching transactions. Please check your connection.")
      }
      setQueries([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddSuccess = () => {
    setError("")
    fetchQueries()
  }

  const handleEditClick = (transaction) => {
    if (!transaction || !transaction._id) {
      setError("Invalid transaction selected")
      return
    }
    setSelectedTransaction(transaction)
    setShowEditModal(true)
  }

  const handleEditSuccess = () => {
    setError("")
    fetchQueries()
  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      const res = await axios.post("https://finman-backend.vercel.app/api/auth/logout", {}, { withCredentials: true })

      if (res.data && res.data.ok) {
        setQueries([])
        setError("")
        window.location.href = "/"
      } else {
        setError("Logout failed. Please try again.")
      }
    } catch (err) {
      console.error("Logout error:", err)

      if (err.response?.status === 401) {
        window.location.href = "/"
      } else {
        setError(err.response?.data?.error || "Error logging out. Redirecting...")
        setTimeout(() => {
          window.location.href = "/"
        }, 1000)
      }
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    try {
      const totalExpenses = queries
        .filter((q) => q && !q.isIncome)
        .reduce((sum, q) => {
          const price = Number(q.price) || 0
          return sum + (isNaN(price) ? 0 : price)
        }, 0)

      const totalIncome = queries
        .filter((q) => q && q.isIncome)
        .reduce((sum, q) => {
          const price = Number(q.price) || 0
          return sum + (isNaN(price) ? 0 : price)
        }, 0)

      const balance = totalIncome - totalExpenses

      const categoryData = {}
      queries
        .filter((q) => q && !q.isIncome)
        .forEach((q) => {
          const cat = q.category || "Other"
          const price = Number(q.price) || 0
          if (!isNaN(price)) {
            categoryData[cat] = (categoryData[cat] || 0) + price
          }
        })

      const sortedQueries = [...queries].filter((q) => q && q.time).sort((a, b) => new Date(b.time) - new Date(a.time))

      const recentTransactions = sortedQueries.slice(0, 5)

      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth()
      const currentDay = now.getDate()

      const dailyData = {}
      for (let day = 1; day <= currentDay; day++) {
        const dayKey = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        const dayLabel = `${day}`
        dailyData[dayKey] = { income: 0, expense: 0, label: dayLabel }
      }

      queries
        .filter((q) => q && q.time)
        .forEach((q) => {
          try {
            const date = new Date(q.time)
            const year = date.getFullYear()
            const month = date.getMonth()
            const day = date.getDate()

            if (year === currentYear && month === currentMonth && day <= currentDay) {
              const dayKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const price = Number(q.price) || 0
              if (!isNaN(price)) {
                if (q.isIncome) {
                  dailyData[dayKey].income += price
                } else {
                  dailyData[dayKey].expense += price
                }
              }
            }
          } catch (e) {
            console.warn("Error processing transaction date:", q.time, e)
          }
        })

      return {
        totalExpenses,
        totalIncome,
        balance,
        categoryData,
        recentTransactions,
        dailyData,
      }
    } catch (err) {
      console.error("Error calculating stats:", err)
      return {
        totalExpenses: 0,
        totalIncome: 0,
        balance: 0,
        categoryData: {},
        recentTransactions: [],
        dailyData: {},
      }
    }
  }

  const stats = queries.length > 0 ? calculateStats() : null

  const getCategoryPieChartData = () => {
    if (!stats || Object.keys(stats.categoryData).length === 0) {
      return { labels: [], datasets: [] }
    }

    return {
      labels: Object.keys(stats.categoryData),
      datasets: [
        {
          label: "Expenses by Category",
          data: Object.values(stats.categoryData),
          backgroundColor: [
            "#8b5cf6",
            "#3b82f6",
            "#06b6d4",
            "#10b981",
            "#f59e0b",
            "#ef4444",
            "#ec4899",
            "#6366f1",
          ],
          borderColor: isDark ? "#020617" : "#f9fafb",
          borderWidth: 2,
          hoverOffset: 18,
        },
      ],
    }
  }

  const getDailyChartData = () => {
    if (!stats || Object.keys(stats.dailyData).length === 0) {
      return { labels: [], datasets: [] }
    }

    const sortedDayKeys = Object.keys(stats.dailyData).sort()
    const labels = sortedDayKeys.map((key) => stats.dailyData[key].label)

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: sortedDayKeys.map((d) => stats.dailyData[d].income),
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.16)",
          fill: true,
          tension: 0.45,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#22c55e",
          pointBorderColor: isDark ? "#020617" : "#ffffff",
          pointBorderWidth: 2,
        },
        {
          label: "Expense",
          data: sortedDayKeys.map((d) => stats.dailyData[d].expense),
          borderColor: "#f97373",
          backgroundColor: "rgba(248,113,113,0.16)",
          fill: true,
          tension: 0.45,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#f97373",
          pointBorderColor: isDark ? "#020617" : "#ffffff",
          pointBorderWidth: 2,
        },
      ],
    }
  }

  const getDailyBarChartData = () => {
    if (!stats || Object.keys(stats.dailyData).length === 0) {
      return { labels: [], datasets: [] }
    }

    const sortedDayKeys = Object.keys(stats.dailyData).sort()
    const labels = sortedDayKeys.map((key) => stats.dailyData[key].label)

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: sortedDayKeys.map((d) => stats.dailyData[d].income),
          backgroundColor: "rgba(34,197,94,0.8)",
          borderRadius: 999,
          borderSkipped: false,
        },
        {
          label: "Expense",
          data: sortedDayKeys.map((d) => stats.dailyData[d].expense),
          backgroundColor: "rgba(248,113,113,0.8)",
          borderRadius: 999,
          borderSkipped: false,
        },
      ],
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#e5e7eb" : "#1f2937",
          font: {
            size: 12,
            weight: "bold",
          },
          padding: 18,
        },
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(15,23,42,0.98)" : "rgba(255,255,255,0.98)",
        titleColor: isDark ? "#e5e7eb" : "#111827",
        bodyColor: isDark ? "#d1d5db" : "#374151",
        borderColor: isDark ? "#4b5563" : "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
      },
    },
    scales: {
      y: {
        ticks: {
          color: isDark ? "#9ca3af" : "#4b5563",
          font: { size: 11 },
        },
        grid: {
          color: isDark ? "rgba(55,65,81,0.5)" : "rgba(209,213,219,0.6)",
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          color: isDark ? "#9ca3af" : "#4b5563",
          font: { size: 11 },
        },
        grid: {
          color: isDark ? "rgba(31,41,55,0.6)" : "rgba(229,231,235,0.7)",
          drawBorder: false,
        },
      },
    },
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${
          isDark
            ? "bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950"
            : "bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100"
        }`}
      >
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-32 -left-16 h-72 w-72 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />

        <div className="relative z-10 text-center">
          <div
            className={`w-20 h-20 border-4 rounded-full animate-spin mx-auto mb-6 border-t-transparent ${
              isDark ? "border-purple-500" : "border-purple-600"
            }`}
          ></div>
          <p className={`font-medium tracking-wide text-sm md:text-base ${isDark ? "text-purple-200" : "text-purple-800"}`}>
            Initializing your futuristic dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 flex items-center justify-center p-4">
        <div className="relative max-w-md w-full">
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-red-500/30 blur-2xl" />
          <div className="relative bg-slate-900/70 backdrop-blur-2xl rounded-3xl shadow-[0_0_24px_rgba(248,113,113,0.6)] border border-red-500/40 p-8">
            <div className="text-6xl mb-4 text-center">⚠️</div>
            <h2 className="text-2xl font-bold text-red-200 text-center mb-2">Something broke the matrix</h2>
            <p className="text-red-200/80 text-center text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!queries.length) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 flex items-center justify-center p-4">
        <div className="pointer-events-none absolute -top-32 left-10 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />

        <div className="relative bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_70px_rgba(129,140,248,0.75)] border border-purple-500/40 p-10 max-w-lg w-full text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl md:text-3xl font-bold text-purple-50 mb-3">Welcome to FinMan Neo</h2>
          <p className="text-purple-100/80 mb-8 text-sm md:text-base">
            You&apos;re one step away from a fully visual, AI-ready finance cockpit. Add your first transaction to unlock
            live charts, neon stats, and more.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-sm md:text-base font-semibold
            bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white
            shadow-[0_0_30px_rgba(129,140,248,0.9)] hover:shadow-[0_0_24px_rgba(96,165,250,0.9)]
            transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02]"
          >
            <span className="text-lg">➕</span>
            <span>Begin Tracking</span>
          </button>

          <AddTransactionModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={handleAddSuccess}
          />
        </div>
      </div>
    )
  }

  const categoryColors = {
    Food: "from-orange-500 to-red-500",
    Transport: "from-blue-500 to-cyan-500",
    Shopping: "from-pink-500 to-purple-500",
    Entertainment: "from-purple-500 to-indigo-500",
    Bills: "from-yellow-500 to-orange-500",
    Health: "from-green-500 to-emerald-500",
    Education: "from-indigo-500 to-blue-500",
    Other: "from-slate-500 to-slate-700",
  }

  const maxCategoryAmount = Math.max(...Object.values(stats.categoryData || { Other: 1 }))

  const allCategories = ["All", ...Object.keys(stats.categoryData || {})]

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950"
          : "bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100"
      }`}
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -top-40 -left-10 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-2xl transition-colors duration-500 ${
          isDark ? "border-slate-800 bg-slate-950/70" : "border-purple-100 bg-white/70"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div
                className={`relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center overflow-hidden
                shadow-[0_0_20px_rgba(129,140,248,0.4)]
`}
              >
                {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400" /> */}
                <div className="absolute -inset-6 bg-[conic-gradient(from_180deg_at_50%_50%,#22c55e,#a855f7,#22d3ee,#22c55e)] opacity-0 animate-spin-slow" />
                <div className="relative z-10 flex items-center justify-center rounded-2xl bg-slate-950/60">
                  <span className="text-3xl md:text-4xl font-bold text-white-300">₹</span>

                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1
                    className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
                      isDark ? "text-slate-50" : "text-slate-900"
                    }`}
                  >
                    FinMan <span className="text-purple-400"></span>
                  </h1>
                  
                </div>
                <p
                  className={`text-xs md:text-sm mt-1 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  A futuristic cockpit for your personal finances.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
              {/* {showInstall && ( */}
  <div className="mx-4 mt-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between shadow-lg">
    <div>
      <p className="font-semibold">📲 Install FinMan</p>
      <p className="text-xs opacity-90">
        Get quick access & offline support
      </p>
    </div>
    <button
      onClick={handleInstall}
      className="bg-white text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold"
    >
      INSTALL
    </button>
  </div>
{/* )} */}

              <button
                onClick={toggleTheme}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2
                  border backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
                    isDark
                      ? "border-slate-700 bg-slate-900/70 text-yellow-300 hover:border-yellow-400/70"
                      : "border-slate-200 bg-white/70 text-slate-700 hover:border-purple-300"
                  }`}
              >
                <span>{isDark ? "☀️" : "🌙"}</span>
                <span className="hidden sm:inline">{isDark ? "Light Mode" : "Dark Mode"}</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold flex items-center gap-2
                  bg-gradient-to-r from-purple-700 via-indigo-700 to-cyan-700 text-white
                  shadow-[0_0_0px_rgba(129,140,248,0.9)]
                  hover:shadow-[0_0_35px_rgba(96,165,250,0.9)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>➕</span>
                <span className="hidden sm:inline">Add Transaction</span>
                <span className="sm:hidden">Add</span>
              </button>

              <button
                onClick={() => setShowDownloadModal(true)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold flex items-center gap-2
                  border backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
                    isDark
                      ? "border-blue-500/50 text-blue-300 bg-slate-900/60 hover:border-blue-400"
                      : "border-blue-400/60 text-blue-700 bg-white/70 hover:border-blue-500"
                  }`}
              >
                <span>📥</span>
                <span>Report</span>
              </button>

              <Link
                to="/ai-features"
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold flex items-center gap-2
                  border backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
                    isDark
                      ? "border-indigo-500/50 text-indigo-300 bg-slate-900/60 hover:border-indigo-400"
                      : "border-indigo-400/60 text-indigo-700 bg-white/70 hover:border-indigo-500"
                  }`}
              >
                <span>🤖</span>
                <span className="hidden sm:inline">AI Insights</span>
                <span className="sm:hidden">AI</span>
              </Link>

              <button
                onClick={handleLogout}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold flex items-center gap-2
                  border backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 ${
                    isDark
                      ? "border-red-500/50 text-red-300 bg-slate-900/60 hover:border-red-400"
                      : "border-red-400/60 text-red-700 bg-white/70 hover:border-red-500"
                  }`}
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Stat cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Income */}
          <div
            className={`relative rounded-3xl p-4 md:p-6 overflow-hidden backdrop-blur-2xl border
              
              ${
                isDark
                  ? "bg-gradient-to-br from-emerald-500/10 via-slate-900/80 to-emerald-500/10 border-emerald-400/40"
                  : "bg-gradient-to-br from-emerald-50 via-white to-emerald-100 border-emerald-200/80"
              }`}
          >
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-emerald-400/25 blur-2xl" />
            <div className="relative flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isDark ? "bg-emerald-900/60" : "bg-emerald-100"
                  }`}
                >
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-wide ${isDark ? "text-emerald-200/80" : "text-emerald-700"}`}>
                    Total Income
                  </p>
                  <p className={`text-[0.65rem] mt-1 ${isDark ? "text-emerald-100/80" : "text-emerald-700/80"}`}>
                    Sum of all incoming amounts
                  </p>
                </div>
              </div>
              <span
                className={`text-[0.7rem] px-3 py-1 rounded-full border ${
                  isDark
                    ? "border-emerald-400/50 text-emerald-200/90 bg-emerald-500/10"
                    : "border-emerald-400/60 text-emerald-700 bg-emerald-50"
                }`}
              >
                Income
              </span>
            </div>
            <p
              className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
                isDark ? "text-emerald-300" : "text-emerald-700"
              }`}
            >
              ₹{stats.totalIncome.toLocaleString()}
            </p>
          </div>

          {/* Expenses */}
          <div
            className={`relative rounded-3xl p-4 md:p-6 overflow-hidden backdrop-blur-2xl border
              shadow-[0_0_45px_rgba(248,113,113,0.25)]
              ${
                isDark
                  ? "bg-gradient-to-br from-rose-500/10 via-slate-900/80 to-rose-500/10 border-rose-400/40"
                  : "bg-gradient-to-br from-rose-50 via-white to-rose-100 border-rose-200/80"
              }`}
          >
            <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-rose-400/25 blur-2xl" />
            <div className="relative flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isDark ? "bg-rose-900/60" : "bg-rose-100"
                  }`}
                >
                  <span className="text-2xl">💸</span>
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-wide ${isDark ? "text-rose-200/80" : "text-rose-700"}`}>
                    Total Expenses
                  </p>
                  <p className={`text-[0.65rem] mt-1 ${isDark ? "text-rose-100/80" : "text-rose-700/80"}`}>
                    Combined outgoing spend
                  </p>
                </div>
              </div>
              <span
                className={`text-[0.7rem] px-3 py-1 rounded-full border ${
                  isDark
                    ? "border-rose-400/50 text-rose-200/90 bg-rose-500/10"
                    : "border-rose-400/60 text-rose-700 bg-rose-50"
                }`}
              >
                Expenses
              </span>
            </div>
            <p
              className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
                isDark ? "text-rose-300" : "text-rose-700"
              }`}
            >
              ₹{stats.totalExpenses.toLocaleString()}
            </p>
          </div>

          {/* Balance */}
          <div
            className={`relative rounded-3xl p-4 md:p-6 overflow-hidden backdrop-blur-2xl border sm:col-span-2 lg:col-span-1
              shadow-[0_0_24px_rgba(129,140,248,0.5)]
              ${
                isDark
                  ? "bg-gradient-to-br from-purple-600/30 via-slate-950/90 to-indigo-500/40 border-purple-500/60"
                  : "bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 border-purple-400/80"
              }`}
          >
            <div className="absolute inset-0 opacity-40">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2), transparent 60%), radial-gradient(circle at 80% 80%, rgba(15,23,42,0.4), transparent 55%)",
                }}
              />
            </div>

            <div className="relative flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-[0.18em] text-purple-100/80">
                    NET BALANCE
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                </div>
                
              </div>
              <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>

            <p
              className={`relative text-3xl md:text-4xl font-extrabold tracking-tight ${
                stats.balance >= 0 ? "text-white" : "text-red-100"
              }`}
            >
              ₹{stats.balance.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-purple-100/70">
              {stats.balance >= 0 ? "You are in the green zone." : "Spending is exceeding income."}
            </p>
          </div>
        </section>

        {/* Charts row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Pie */}
          <div
            className={`relative rounded-3xl p-4 md:p-6 backdrop-blur-2xl border
              ${
                isDark
                  ? "bg-slate-950/70 border-slate-800"
                  : "bg-white/80 border-slate-200"
              }`}
          >
            <div className="absolute -top-10 right-0 h-24 w-24 rounded-full bg-purple-500/25 blur-2xl" />

            <div className="relative flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isDark ? "bg-purple-900/60" : "bg-purple-100"
                  }`}
                >
                  <span className="text-xl">🥧</span>
                </div>
                <div>
                  <h2
                    className={`text-lg md:text-xl font-bold ${
                      isDark ? "text-slate-50" : "text-slate-900"
                    }`}
                  >
                    Expense Distribution
                  </h2>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Visual split of where your money goes.
                  </p>
                </div>
              </div>
            </div>

            {stats && Object.keys(stats.categoryData).length > 0 && (
              <div className="relative flex items-center justify-center">
                <div className="w-full max-w-xs h-64 md:h-80">
                  <Pie
                    key={`pie-${queries.length}`}
                    data={getCategoryPieChartData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: {
                            color: isDark ? "#e5e7eb" : "#374151",
                            font: { size: 11, weight: "bold" },
                            padding: 14,
                          },
                        },
                        tooltip: chartOptions.plugins.tooltip,
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Daily Bar */}
          <div
            className={`relative rounded-3xl p-4 md:p-6 backdrop-blur-2xl border
              ${
                isDark
                  ? "bg-slate-950/70 border-slate-800"
                  : "bg-white/80 border-slate-200"
              }`}
          >
            <div className="absolute -bottom-10 left-4 h-24 w-24 rounded-full bg-cyan-400/25 blur-2xl" />

            <div className="relative flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isDark ? "bg-cyan-900/60" : "bg-cyan-100"
                  }`}
                >
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <h2
                    className={`text-lg md:text-xl font-bold ${
                      isDark ? "text-slate-50" : "text-slate-900"
                    }`}
                  >
                    Daily Comparison (
                    {new Date().toLocaleDateString("en-US", { month: "long" })})
                  </h2>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Side-by-side income vs expense per day.
                  </p>
                </div>
              </div>
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
                        position: "top",
                        labels: {
                          color: isDark ? "#e5e7eb" : "#374151",
                          font: { size: 11, weight: "bold" },
                          padding: 14,
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
        </section>

        {/* Line chart */}
        <section
          className={`relative rounded-3xl p-4 md:p-6 mb-8 backdrop-blur-2xl border
            ${
              isDark
                ? "bg-slate-950/70 border-slate-800"
                : "bg-white/80 border-slate-200"
            }`}
        >
          <div className="absolute -top-16 left-1/3 h-28 w-40 rounded-full bg-indigo-500/25 blur-3xl" />

          <div className="relative flex items-center gap-3 mb-5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isDark ? "bg-indigo-900/60" : "bg-indigo-100"
              }`}
            >
              <span className="text-xl">📈</span>
            </div>
            <div>
              <h2
                className={`text-lg md:text-xl font-bold ${
                  isDark ? "text-slate-50" : "text-slate-900"
                }`}
              >
                Income vs Expense Trend (
                {new Date().toLocaleDateString("en-US", { month: "long" })})
              </h2>
              <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Smooth trend line of how your month is evolving.
              </p>
            </div>
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
                      position: "top",
                      labels: {
                        color: isDark ? "#e5e7eb" : "#374151",
                        font: { size: 11, weight: "bold" },
                        padding: 14,
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
        </section>

        {/* Category breakdown + stats */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category breakdown bars */}
          <div
            className={`relative rounded-3xl p-4 md:p-6 backdrop-blur-2xl border
              ${
                isDark
                  ? "bg-slate-950/70 border-slate-800"
                  : "bg-white/80 border-slate-200"
              }`}
          >
            <div className="absolute top-0 right-6 h-20 w-20 rounded-full bg-purple-400/20 blur-2xl" />
            <div className="relative flex items-center gap-3 mb-5">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isDark ? "bg-purple-900/60" : "bg-purple-100"
                }`}
              >
                <span className="text-xl">💹</span>
              </div>
              <div>
                <h2
                  className={`text-lg md:text-xl font-bold ${
                    isDark ? "text-slate-50" : "text-slate-900"
                  }`}
                >
                  Category Breakdown
                </h2>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Each bar is scaled vs your highest spend category.
                </p>
              </div>
            </div>

            <div className="relative space-y-4">
              {Object.entries(stats.categoryData).map(([category, amount]) => {
                const percentage = maxCategoryAmount ? (amount / maxCategoryAmount) * 100 : 0
                const color = categoryColors[category] || categoryColors.Other

                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-2 text-xs md:text-sm">
                      <span
                        className={`font-medium ${
                          isDark ? "text-slate-200" : "text-slate-800"
                        }`}
                      >
                        {category}
                      </span>
                      <span
                        className={`font-semibold ${
                          isDark ? "text-slate-300" : "text-slate-900"
                        }`}
                      >
                        ₹{amount.toLocaleString()}
                      </span>
                    </div>
                    <div
                      className={`w-full rounded-full h-3 md:h-3.5 overflow-hidden ${
                        isDark ? "bg-slate-800" : "bg-slate-100"
                      }`}
                    >
                      <div
                        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`}
                        style={{ width: `${Math.max(8, percentage)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* High-level stats */}
          <div
            className={`relative rounded-3xl p-4 md:p-6 backdrop-blur-2xl border
              ${
                isDark
                  ? "bg-slate-950/70 border-slate-800"
                  : "bg-white/80 border-slate-200"
              }`}
          >
            <div className="absolute -bottom-10 left-6 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl" />

            <div className="relative flex items-center gap-3 mb-5">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isDark ? "bg-slate-900/60" : "bg-slate-100"
                }`}
              >
                <span className="text-xl">📋</span>
              </div>
              <div>
                <h2
                  className={`text-lg md:text-xl font-bold ${
                    isDark ? "text-slate-50" : "text-slate-900"
                  }`}
                >
                  Quick Stats
                </h2>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  A snapshot of the current financial landscape.
                </p>
              </div>
            </div>

            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                className={`rounded-2xl p-4 border ${
                  isDark
                    ? "bg-purple-950/40 border-purple-500/40"
                    : "bg-purple-50 border-purple-200"
                }`}
              >
                <p className={`text-xs font-medium mb-1 ${isDark ? "text-purple-200" : "text-purple-700"}`}>
                  Total Categories
                </p>
                <p
                  className={`text-2xl md:text-3xl font-extrabold ${
                    isDark ? "text-purple-100" : "text-purple-900"
                  }`}
                >
                  {Object.keys(stats.categoryData).length}
                </p>
              </div>

              <div
                className={`rounded-2xl p-4 border ${
                  isDark
                    ? "bg-emerald-950/40 border-emerald-500/40"
                    : "bg-emerald-50 border-emerald-200"
                }`}
              >
                <p className={`text-xs font-medium mb-1 ${isDark ? "text-emerald-200" : "text-emerald-700"}`}>
                  Total Income
                </p>
                <p
                  className={`text-2xl md:text-3xl font-extrabold ${
                    isDark ? "text-emerald-200" : "text-emerald-800"
                  }`}
                >
                  ₹{stats.totalIncome.toLocaleString()}
                </p>
              </div>

              <div
                className={`rounded-2xl p-4 border ${
                  isDark
                    ? "bg-rose-950/40 border-rose-500/40"
                    : "bg-rose-50 border-rose-200"
                }`}
              >
                <p className={`text-xs font-medium mb-1 ${isDark ? "text-rose-200" : "text-rose-700"}`}>
                  Total Expenses
                </p>
                <p
                  className={`text-2xl md:text-3xl font-extrabold ${
                    isDark ? "text-rose-200" : "text-rose-800"
                  }`}
                >
                  ₹{stats.totalExpenses.toLocaleString()}
                </p>
              </div>

              <div
                className={`rounded-2xl p-4 border ${
                  isDark
                    ? stats.balance >= 0
                      ? "bg-sky-950/40 border-sky-500/40"
                      : "bg-amber-950/40 border-amber-500/40"
                    : stats.balance >= 0
                    ? "bg-sky-50 border-sky-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <p
                  className={`text-xs font-medium mb-1 ${
                    isDark
                      ? stats.balance >= 0
                        ? "text-sky-200"
                        : "text-amber-200"
                      : stats.balance >= 0
                      ? "text-sky-700"
                      : "text-amber-700"
                  }`}
                >
                  Net Balance
                </p>
                <p
                  className={`text-2xl md:text-3xl font-extrabold ${
                    isDark
                      ? stats.balance >= 0
                        ? "text-sky-200"
                        : "text-amber-200"
                      : stats.balance >= 0
                      ? "text-sky-800"
                      : "text-amber-800"
                  }`}
                >
                  ₹{stats.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent transactions */}
        <section
          className={`relative rounded-3xl p-4 md:p-6 mb-8 backdrop-blur-2xl border
            ${
              isDark
                ? "bg-slate-950/70 border-slate-800"
                : "bg-white/80 border-slate-200"
            }`}
        >
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-purple-400/20 blur-2xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isDark ? "bg-slate-900/60" : "bg-slate-100"
                }`}
              >
                <span className="text-xl">📝</span>
              </div>
              <div>
                <h2
                  className={`text-lg md:text-xl font-bold ${
                    isDark ? "text-slate-50" : "text-slate-900"
                  }`}
                >
                  Recent Activity
                </h2>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Last 5 transactions at a glance.
                </p>
              </div>
            </div>
          </div>

          <div className="relative space-y-3">
            {stats.recentTransactions.map((transaction) => (
              <div
                key={transaction._id}
                onClick={() => handleEditClick(transaction)}
                className={`flex items-center justify-between p-3 md:p-4 rounded-2xl cursor-pointer group
                  transition-all duration-300 border
                  ${
                    isDark
                      ? "bg-slate-900/70 border-slate-700 hover:border-purple-500/70 hover:bg-slate-900/90"
                      : "bg-white/80 border-slate-200 hover:border-purple-300 hover:bg-purple-50/80"
                  }`}
              >
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div
                    className={`w-10 md:w-11 h-10 md:h-11 rounded-2xl flex items-center justify-center flex-shrink-0
                    ${
                      isDark
                        ? transaction.isIncome
                          ? "bg-emerald-900/70"
                          : "bg-rose-900/70"
                        : transaction.isIncome
                        ? "bg-emerald-100"
                        : "bg-rose-100"
                    }`}
                  >
                    <span className="text-lg md:text-xl">
                      {transaction.isIncome ? "💰" : "💸"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`font-semibold text-sm md:text-base truncate ${
                        isDark ? "text-slate-50" : "text-slate-900"
                      }`}
                    >
                      {transaction.category || "Other"}
                    </p>
                    <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {new Date(transaction.time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p
                    className={`text-base md:text-lg font-bold ${
                      transaction.isIncome ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {transaction.isIncome ? "+" : "-"}₹{Number(transaction.price).toLocaleString()}
                  </p>
                  <p className={`text-[0.65rem] ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {transaction.name || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All transactions */}
        <section
          className={`relative rounded-3xl p-4 md:p-6 backdrop-blur-2xl border mb-10
            ${
              isDark
                ? "bg-slate-950/80 border-slate-800"
                : "bg-white/90 border-slate-200"
            }`}
        >
          <div className="absolute -top-10 left-6 h-24 w-24 rounded-full bg-indigo-400/20 blur-2xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isDark ? "bg-slate-900/60" : "bg-slate-100"
                }`}
              >
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h2
                  className={`text-lg md:text-xl font-bold ${
                    isDark ? "text-slate-50" : "text-slate-900"
                  }`}
                >
                  All Transactions
                </h2>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Tap a row to edit. Filter by category using the dropdown.
                </p>
              </div>
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2 md:gap-3">
              <span className={`text-[0.7rem] uppercase tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                FILTER
              </span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`text-xs md:text-sm rounded-full px-3 py-1.5 border outline-none
                  backdrop-blur-xl cursor-pointer
                  ${
                    isDark
                      ? "bg-slate-900/70 border-slate-700 text-slate-100"
                      : "bg-white/70 border-slate-200 text-slate-800"
                  }`}
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative overflow-x-auto rounded-2xl border border-slate-800/40">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className={isDark ? "bg-slate-900/80" : "bg-slate-50/80"}>
                  <th
                    className={`text-left py-3 px-3 md:px-4 font-semibold ${
                      isDark ? "text-slate-300" : "text-slate-900"
                    }`}
                  >
                    Date
                  </th>
                  <th
                    className={`text-left py-3 px-3 md:px-4 font-semibold ${
                      isDark ? "text-slate-300" : "text-slate-900"
                    }`}
                  >
                    Category
                  </th>
                  <th
                    className={`text-left py-3 px-3 md:px-4 font-semibold hidden md:table-cell ${
                      isDark ? "text-slate-300" : "text-slate-900"
                    }`}
                  >
                    Name
                  </th>
                  <th
                    className={`text-left py-3 px-3 md:px-4 font-semibold ${
                      isDark ? "text-slate-300" : "text-slate-900"
                    }`}
                  >
                    Type
                  </th>
                  <th
                    className={`text-right py-3 px-3 md:px-4 font-semibold ${
                      isDark ? "text-slate-300" : "text-slate-900"
                    }`}
                  >
                    Amount
                  </th>
                  <th
                    className={`text-center py-3 px-3 md:px-4 font-semibold ${
                      isDark ? "text-slate-300" : "text-slate-900"
                    }`}
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...queries]
                  .filter((q) => q && q.time)
                  .filter((q) => (filterCategory === "All" ? true : q.category === filterCategory))
                  .sort((a, b) => new Date(b.time) - new Date(a.time))
                  .map((transaction, idx) => (
                    <tr
                      key={transaction._id}
                      onClick={() => handleEditClick(transaction)}
                      className={`cursor-pointer transition-colors ${
                        isDark
                          ? idx % 2 === 0
                            ? "bg-slate-900/70 hover:bg-slate-800/80"
                            : "bg-slate-950/70 hover:bg-slate-800/80"
                          : idx % 2 === 0
                          ? "bg-white hover:bg-purple-50/80"
                          : "bg-slate-50 hover:bg-purple-50/80"
                      }`}
                    >
                      <td className={`py-3 px-3 md:px-4 ${isDark ? "text-slate-300" : "text-slate-800"}`}>
                        {new Date(transaction.time).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-3 md:px-4">
                        <span
                          className={`px-2 md:px-3 py-1 rounded-full text-[0.65rem] md:text-xs font-medium
                            ${
                              isDark
                                ? "bg-purple-900/60 text-purple-200"
                                : "bg-purple-100 text-purple-700"
                            }`}
                        >
                          {transaction.category || "Other"}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-3 md:px-4 hidden md:table-cell max-w-[180px] truncate ${
                          isDark ? "text-slate-300" : "text-slate-800"
                        }`}
                      >
                        {transaction.name || "N/A"}
                      </td>
                      <td className="py-3 px-3 md:px-4">
                        <span
                          className={`px-2 md:px-3 py-1 rounded-full text-[0.65rem] md:text-xs font-semibold
                            ${
                              isDark
                                ? transaction.isIncome
                                  ? "bg-emerald-900/60 text-emerald-300"
                                  : "bg-rose-900/60 text-rose-300"
                                : transaction.isIncome
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                        >
                          {transaction.isIncome ? "Income" : "Expense"}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-3 md:px-4 text-right font-bold text-xs md:text-base ${
                          transaction.isIncome ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {transaction.isIncome ? "+" : "-"}₹{Number(transaction.price).toLocaleString()}
                      </td>
                      <td className="py-3 px-3 md:px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditClick(transaction)
                          }}
                          className={`text-xs md:text-sm font-semibold underline-offset-2 hover:underline ${
                            isDark ? "text-indigo-300" : "text-purple-600"
                          }`}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modals */}
      <AddTransactionModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={handleAddSuccess} />
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
  )
}

export default Dashboard
