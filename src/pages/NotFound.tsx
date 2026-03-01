import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function NotFound() {
    return (
        <div className="min-h-screen pt-20">
            {/* Background Image */}
            <div 
                className="fixed inset-0 -z-50"
                style={{
                    backgroundImage: `url('/background4.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            />
            <div className="fixed inset-0 bg-dark-900/70 -z-40" />
            <SEO title="Page Not Found - DSM Outsourcing" description="The page you're looking for doesn't exist." />
            <Navbar />
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center"
            >
                <motion.h1 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-8xl md:text-9xl font-bold text-primary-500 mb-4"
                >
                    404
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-2xl md:text-3xl text-white mb-2"
                >
                    Page not found
                </motion.p>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-gray-400 mb-8 max-w-md"
                >
                    Sorry, the page you're looking for doesn't exist or has been moved.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Link 
                        to="/" 
                        className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors duration-300"
                    >
                        Go Home
                    </Link>
                </motion.div>
            </motion.div>
            <Footer />
        </div>
    );
}
