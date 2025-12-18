import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ProblemAgitation = () => {
  const [activeScenario, setActiveScenario] = useState(null);

  const scenarios = [
    {
      id: 'coffee',
      icon: 'Coffee',
      title: 'Morning Coffee',
      traditional: 'Open app → Wait for load → Navigate to add expense → Select category → Enter amount → Add note → Save → Close app',
      telegram: 'Text: "Coffee $4.50" → Done in 3 seconds',
      timeTraditional: '45 seconds',
      timeTelegram: '3 seconds',
      color: 'text-amber-500'
    },
    {
      id: 'gas',
      icon: 'Fuel',
      title: 'Gas Fill-up',
      traditional: 'Unlock phone → Find app → Login again → Add transaction → Choose payment method → Upload receipt → Categorize → Submit',
      telegram: 'Text: "Gas $52.30 Shell" → Instant logging',
      timeTraditional: '1 minute 20 seconds',
      timeTelegram: '5 seconds',
      color: 'text-blue-500'
    },
    {
      id: 'dinner',
      icon: 'UtensilsCrossed',
      title: 'Dinner Out',
      traditional: 'Remember to log later → Forget amount → Estimate → Open app → Manually enter → Wrong category → Fix it → Finally save',
      telegram: 'Text immediately: "Dinner $67.80 Italian" → Never forget',
      timeTraditional: '2 minutes (if you remember)',
      timeTelegram: '4 seconds',
      color: 'text-rose-500'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-card">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Stop Fighting</span> Your Expense Tracker
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Traditional apps make simple tasks complicated. Click any scenario to see the difference.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {scenarios?.map((scenario) => (
            <div
              key={scenario?.id}
              onClick={() => setActiveScenario(activeScenario === scenario?.id ? null : scenario?.id)}
              className={`
                glass-effect rounded-2xl p-8 cursor-pointer transition-all duration-300
                ${activeScenario === scenario?.id 
                  ? 'scale-105 neon-glow border-primary' :'hover:scale-102 border-border'
                }
              `}
            >
              <div className={`w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center mb-6 ${scenario?.color}`}>
                <Icon name={scenario?.icon} size={32} />
              </div>

              <h3 className="text-2xl font-bold mb-4">{scenario?.title}</h3>

              {activeScenario === scenario?.id ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="X" size={20} color="var(--color-destructive)" />
                      <span className="font-semibold text-destructive">Traditional App</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{scenario?.traditional}</p>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={16} color="var(--color-destructive)" />
                      <span className="text-sm font-medium text-destructive">{scenario?.timeTraditional}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="Check" size={20} color="var(--color-accent)" />
                      <span className="font-semibold text-accent">FinMan</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{scenario?.telegram}</p>
                    <div className="flex items-center gap-2">
                      <Icon name="Zap" size={16} color="var(--color-accent)" />
                      <span className="text-sm font-medium text-accent">{scenario?.timeTelegram}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Click to see the comparison</p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 px-6 py-4 glass-effect rounded-full">
            <Icon name="TrendingDown" size={24} color="var(--color-destructive)" />
            <span className="text-lg font-semibold">
              Average time wasted per day with traditional apps: <span className="text-destructive">8 minutes</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemAgitation;