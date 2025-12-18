import React from 'react';
import Icon from 'components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Dashboard Demo', href: '#demo' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' }
    ],
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press Kit', href: '#' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'GDPR', href: '#' }
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Status', href: '#' },
      { label: 'API Docs', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: 'Twitter', href: 'https://twitter.com/finmanpro', label: 'Twitter' },
    { icon: 'Github', href: 'https://github.com/finmanpro', label: 'GitHub' },
    { icon: 'Linkedin', href: 'https://linkedin.com/company/finmanpro', label: 'LinkedIn' },
    { icon: 'Youtube', href: 'https://youtube.com/@finmanpro', label: 'YouTube' }
  ];

  const handleLinkClick = (href) => {
    if (href?.startsWith('#')) {
      const element = document.getElementById(href?.substring(1));
      if (element) {
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-9xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Icon name="Wallet" size={28} color="var(--color-primary)" />
              </div>
              <span className="text-2xl font-bold gradient-text">FinMan</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Track expenses like you think. Instantly log via Telegram, get beautiful dashboard insights. Free forever.
            </p>
            <div className="flex gap-3">
              {socialLinks?.map((social, index) => (
                <a
                  key={index}
                  href={social?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg glass-effect hover:bg-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label={social?.label}
                >
                  <Icon name={social?.icon} size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks?.product?.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link?.href)}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link?.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks?.company?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link?.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks?.legal?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link?.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks?.support?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link?.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link?.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © {currentYear} FinMan. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Shield" size={16} color="var(--color-accent)" />
                <span>Secured by 256-bit encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Globe" size={16} color="var(--color-accent)" />
                <span>Available in 47 countries</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;