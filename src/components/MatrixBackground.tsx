import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MatrixBackgroundProps {
  className?: string;
  opacity?: number;
  speed?: number;
}

export default function MatrixBackground({
  className = '',
  opacity = 0.08,
  speed = 50,
}: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Enhanced Matrix characters (mix of numbers, tech symbols, and katakana)
    const chars = 'ｦｧｨｩｪｫｬｭｮｯ0123456789ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｘｙｚ<>[]{}/\\|^&*()_+-=;:\'"$#@!?';
    const charArray = chars.split('');

    // Font settings
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = [];
    const speeds: number[] = [];
    const colors: string[] = [];

    // Initialize drops with random properties
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // Start above the canvas
      speeds[i] = 0.5 + Math.random() * 1.5; // Random speed
      colors[i] = Math.random() > 0.95 ? '#d4af37' : `rgba(212, 175, 55, ${0.3 + Math.random() * 0.7})`; // Occasional gold highlight
    }

    const draw = () => {
      // Semi-transparent background for fade effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.font = `${fontSize}px 'Courier New', monospace`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Set color with varying opacity for depth effect
        ctx.fillStyle = colors[i];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Move drop
        drops[i] += speeds[i];

        // Reset drops at bottom with some randomness
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = 0.5 + Math.random() * 1.5;
          colors[i] = Math.random() > 0.95 ? '#d4af37' : `rgba(212, 175, 55, ${0.3 + Math.random() * 0.7})`;
        }
      }
    };

    // Animation loop with speed control
    const animationSpeed = Math.max(10, 100 - speed);
    let lastTime = 0;
    let animationId: number;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime > animationSpeed) {
        draw();
        lastTime = currentTime;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [speed]);

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: 1 }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          willChange: 'contents',
        }}
      />
      {/* Animated overlay gradient */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(10,10,10,0.5) 100%)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
