import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'gradient' | 'particles' | 'grid' | 'waves';
  className?: string;
}

// Gradient Orbs Background
function GradientOrbs() {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[120px]"
          style={{
            width: 400 + i * 200,
            height: 400 + i * 200,
            background: `radial-gradient(circle, rgba(212, 175, 55, ${0.1 - i * 0.02}) 0%, transparent 70%)`,
            left: `${20 + i * 30}%`,
            top: `${10 + i * 20}%`,
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
    </>
  );
}

// Floating Particles Background
function FloatingParticles() {
  return (
    <>
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gold-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

// Grid Pattern Background
function GridPattern() {
  return (
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  );
}

// Animated Waves Background
function AnimatedWaves() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(212, 175, 55, 0)" />
          <stop offset="50%" stopColor="rgba(212, 175, 55, 0.5)" />
          <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
        </linearGradient>
      </defs>
      {[...Array(3)].map((_, i) => (
        <motion.path
          key={i}
          d={`M 0 ${300 + i * 150} Q 250 ${200 + i * 150} 500 ${300 + i * 150} T 1000 ${300 + i * 150}`}
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          animate={{
            d: [
              `M 0 ${300 + i * 150} Q 250 ${200 + i * 150} 500 ${300 + i * 150} T 1000 ${300 + i * 150}`,
              `M 0 ${300 + i * 150} Q 250 ${400 + i * 150} 500 ${300 + i * 150} T 1000 ${300 + i * 150}`,
              `M 0 ${300 + i * 150} Q 250 ${200 + i * 150} 500 ${300 + i * 150} T 1000 ${300 + i * 150}`,
            ],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}

export default function AnimatedBackground({ variant = 'gradient', className = '' }: AnimatedBackgroundProps) {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
      
      {/* Variant-specific animations */}
      {variant === 'gradient' && <GradientOrbs />}
      {variant === 'particles' && <FloatingParticles />}
      {variant === 'grid' && <GridPattern />}
      {variant === 'waves' && <AnimatedWaves />}
      
      {/* Common overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900" />
    </div>
  );
}
