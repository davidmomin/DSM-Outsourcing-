import { motion } from 'framer-motion';
import { ArrowDownIcon, SparklesIcon, UsersIcon, BookOpenIcon, AwardIcon } from './icons';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Animated CSS Background - Replacing Image */}
      <div className="absolute inset-0 z-0">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        
        {/* Animated Gradient Orbs - Responsive sizing */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-gold-500/10 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] bg-gold-600/10 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] bg-gold-500/5 rounded-full blur-[100px] lg:blur-[150px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02] sm:opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Floating Particles - Reduced on mobile */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gold-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 pt-16 sm:pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-3 sm:px-5 py-1.5 sm:py-2 mb-6 sm:mb-8"
          >
            <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gold-400" />
            <span className="text-xs sm:text-sm text-gold-400 font-medium">Empowering Digital Futures</span>
          </motion.div>

          {/* Main Heading - Responsive */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold leading-tight mb-4 sm:mb-6">
            <motion.span 
              className="text-white inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              DSM
            </motion.span>{' '}
            <motion.span 
              className="gold-text inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Outsourcing
            </motion.span>
            <br />
            <motion.span 
              className="text-gray-200 text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-light inline-block mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              & Computer Training Center
            </motion.span>
          </h1>

          {/* Subtitle - Responsive */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl mx-auto mb-8 sm:mb-10 px-4"
          >
            Transform your career with industry-leading courses in web development,
            graphic design, digital marketing, and more.
          </motion.p>

          {/* CTA Buttons - Stack on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4 sm:px-0"
          >
            <Link to="/admission" className="gold-btn text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              Enroll Now
              <ArrowDownIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link to="/courses" className="gold-btn-outline text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              View Courses
            </Link>
          </motion.div>

          {/* Stats - Responsive Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-3 gap-3 sm:gap-6 max-w-xs sm:max-w-sm md:max-w-lg mx-auto"
          >
            {[
              { icon: UsersIcon, value: '500+', label: 'Students' },
              { icon: BookOpenIcon, value: '6+', label: 'Courses' },
              { icon: AwardIcon, value: '95%', label: 'Success' },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1.5 sm:mb-2 rounded-lg sm:rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gold-500" />
                </div>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold gold-text">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Hidden on small mobile */}
      <motion.div 
        className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-gold-500/30 flex items-start justify-center p-1.5 sm:p-2"
        >
          <motion.div 
            className="w-0.5 h-1.5 sm:w-1 sm:h-2 bg-gold-500 rounded-full"
            animate={{ opacity: [1, 0, 1], y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
