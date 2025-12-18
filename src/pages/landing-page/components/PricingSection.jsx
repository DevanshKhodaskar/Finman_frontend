import React from 'react';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';

const PricingSection = () => {
  const competitorPricing = [
    { name: 'Mint', price: 'Free*', asterisk: '*With ads and data selling' },
    { name: 'YNAB', price: '$14.99', asterisk: '/month or $99/year' },
    { name: 'PocketGuard', price: '$12.99', asterisk: '/month for full features' },
    { name: 'Goodbudget', price: '$8', asterisk: '/month for premium' }
  ];

  const features = [
    'Unlimited expense tracking',
    'Telegram bot access',
    'Beautiful web dashboard',
    'Real-time sync across devices',
    'Multi-currency support',
    'Custom categories',
    'Budget tracking',
    'Visual insights & charts',
    'Export reports',
    'Voice message logging',
    'No ads ever',
    
    'Priority support',
    'Regular feature updates'
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-card to-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No hidden fees, no credit card required, no surprises
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="glass-effect rounded-3xl p-8 lg:p-12 neon-glow border-primary card-shadow">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-6">
                <Icon name="Sparkles" size={16} color="var(--color-accent)" />
                <span className="text-sm font-semibold text-accent">Best Value</span>
              </div>
              
              <h3 className="text-3xl font-bold mb-4">FinMan</h3>
              
              <div className="mb-6">
                <div className="text-7xl font-bold gradient-text mb-2">$0</div>
                <div className="text-2xl font-semibold text-foreground">Forever</div>
                <div className="text-sm text-muted-foreground mt-2">No credit card required</div>
              </div>

              <Button
                variant="default"
                size="xl"
                onClick={() => window.open('https://t.me/finman_dev_bot', '_blank')}
                iconName="Send"
                iconPosition="left"
                className="w-full cta-shadow mb-6"
              >
                Start Free Now
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Icon name="Users" size={16} />
                <span>Join 10,000+ users already tracking</span>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h4 className="font-semibold mb-6 flex items-center gap-2">
                <Icon name="CheckCircle2" size={20} color="var(--color-accent)" />
                Everything Included
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {features?.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Icon name="Check" size={16} color="var(--color-accent)" className="mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 rounded-lg bg-accent/10 border border-accent/30">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-semibold text-accent">Why free?</span>
                  <p className="text-muted-foreground mt-1">
                    We believe financial tools should be accessible to everyone. Our mission is to help people take control of their finances, not profit from their struggles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Compare with Others</h3>
              <div className="space-y-4">
                {competitorPricing?.map((competitor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div>
                      <div className="font-semibold">{competitor?.name}</div>
                      <div className="text-xs text-muted-foreground">{competitor?.asterisk}</div>
                    </div>
                    <div className="text-xl font-bold text-destructive">{competitor?.price}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Annual Savings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">vs. YNAB</span>
                  <span className="text-2xl font-bold text-accent">Save $179.88</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">vs. PocketGuard</span>
                  <span className="text-2xl font-bold text-accent">Save $155.88</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">vs. Goodbudget</span>
                  <span className="text-2xl font-bold text-accent">Save $96</span>
                </div>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="Gift" size={24} color="var(--color-primary)" />
                </div>
                <div>
                  <h4 className="font-bold mb-2">Lifetime Free Guarantee</h4>
                  <p className="text-sm text-muted-foreground">
                    We promise to keep FinMan free forever. No bait-and-switch, no premium tiers, no paywalls. What you see is what you get, always.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;