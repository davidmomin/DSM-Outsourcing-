import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import AIRecommender from '../components/AIRecommender';
import { motion } from 'framer-motion';
import { GraduationCap, Laptop, Award, Users, Globe, Briefcase, Code, Database, Server, Palette, Smartphone, Cloud } from 'lucide-react';

export default function Home() {
  const features = [
    { 
      icon: Code, 
      title: 'Frontend Development', 
      desc: 'HTML, CSS, JavaScript, React, Next.js & modern UI frameworks',
      category: 'Frontend'
    },
    { 
      icon: Server, 
      title: 'Backend Development', 
      desc: 'Node.js, Express, Python & server-side programming',
      category: 'Backend'
    },
    { 
      icon: Database, 
      title: 'Database Management', 
      desc: 'MySQL, SQLite, MongoDB & data modeling',
      category: 'Database'
    },
    { 
      icon: Palette, 
      title: 'UI/UX Design', 
      desc: 'Figma, Adobe XD & user interface design',
      category: 'Design'
    },
    { 
      icon: Smartphone, 
      title: 'Mobile Apps', 
      desc: 'React Native & cross-platform development',
      category: 'Mobile'
    },
    { 
      icon: Cloud, 
      title: 'Cloud & DevOps', 
      desc: 'AWS, Docker & deployment automation',
      category: 'Cloud'
    },
  ];

  const benefits = [
    { icon: GraduationCap, title: 'Expert Instructors', desc: 'Learn from industry professionals with years of experience' },
    { icon: Laptop, title: 'Hands-on Projects', desc: 'Work on real-world projects to build your portfolio' },
    { icon: Award, title: 'Certification', desc: 'Get recognized certificates to boost your career' },
    { icon: Users, title: 'Community', desc: 'Join a network of successful alumni and peers' },
    { icon: Globe, title: 'Remote Work', desc: 'Master skills for freelancing and remote jobs' },
    { icon: Briefcase, title: 'Job Support', desc: 'Get guidance for placements and job opportunities' },
  ];

  return (
    <div className="min-h-screen">
      <SEO />
      <Navbar />
      <Hero />
      <div className="pb-24">
        <AIRecommender />
      </div>
      
      {/* Features Section - Tech Stack */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-dark-900/40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Comprehensive <span className="gold-text">Tech Training</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Master full-stack development with our industry-aligned curriculum
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover:border-gold-500/30 transition-all"
              >
                <div className="w-14 h-14 bg-gold-500/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-gold-400" />
                </div>
                <span className="text-xs text-gold-500/70 uppercase tracking-wider">{feature.category}</span>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-dark-900/40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Why Choose <span className="gold-text">DSM?</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              We empower students with skills for the digital economy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover:border-gold-500/30 transition-all"
              >
                <div className="w-14 h-14 bg-gold-500/10 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-7 h-7 text-gold-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
