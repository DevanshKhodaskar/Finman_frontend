import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Menu, X, Zap, Shield, Sparkles, TrendingUp } from "lucide-react"
import { useTheme } from '../context/ThemeContext.jsx'
import { Github, Linkedin } from "lucide-react"


const Landing = () => {
  const { isDark, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [particles, setParticles] = useState([])
  const particleIdRef = useRef(0)

  const handleTelegramClick = () => {
    window.open('https://t.me/finman_dev_bot', '_blank')
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const newParticle = {
        id: particleIdRef.current++,
        x: Math.random() * 100,
        y: -10,
        duration: 3 + Math.random() * 2,
      }
      setParticles((prev) => [...prev, newParticle])

      setTimeout(
        () => {
          setParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
        },
        (newParticle.duration + 0.5) * 1000,
      )
    }, 300)

    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-background" : "bg-slate-50"} relative overflow-hidden`}
    >
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-20 animate-grid-shimmer"
          style={{
            backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />

        <div className="absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-32 left-1/3 w-80 h-80 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="fixed inset-0 z-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary rounded-full animate-particle-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Content wrapper with relative z-index */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled
              ? `${isDark ? "bg-background/70 border-border" : "bg-white/70 border-slate-200"} backdrop-blur-xl border-b`
              : "bg-transparent"
          }`}
        >
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg shadow-primary/50 animate-glow-pulse">
                  <Zap size={24} className="text-white" />
                </div>
                <span
                  className={`text-2xl font-bold hidden sm:inline ${isDark ? "text-foreground" : "text-slate-900"}`}
                >
                  FinMan
                </span>
              </div>

              {/* Desktop Menu */}
              <div className={`hidden md:flex space-x-8 ${isDark ? "text-foreground/70" : "text-slate-700"}`}>
                <a href="#features" className="font-medium hover:text-primary transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="font-medium hover:text-primary transition-colors">
                  How It Works
                </a>
                <a href="#faq" className="font-medium hover:text-primary transition-colors">
                  FAQ
                </a>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark ? "bg-card hover:bg-card/80" : "bg-slate-100 hover:bg-slate-200"
                  }`}
                >
                  {isDark ? "☀️" : "🌙"}
                </button>
                <Link
                  to="/login"
                  className="hidden sm:inline px-6 py-2 font-semibold rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/50 transition-all duration-200"
                >
                  Login
                </Link>
                <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className={`md:hidden mt-4 pb-4 space-y-3 ${isDark ? "text-foreground/70" : "text-slate-700"}`}>
                <a href="#features" className="block font-medium hover:text-primary">
                  Features
                </a>
                <a href="#how-it-works" className="block font-medium hover:text-primary">
                  How It Works
                </a>
                <a href="#faq" className="block font-medium hover:text-primary">
                  FAQ
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-6 pt-32 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <div
                className={`px-4 py-2 rounded-full border backdrop-blur-md animate-glow-pulse ${
                  isDark
                    ? "bg-primary/10 border-primary/50 text-primary"
                    : "bg-primary/10 border-primary/50 text-primary"
                }`}
              >
                <Sparkles className="inline mr-2" size={16} />
                Next Generation Financial Platform
              </div>
            </div>

            <h1
              className={`text-6xl md:text-7xl lg:text-8xl font-bold text-center mb-6 leading-tight text-balance ${
                isDark ? "text-foreground" : "text-slate-900"
              }`}
            >
              Manage Your Money
              <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-shimmer">
                Smarter Than Ever
              </span>
            </h1>

            <p
              className={`text-lg md:text-xl text-center mb-10 max-w-3xl mx-auto leading-relaxed ${
                isDark ? "text-foreground/70" : "text-slate-600"
              }`}
            >
              Experience the future of financial management with AI-powered insights, real-time tracking, and
              intelligent predictions. Desktop, mobile, or Telegram—seamless everywhere.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link
                to="/login"
                className="px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-2xl hover:shadow-primary/50 transition-all duration-200 text-center flex items-center justify-center gap-2 group"
              >
                🚀 Dashboard Login
              </Link>
              <button
                onClick={handleTelegramClick}
                className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border-2 backdrop-blur-md ${
                  isDark
                    ? "bg-card/50 border-primary/30 text-foreground hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20"
                    : "bg-white border-primary/30 text-slate-900 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20"
                }`}
              >
                💬 Open Telegram Bot
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20">
              {[
                { value: "10K+", label: "Users", icon: "👥" },
                { value: "$100M+", label: "Tracked", icon: "💰" },
                { value: "99.9%", label: "Uptime", icon: "⚡" },
                { value: "2", label: "Platforms", icon: "🌐" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-xl border backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer ${
                    isDark ? "bg-card/40 border-border" : "bg-white/40 border-slate-200/50"
                  }`}
                >
                  <p className="text-3xl mb-2 group-hover:scale-125 transition-transform">{stat.icon}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-2 ${isDark ? "text-foreground/50" : "text-slate-600"}`}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className={`py-20 border-t ${isDark ? "border-border bg-card/20" : "border-slate-200 bg-slate-50/50"}`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className={`text-5xl md:text-6xl font-bold mb-4 ${isDark ? "text-foreground" : "text-slate-900"}`}>
                Powerful Features
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-foreground/60" : "text-slate-600"}`}>
                Everything you need to master your finances
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { title: "AI Analytics", desc: "Real-time insights with predictive analytics", icon: TrendingUp },
                { title: "Instant Sync", desc: "Live updates across all your devices", icon: Zap },
                { title: "Bank Security", desc: "Military-grade encryption & zero-knowledge", icon: Shield },
                { title: "Telegram Bot", desc: "Quick tracking via conversation", icon: Sparkles },
                { title: "Smart Categories", desc: "ML-powered automatic categorization", icon: Sparkles },
                { title: "Data Export", desc: "Export anytime in CSV, PDF formats", icon: Sparkles },
              ].map((feature, idx) => {
                const Icon = feature.icon
                return (
                  <div
                    key={idx}
                    className={`p-8 rounded-2xl border backdrop-blur-md group hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 ${
                      isDark
                        ? "bg-card/40 border-border hover:bg-card/60"
                        : "bg-white/40 border-slate-200/50 hover:bg-white/60"
                    }`}
                  >
                    <Icon className="w-8 h-8 mb-4 text-primary group-hover:scale-110 transition-transform" />
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-foreground" : "text-slate-900"}`}>
                      {feature.title}
                    </h3>
                    <p className={isDark ? "text-foreground/60" : "text-slate-600"}>{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className={`text-5xl md:text-6xl font-bold mb-4 ${isDark ? "text-foreground" : "text-slate-900"}`}>
                Get Started in 60 Seconds
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
              {[
                { num: "1", title: "Sign Up", desc: "Quick onboarding, no credit card needed" },
                { num: "2", title: "Connect", desc: "Link your accounts or add manually" },
                { num: "3", title: "Analyze", desc: "Get instant AI-powered insights" },
                { num: "4", title: "Optimize", desc: "Make smarter financial decisions" },
              ].map((step, idx) => (
                <div key={idx} className="flex-1 relative group">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-xl text-white transition-all duration-300 group-hover:scale-110 ${
                      idx === 0
                        ? "bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/50"
                        : idx === 1
                          ? "bg-gradient-to-br from-accent to-secondary shadow-lg shadow-accent/50"
                          : idx === 2
                            ? "bg-gradient-to-br from-secondary to-primary shadow-lg shadow-secondary/50"
                            : "bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/50"
                    }`}
                  >
                    {step.num}
                  </div>
                  <h3 className={`text-lg font-bold text-center mb-2 ${isDark ? "text-foreground" : "text-slate-900"}`}>
                    {step.title}
                  </h3>
                  <p className={`text-center ${isDark ? "text-foreground/60" : "text-slate-600"}`}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className={`py-20 border-t ${isDark ? "border-border bg-card/20" : "border-slate-200 bg-slate-50/50"}`}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className={`text-5xl md:text-6xl font-bold mb-4 ${isDark ? "text-foreground" : "text-slate-900"}`}>
                Frequently Asked Questions
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-foreground/60" : "text-slate-600"}`}>
                Everything you need to know about FinMan
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  question: "Is FinMan really free?",
                  answer: "Yes! FinMan is completely free to use. Track unlimited transactions, access all features, and manage your finances without any cost."
                },
                {
                  question: "How do I get started?",
                  answer: "Simply open our Telegram bot (@finman_dev_bot) and start chatting! You can track expenses instantly without any signup process. For advanced features and analytics, login to the web dashboard."
                },
                {
                  question: "Is my financial data secure?",
                  answer: "Absolutely! Your data is encrypted and stored securely. We use industry-standard security practices and never share your information with third parties. Your financial data is only accessible to you."
                },
                {
                  question: "Can I use both the dashboard and Telegram bot?",
                  answer: "Yes! Your data syncs seamlessly between the web dashboard and Telegram bot. Track expenses on Telegram and view detailed analytics on the dashboard - it's all connected."
                },
                {
                  question: "What categories can I track?",
                  answer: "FinMan supports multiple categories including Food, Transport, Shopping, Entertainment, Bills, Health, and more. You can also create custom categories to fit your needs."
                },
                {
                  question: "Can I edit or delete transactions?",
                  answer: "Yes! You have full control over your data. Edit or delete any transaction from the web dashboard anytime. Changes sync across all platforms instantly."
                },
                {
                  question: "How do I export my data?",
                  answer: "From the dashboard, you can export your transaction history in CSV or PDF format. Perfect for tax purposes, budgeting, or personal record-keeping."
                },
                {
                  question: "Do I need to install anything?",
                  answer: "No installation required! Access the web dashboard from any browser, and use the Telegram bot directly in your Telegram app. It's that simple."
                }
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-xl border backdrop-blur-md transition-all duration-300 hover:shadow-lg ${
                    isDark
                      ? "bg-card/40 border-border hover:border-primary/50"
                      : "bg-white/40 border-slate-200/50 hover:border-primary/30"
                  }`}
                >
                  <h3 className={`text-xl font-bold mb-3 flex items-start gap-3 ${
                    isDark ? "text-foreground" : "text-slate-900"
                  }`}>
                    <span className="text-primary flex-shrink-0">Q:</span>
                    {faq.question}
                  </h3>
                  <p className={`pl-8 leading-relaxed ${isDark ? "text-foreground/70" : "text-slate-600"}`}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Still have questions CTA */}
            <div className="text-center mt-12">
              <p className={`text-lg mb-4 ${isDark ? "text-foreground/70" : "text-slate-600"}`}>
                Still have questions?
              </p>
              <button
                onClick={handleTelegramClick}
                className="px-8 py-3 font-semibold rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/50 transition-all duration-200"
              >
                Ask on Telegram
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div
              className={`max-w-3xl mx-auto p-12 rounded-2xl border backdrop-blur-md text-center ${
                isDark
                  ? "bg-gradient-to-br from-primary/20 to-accent/20 border-primary/50"
                  : "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/50"
              }`}
            >
              <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? "text-foreground" : "text-slate-900"}`}>
                Ready to Transform Your Finances?
              </h2>
              <p className={`mb-8 text-lg ${isDark ? "text-foreground/70" : "text-slate-600"}`}>
                Join thousands making smarter financial decisions with FinMan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="px-8 py-4 text-white text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/40 transition-all duration-200 text-center"
                >
                  Dashboard Login
                </Link>
                <button
                  onClick={handleTelegramClick}
                  className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 border-2 backdrop-blur-md text-center ${
                    isDark
                      ? "bg-background border-primary/30 text-foreground hover:border-primary/70"
                      : "bg-white border-primary/30 text-slate-900 hover:border-primary/70"
                  }`}
                >
                  Open Telegram Bot
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`border-t py-12 ${isDark ? "border-border bg-card/10" : "border-slate-200 bg-slate-50"}`}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Zap size={24} className="text-primary" />
                  <span className="font-bold text-lg">FinMan</span>
                </div>
                <p className={`text-sm ${isDark ? "text-foreground/60" : "text-slate-600"}`}>
                  The future of personal finance management.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <ul className={`space-y-2 text-sm ${isDark ? "text-foreground/60" : "text-slate-600"}`}>
                  <li>
                    <a href="#features" className="hover:text-primary transition">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#faq" className="hover:text-primary transition">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-primary transition">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className={`space-y-2 text-sm ${isDark ? "text-foreground/60" : "text-slate-600"}`}>
                  <li>
                    <a href="#how-it-works" className="hover:text-primary transition">
                      How It Works
                    </a>
                  </li>
                  <li>
                    <button onClick={handleTelegramClick} className="hover:text-primary transition text-left">
                      Telegram Bot
                    </button>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-primary transition">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className={`space-y-2 text-sm ${isDark ? "text-foreground/60" : "text-slate-600"}`}>
                  <li>
                    <a href="#" className="hover:text-primary transition" onClick={(e) => e.preventDefault()}>
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition" onClick={(e) => e.preventDefault()}>
                      Terms
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition" onClick={(e) => e.preventDefault()}>
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
           <div
  className={`border-t pt-8 text-center text-sm space-y-3 ${
    isDark ? "border-border text-foreground/50" : "border-slate-200 text-slate-600"
  }`}
>
  <p>&copy; 2025 FinMan. All rights reserved.</p>

<p className="flex flex-col sm:flex-row items-center justify-center gap-3">
  <span>
    Made with <span className="text-red-500">❤️</span> by
    <span className={`font-semibold ${isDark ? "text-foreground" : "text-slate-900"}`}>
      {" "}Devansh Khodaskar
    </span>
  </span>

  <span className="flex items-center gap-4">
    <a
      href="https://github.com/DevanshKhodaskar"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary transition"
      aria-label="GitHub"
    >
      <Github size={18} />
    </a>

    <a
      href="https://www.linkedin.com/in/devanshkhodaskar/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary transition"
      aria-label="LinkedIn"
    >
      <Linkedin size={18} />
    </a>
  </span>
</p>

</div>

          </div>
        </footer>
      </div>
    </div>
  )
}

export default Landing
