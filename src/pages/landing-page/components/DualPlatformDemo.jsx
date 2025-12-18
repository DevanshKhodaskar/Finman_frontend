import React, { useState, useEffect } from "react";
import Icon from "components/AppIcon";

const DualPlatformDemo = () => {
  const [activeMessage, setActiveMessage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const telegramMessages = [
    { type: "user", text: "Coffee ₹120", time: "10:23 AM" },
    {
      type: "bot",
      text: "✅ Logged!\nCoffee - ₹120\nCategory: Food & Drink",
      time: "10:23 AM",
    },
    { type: "user", text: "📸 Bill photo uploaded", time: "2:45 PM" },
    {
      type: "bot",
      text: "🧾 Bill scanned!\nTotal: ₹1,250\nCategory: Shopping",
      time: "2:46 PM",
    },
  ];

  const dashboardData = [
    { category: "Food & Drink", amount: 120, color: "#8B5CF6" },
    { category: "Transportation", amount: 420, color: "#06B6D4" },
    { category: "Shopping", amount: 1250, color: "#10B981" },
    { category: "Entertainment", amount: 310, color: "#F59E0B" },
  ];

  const totalSpent = dashboardData.reduce((s, i) => s + i.amount, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveMessage((prev) => (prev + 1) % telegramMessages.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="demo" className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            See It In <span className="gradient-text">Action</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Text expenses or upload bill photos — everything syncs instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Telegram */}
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Telegram Bot</h3>

            <div className="space-y-4 h-96 overflow-y-auto">
              {telegramMessages.slice(0, activeMessage + 1).map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-4 text-sm whitespace-pre-line ${
                      m.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {m.text}
                    <div className="text-xs opacity-70 mt-1">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border flex gap-3">
              <Icon name="MessageSquare" size={18} />
              <input
                disabled
                placeholder="Type expense or upload bill..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <Icon name="Image" size={18} />
              <Icon name="Mic" size={18} />
            </div>
          </div>

          {/* Dashboard */}
          <div className="glass-effect rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Dashboard</h3>

            <div className="text-4xl font-bold mb-6 gradient-text">
              ₹{totalSpent.toLocaleString()}
            </div>

            {dashboardData.map((d, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{d.category}</span>
                  <span>₹{d.amount}</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(d.amount / totalSpent) * 100}%`,
                      backgroundColor: d.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DualPlatformDemo;
