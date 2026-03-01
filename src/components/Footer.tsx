import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, MailIcon, GraduationCapIcon, FacebookIcon, MessageCircleIcon } from './icons';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contact" className="py-16 border-t border-gold-500/10 relative">
      {/* Subtle overlay for better readability */}
      <div className="absolute inset-0 bg-dark-900/40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center">
                <GraduationCapIcon className="w-6 h-6 text-dark-900" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold gold-text">DSM Outsourcing</h3>
                <p className="text-xs text-gray-500">& Computer Training Center</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Empowering the next generation of digital professionals through hands-on,
              industry-aligned training programs.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://facebook.com/dsmoutsourcing" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-dark-200 border border-gold-500/10 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500/30 transition-all">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="https://wa.me/8801774471120" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-dark-200 border border-gold-500/10 flex items-center justify-center text-gray-400 hover:text-green-500 hover:border-green-500/30 transition-all">
                <MessageCircleIcon className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Courses', path: '/courses' },
                { name: 'Admission', path: '/admission' },
                { name: 'Success Stories', path: '/stories' },
                { name: 'Student Portal', path: '/student' }
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-sm text-gray-500 hover:text-gold-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-500">
                <MapPinIcon className="w-4 h-4 text-gold-500/50 shrink-0 mt-0.5" />
                <span>DSM Outsourcing, Main Road, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <PhoneIcon className="w-4 h-4 text-gold-500/50 shrink-0" />
                <span>+880 17744 71120</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <MailIcon className="w-4 h-4 text-gold-500/50 shrink-0" />
                <span>rbkhan00009@gmail.com</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 pt-8 border-t border-gold-500/5 text-center">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} DSM Outsourcing & Computer Training Center. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
