import React, { useState } from 'react';
import Button from 'components/ui/Button';


const FloatingDualCTA = () => {
  const [isLoading, setIsLoading] = useState({ primary: false, secondary: false });

  const handleTelegramConnect = () => {
    setIsLoading({ ...isLoading, primary: true });
    window.open('https://t.me/finman_dev_bot', '_blank');
    setTimeout(() => {
      setIsLoading({ ...isLoading, primary: false });
    }, 2000);
  };

  const handleDashboardDemo = () => {
    setIsLoading({ ...isLoading, secondary: true });
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection?.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      setIsLoading({ ...isLoading, secondary: false });
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-998 flex flex-col gap-3 lg:flex-row lg:gap-4">
      <Button
        variant="outline"
        size="lg"
        onClick={handleDashboardDemo}
        loading={isLoading?.secondary}
        iconName="LayoutDashboard"
        iconPosition="left"
        className="glass-effect border-secondary/30 hover:border-secondary hover:bg-secondary/10 transition-transform-250 hover:scale-105 shadow-card"
      >
        Try Demo
      </Button>
      <Button
        variant="default"
        size="lg"
        onClick={handleTelegramConnect}
        loading={isLoading?.primary}
        iconName="Send"
        iconPosition="left"
        className="cta-shadow neon-glow transition-transform-250 hover:scale-105 animate-pulse-glow"
      >
        Start Free Now
      </Button>
    </div>
  );
};

export default FloatingDualCTA;
