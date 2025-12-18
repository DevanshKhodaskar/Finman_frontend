import React, { useEffect, useRef, useState } from 'react';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import { useNavigate } from "react-router-dom";


const Hero3D = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(10247);
  const canvasRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas?.width;
        this.y = Math.random() * canvas?.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas?.width) this.x = 0;
        if (this.x < 0) this.x = canvas?.width;
        if (this.y > canvas?.height) this.y = 0;
        if (this.y < 0) this.y = canvas?.height;
      }

      draw() {
        ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
        ctx?.beginPath();
        ctx?.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx?.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles?.push(new Particle());
    }

    function animate() {
      ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
      particles?.forEach(particle => {
        particle?.update();
        particle?.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTelegramConnect = () => {
    window.open('https://t.me/finman_dev_bot', '_blank');
  };

  const handleDashboardDemo = () => {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

 const handleLogin = () => {
  navigate("/login");
};


  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background z-1" />
      
      {/* Login Button in Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="outline"
          size="lg"
          onClick={handleLogin}
          iconName="LogIn"
          iconPosition="left"
          className="glass-effect border-primary/30 hover:border-primary hover:bg-primary/10"
        >
          Login
        </Button>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect border border-primary/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              {userCount?.toLocaleString()}+ users tracking expenses right now
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="gradient-text">Track Expenses</span>
            <br />
            <span className="text-foreground">Like You Think</span>
            <br />
            <span className="gradient-text">Instantly</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Text your expenses to our Telegram bot, get beautiful dashboard insights.
            <br />
            <span className="text-foreground font-semibold">Free forever, setup in 30 seconds.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              variant="default"
              size="xl"
              onClick={handleTelegramConnect}
              iconName="Send"
              iconPosition="left"
              className="cta-shadow neon-glow min-w-[280px]"
            >
              Connect Telegram Bot
            </Button>
            
            <Button
              variant="outline"
              size="xl"
              onClick={handleDashboardDemo}
              iconName="LayoutDashboard"
              iconPosition="left"
              className="glass-effect border-secondary/30 hover:border-secondary min-w-[280px]"
            >
              Try Dashboard Demo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl mx-auto">
            {[
              { icon: 'Zap', label: '5 Second Logging', color: 'text-primary' },
            
              { icon: 'Sparkles', label: 'Beautiful Insights', color: 'text-accent' },
              { icon: 'Infinity', label: 'Free Forever', color: 'text-primary' }
            ]?.map((feature, index) => (
              <div key={index} className="glass-effect rounded-xl p-6 hover:scale-105 transition-transform-250">
                <Icon name={feature?.icon} size={32} className={feature?.color} />
                <p className="text-sm font-medium mt-3">{feature?.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <Icon name="ChevronDown" size={32} color="var(--color-muted-foreground)" />
      </div>
    </section>
  );
};

export default Hero3D;