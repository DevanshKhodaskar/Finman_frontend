import React from 'react';
import Icon from 'components/AppIcon';

const ComparisonTable = () => {
  const competitors = [
    { name: 'FinMan', logo: 'Wallet', color: 'primary' },
    { name: 'Mint', logo: 'Building2', color: 'muted' },
    { name: 'YNAB', logo: 'Building2', color: 'muted' },
    { name: 'PocketGuard', logo: 'Building2', color: 'muted' },
    { name: 'Goodbudget', logo: 'Building2', color: 'muted' }
  ];

  const features = [
    { name: 'Free Forever', values: [true, false, false, false, false] },
    { name: 'Telegram Integration', values: [true, false, false, false, false] },
    { name: 'No Learning Curve', values: [true, false, false, false, true] },
    { name: 'Real-time Sync', values: [true, true, true, true, false] },
    { name: 'Beautiful Dashboard', values: [true, true, true, true, false] },
    { name: 'Voice Logging', values: [true, false, false, false, false] },
    { name: 'Multi-currency', values: [true, true, true, false, false] },
    { name: 'No Ads', values: [true, false, false, true, true] },
    { name: 'Bank Connections', values: [false, true, true, true, false] },
    { name: 'Instant Setup', values: [true, false, false, true, true] }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-9xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="gradient-text">FinMan</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how we stack up against the competition
          </p>
        </div>

        <div className="glass-effect rounded-2xl overflow-hidden card-shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-6 font-semibold text-muted-foreground min-w-[200px]">
                    Features
                  </th>
                  {competitors?.map((competitor, index) => (
                    <th key={index} className="p-6 min-w-[120px]">
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-${competitor?.color}/20 flex items-center justify-center`}>
                          <Icon name={competitor?.logo} size={24} color={`var(--color-${competitor?.color})`} />
                        </div>
                        <span className={`text-sm font-semibold ${index === 0 ? 'gradient-text' : 'text-muted-foreground'}`}>
                          {competitor?.name}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features?.map((feature, featureIndex) => (
                  <tr key={featureIndex} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-6 font-medium">{feature?.name}</td>
                    {feature?.values?.map((value, valueIndex) => (
                      <td key={valueIndex} className="p-6 text-center">
                        {value ? (
                          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${valueIndex === 0 ? 'bg-accent/20' : 'bg-muted/50'}`}>
                            <Icon 
                              name="Check" 
                              size={20} 
                              color={valueIndex === 0 ? 'var(--color-accent)' : 'var(--color-muted-foreground)'} 
                            />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10">
                            <Icon name="X" size={20} color="var(--color-destructive)" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-col gap-4 p-8 glass-effect rounded-2xl">
            <div className="flex items-center gap-3">
              <Icon name="Sparkles" size={24} color="var(--color-primary)" />
              <span className="text-lg font-semibold">
                The only expense tracker that's truly free forever with no compromises
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              While others charge $10-15/month or show ads, we believe financial tools should be accessible to everyone
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;