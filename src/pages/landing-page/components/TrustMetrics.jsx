import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const TrustMetrics = () => {
  const [metrics, setMetrics] = useState({
    users: 10247,
    expenses: 2400000,
    saved: 12500000,
    countries: 47
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        users: prev?.users + Math.floor(Math.random() * 3),
        expenses: prev?.expenses + Math.floor(Math.random() * 50),
        saved: prev?.saved + Math.floor(Math.random() * 100),
        countries: prev?.countries
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const metricCards = [
    {
      icon: 'Users',
      label: 'Active Users',
      value: metrics?.users?.toLocaleString(),
      suffix: '+',
      color: 'primary',
      gradient: 'from-primary/20 to-primary/5',
      description: 'Tracking expenses daily'
    },
    {
      icon: 'Receipt',
      label: 'Expenses Tracked',
      value: (metrics?.expenses / 1000000)?.toFixed(1),
      suffix: 'M+',
      color: 'secondary',
      gradient: 'from-secondary/20 to-secondary/5',
      description: 'Transactions logged'
    },
    {
      icon: 'PiggyBank',
      label: 'Money Saved',
      value: '$' + (metrics?.saved / 1000000)?.toFixed(1),
      suffix: 'M+',
      color: 'accent',
      gradient: 'from-accent/20 to-accent/5',
      description: 'Through insights'
    },
    {
      icon: 'Globe',
      label: 'Countries',
      value: metrics?.countries,
      suffix: '+',
      color: 'primary',
      gradient: 'from-primary/20 to-primary/5',
      description: 'Worldwide reach'
    }
  ];

  const securityBadges = [
    { icon: 'Shield', label: '256-bit Encryption', verified: true },
    { icon: 'Lock', label: 'GDPR Compliant', verified: true },
    { icon: 'ShieldCheck', label: 'SOC 2 Type II', verified: true },
    { icon: 'Database', label: 'ISO 27001', verified: true }
  ];

  return (
    <section className="py-24 bg-card">
      <div className="max-w-9xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted by <span className="gradient-text">Thousands</span> Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join a growing community of financially empowered individuals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {metricCards?.map((metric, index) => (
            <div
              key={index}
              className="glass-effect rounded-2xl p-8 hover:scale-105 transition-transform-250 card-shadow"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${metric?.gradient} flex items-center justify-center mb-6`}>
                <Icon name={metric?.icon} size={28} color={`var(--color-${metric?.color})`} />
              </div>
              <div className="text-4xl font-bold gradient-text mb-2">
                {metric?.value}{metric?.suffix}
              </div>
              <div className="text-lg font-semibold mb-1">{metric?.label}</div>
              <div className="text-sm text-muted-foreground">{metric?.description}</div>
            </div>
          ))}
        </div>

        <div className="glass-effect rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Encryption Security</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your financial data is protected with enterprise-grade security measures
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityBadges?.map((badge, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-4 p-6 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <Icon name={badge?.icon} size={32} color="var(--color-accent)" />
                </div>
                <div className="text-center">
                  <div className="font-semibold mb-1">{badge?.label}</div>
                  {badge?.verified && (
                    <div className="flex items-center justify-center gap-1 text-xs text-accent">
                      <Icon name="CheckCircle2" size={14} />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent/10 border border-accent/30">
              <Icon name="ShieldCheck" size={20} color="var(--color-accent)" />
              <span className="text-sm font-medium">
                Your data is never sold or shared with third parties
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustMetrics;
