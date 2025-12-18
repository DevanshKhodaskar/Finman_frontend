import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const InteractiveSectionNavigator = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { label: 'Home', anchor: 'hero', icon: 'Home', tooltip: 'Back to top' },
    { label: 'How It Works', anchor: 'demo', icon: 'PlayCircle', tooltip: 'See live Telegram bot demo' },
    { label: 'Features', anchor: 'features', icon: 'Sparkles', tooltip: 'Explore dual-platform benefits' },
    { label: 'Testimonials', anchor: 'reviews', icon: 'MessageSquare', tooltip: 'Read user success stories' },
    { label: 'Pricing', anchor: 'pricing', icon: 'DollarSign', tooltip: 'Free forever plan' },
    { label: 'FAQ', anchor: 'faq', icon: 'HelpCircle', tooltip: 'Get answers' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section?.anchor);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section?.anchor);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (anchor) => {
    const element = document.getElementById(anchor);
    if (element) {
      element?.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-999 glass-effect border-b border-border">
        <div className="max-w-9xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Icon name="Wallet" size={24} color="var(--color-primary)" />
              </div>
              <span className="text-xl font-bold gradient-text">FinMan</span>
            </div>

            <div className="hidden lg:flex items-center gap-1">
              {sections?.map((section) => (
                <button
                  key={section?.anchor}
                  onClick={() => handleSectionClick(section?.anchor)}
                  className={`
                    relative px-4 py-2 rounded-lg transition-all duration-200
                    flex items-center gap-2 group
                    ${activeSection === section?.anchor 
                      ? 'bg-primary/20 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                  `}
                  title={section?.tooltip}
                >
                  <Icon name={section?.icon} size={18} />
                  <span className="text-sm font-medium">{section?.label}</span>
                  {activeSection === section?.anchor && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
              aria-label="Toggle menu"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-997 lg:hidden">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 glass-effect border-b border-border animate-slide-in">
            <div className="max-w-9xl mx-auto px-6 py-4">
              <div className="flex flex-col gap-2">
                {sections?.map((section) => (
                  <button
                    key={section?.anchor}
                    onClick={() => handleSectionClick(section?.anchor)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${activeSection === section?.anchor 
                        ? 'bg-primary/20 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    <Icon name={section?.icon} size={20} />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{section?.label}</div>
                      <div className="text-xs text-muted-foreground">{section?.tooltip}</div>
                    </div>
                    {activeSection === section?.anchor && (
                      <Icon name="Check" size={18} color="var(--color-primary)" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InteractiveSectionNavigator;
