import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const BenefitsGrid = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const benefits = [
    {
      id: 'telegram-speed',
      platform: 'Telegram',
      icon: 'Zap',
      title: 'Log Expenses in 5 Seconds',
      description: 'No app switching, no forms, no friction. Just text and done.',
      features: ['Natural language processing', 'Voice message support', 'Instant confirmation', 'Auto-categorization'],
      color: 'primary',
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      id: 'dashboard-insights',
      platform: 'Dashboard',
      icon: 'BarChart3',
      title: 'Beautiful Visual Insights',
      description: 'Transform raw data into actionable financial intelligence.',
      features: ['Interactive charts', 'Spending patterns', 'Budget tracking', 'Export reports'],
      color: 'secondary',
      gradient: 'from-secondary/20 to-secondary/5'
    },
    {
      id: 'telegram-anywhere',
      platform: 'Telegram',
      icon: 'Smartphone',
      title: 'Track From Anywhere',
      description: 'Your expense tracker lives where you already chat.',
      features: ['Works offline', 'No app install needed', 'Cross-device sync', 'Group expense sharing'],
      color: 'accent',
      gradient: 'from-accent/20 to-accent/5'
    },
    {
      id: 'dashboard-control',
      platform: 'Dashboard',
      icon: 'Settings',
      title: 'Complete Financial Control',
      description: 'Deep dive into your finances with powerful tools.',
      features: ['Custom categories', 'Budget alerts', 'Recurring expenses', 'Multi-currency support'],
      color: 'primary',
      gradient: 'from-primary/20 to-primary/5'
    },
    
    {
      id: 'dashboard-smart',
      platform: 'Dashboard',
      icon: 'Brain',
      title: 'Smart Recommendations',
      description: 'AI-powered insights to optimize your spending.',
      features: ['Spending predictions', 'Savings suggestions', 'Anomaly detection', 'Goal tracking'],
      color: 'accent',
      gradient: 'from-accent/20 to-accent/5'
    }
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-9xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Dual-Platform</span> Power
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get the best of both worlds: instant logging on Telegram, deep insights on dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits?.map((benefit) => (
            <div
              key={benefit?.id}
              onMouseEnter={() => setHoveredCard(benefit?.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`
                glass-effect rounded-2xl p-8 transition-all duration-300 cursor-pointer
                ${hoveredCard === benefit?.id 
                  ? 'scale-105 neon-glow border-' + benefit?.color :'hover:scale-102 border-border'
                }
              `}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit?.gradient} flex items-center justify-center`}>
                  <Icon name={benefit?.icon} size={28} color={`var(--color-${benefit?.color})`} />
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-${benefit?.color}/20 text-${benefit?.color}`}>
                  {benefit?.platform}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-3">{benefit?.title}</h3>
              <p className="text-muted-foreground mb-6">{benefit?.description}</p>

              {hoveredCard === benefit?.id && (
                <div className="space-y-2 animate-fade-in">
                  {benefit?.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icon name="Check" size={16} color={`var(--color-${benefit?.color})`} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 glass-effect rounded-full">
            <Icon name="Sparkles" size={24} color="var(--color-accent)" />
            <span className="text-lg font-semibold">
              Both platforms work together seamlessly - use what fits your moment
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsGrid;