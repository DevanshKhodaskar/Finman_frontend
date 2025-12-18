import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const TrustSignalSidebar = () => {
  const [userCount, setUserCount] = useState(10247);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trustMetrics = [
    { icon: 'Users', label: 'Active Users', value: userCount?.toLocaleString(), color: 'text-primary' },
    { icon: 'TrendingUp', label: 'Expenses Tracked', value: '2.4M+', color: 'text-secondary' },
    { icon: 'Shield', label: 'Bank-Level Security', value: '256-bit', color: 'text-accent' },
  ];

//   const securityBadges = [
//     { icon: 'Lock', label: 'SSL Encrypted', verified: true },
//     { icon: 'Database', label: 'GDPR Compliant', verified: true },
//     { icon: 'ShieldCheck', label: 'SOC 2 Type II', verified: true },
//   ]

  return (
    <aside className={`
      fixed left-6 top-24 z-90 w-64 glass-effect rounded-xl p-6 shadow-card
      transition-all duration-300
      ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'}
      hidden xl:block
    `}>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={16} />
            Live Metrics
          </h3>
          <div className="space-y-4">
            {trustMetrics?.map((metric, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-muted/50 ${metric?.color}`}>
                  <Icon name={metric?.icon} size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">{metric?.label}</div>
                  <div className="text-lg font-bold">{metric?.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
{/* 
        <div className="border-t border-border pt-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <Icon name="ShieldCheck" size={16} />
            Security
          </h3>
           <div className="space-y-3">
            {securityBadges?.map((badge, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <Icon name={badge?.icon} size={16} color="var(--color-accent)" />
                <span className="text-sm flex-1">{badge?.label}</span>
                {badge?.verified && (
                  <Icon name="CheckCircle2" size={14} color="var(--color-accent)" />
                )}
              </div>
            ))}
          </div> 
        </div> */}

        <div className="border-t border-border pt-6">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-2">Trusted by</div>
            <div className="text-2xl font-bold gradient-text">10,000+</div>
            <div className="text-xs text-muted-foreground mt-1">professionals worldwide</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default TrustSignalSidebar;