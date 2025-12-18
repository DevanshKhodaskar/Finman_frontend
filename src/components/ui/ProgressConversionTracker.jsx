import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const ProgressConversionTracker = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const milestones = [
    { id: 'hero', label: 'Welcome', progress: 0, icon: 'Home', color: 'text-primary' },
    { id: 'demo', label: 'Demo Viewed', progress: 20, icon: 'PlayCircle', color: 'text-secondary' },
    { id: 'features', label: 'Features Explored', progress: 40, icon: 'Sparkles', color: 'text-accent' },
    { id: 'reviews', label: 'Trust Built', progress: 60, icon: 'MessageSquare', color: 'text-primary' },
    { id: 'pricing', label: 'Value Understood', progress: 80, icon: 'DollarSign', color: 'text-secondary' },
    { id: 'faq', label: 'Ready to Start', progress: 100, icon: 'CheckCircle2', color: 'text-accent' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement?.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      
      setScrollProgress(Math.min(progress, 100));

      const currentSection = milestones?.find((milestone, index) => {
        const nextMilestone = milestones?.[index + 1];
        return progress >= milestone?.progress && (!nextMilestone || progress < nextMilestone?.progress);
      });

      if (currentSection && currentSection?.id !== currentMilestone?.id) {
        setCurrentMilestone(currentSection);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentMilestone]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-1000 h-1 bg-muted/30">
        <div 
          className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-1000 pointer-events-none">
        <div className={`
          glass-effect rounded-full px-6 py-3 shadow-card
          transition-all duration-300
          ${showCelebration ? 'scale-110 neon-glow' : 'scale-100'}
        `}>
          <div className="flex items-center gap-3">
            {currentMilestone && (
              <>
                <Icon 
                  name={currentMilestone?.icon} 
                  size={20} 
                  className={currentMilestone?.color}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{currentMilestone?.label}</span>
                  <div className="flex gap-1 mt-1">
                    {milestones?.map((milestone, index) => (
                      <div
                        key={milestone?.id}
                        className={`
                          w-6 h-1 rounded-full transition-all duration-300
                          ${scrollProgress >= milestone?.progress 
                            ? 'bg-primary' :'bg-muted/50'
                          }
                        `}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showCelebration && currentMilestone && (
        <div className="fixed inset-0 z-80 pointer-events-none flex items-center justify-center">
          <div className="animate-scale-in">
            <div className="glass-effect rounded-2xl p-8 shadow-card neon-glow">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon 
                    name={currentMilestone?.icon} 
                    size={32} 
                    color="var(--color-primary)"
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text mb-2">
                    {currentMilestone?.label}!
                  </div>
                  <div className="text-sm text-muted-foreground">
                    You're {currentMilestone?.progress}% through your journey
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProgressConversionTracker;