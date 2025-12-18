import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Input from 'components/ui/Input';
import Button from '../../../components/ui/Button';


const FAQSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How is FinMan completely free?',
      answer: 'We believe financial tools should be accessible to everyone. FinMan is funded by a passionate team committed to financial literacy. We don\'t sell your data, show ads, or have hidden premium tiers. Our mission is to help people take control of their finances, not profit from their struggles.',
      category: 'pricing'
    },
   ,
    {
      id: 3,
      question: 'Do I need to install any apps?',
      answer: 'No app installation required! For expense logging, simply use Telegram (which you likely already have). For insights, access our web dashboard from any browser. This means no storage space used on your phone and instant access from any device.',
      category: 'setup'
    },
    {
      id: 4,
      question: 'How does the Telegram bot work?',
      answer: 'Simply text your expenses to @finman_dev_bot in natural language. Examples: "Coffee $4.50", "Gas $52.30 Shell", or "Dinner $67.80 Italian restaurant". The bot uses AI to understand context, categorize automatically, and confirm instantly. You can also send voice messages!',
      category: 'features'
    },
    {
      id: 5,
      question: 'Can I use multiple currencies?',
      answer: 'Yes! FinMan supports 150+ currencies with real-time exchange rates. You can log expenses in any currency, and the dashboard will convert and display everything in your preferred base currency. Perfect for travelers and international users.',
      category: 'features'
    },
    {
      id: 6,
      question: 'What if I make a mistake logging an expense?',
      answer: 'No problem! You can edit or delete any expense from the web dashboard. The Telegram bot also allows quick corrections by replying to the confirmation message with updated details. All changes sync instantly across platforms.',
      category: 'usage'
    },
    {
      id: 7,
      question: 'Can I share expenses with family or roommates?',
      answer: 'Yes! Create shared expense groups in Telegram where multiple users can log expenses to the same account. Perfect for household budgets, trips, or shared living situations. Each member gets their own login to view the dashboard.',
      category: 'features'
    },
    {
      id: 8,
      question: 'How do I export my data?',
      answer: 'Export your complete expense history anytime from the dashboard in CSV, Excel, or PDF formats. You own your data completely and can download it whenever you want. No lock-in, no restrictions.',
      category: 'usage'
    },
    {
      id: 9,
      question: 'Does it work offline?',
      answer: 'The Telegram bot requires internet to log expenses (like any messaging app). However, the web dashboard has offline capabilities - you can view previously loaded data without connection. Expenses sync automatically when you\'re back online.',
      category: 'technical'
    },
    {
      id: 10,
      question: 'Will there ever be a premium version?',
      answer: 'No. We\'ve made a commitment to keep FinMan completely free forever. All features you see today and all future features will remain free for all users. No bait-and-switch, no paywalls, no premium tiers. Ever.',
      category: 'pricing'
    }
  ];

  const filteredFAQs = faqs?.filter(faq =>
    faq?.question?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    faq?.answer?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Questions?</span> We've Got Answers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about FinMan
          </p>
        </div>

        <div className="mb-12">
          <Input
            type="search"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="glass-effect"
          />
        </div>

        <div className="space-y-4">
          {filteredFAQs?.map((faq) => (
            <div
              key={faq?.id}
              className="glass-effect rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30"
            >
              <button
                onClick={() => toggleFAQ(faq?.id)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/20 transition-colors"
              >
                <span className="text-lg font-semibold pr-4">{faq?.question}</span>
                <Icon
                  name={expandedFAQ === faq?.id ? 'ChevronUp' : 'ChevronDown'}
                  size={24}
                  className="flex-shrink-0 transition-transform duration-300"
                />
              </button>
              
              {expandedFAQ === faq?.id && (
                <div className="px-6 pb-6 animate-fade-in">
                  <p className="text-muted-foreground leading-relaxed">{faq?.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
            <p className="text-muted-foreground">No questions found matching your search.</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <div className="glass-effect rounded-2xl p-8 inline-block">
            <h3 className="text-xl font-bold mb-4">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help you get started
            </p>
            <Button
              variant="outline"
              size="lg"
              iconName="MessageCircle"
              iconPosition="left"
              onClick={() => window.open('https://t.me/FinMan_support', '_blank')}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;