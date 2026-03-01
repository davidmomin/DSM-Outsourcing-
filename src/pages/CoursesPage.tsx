import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Courses from '../components/Courses';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function CoursesPage() {
    return (
        <div className="min-h-screen pt-20">
            {/* Background Image */}
            <div 
                className="fixed inset-0 -z-50"
                style={{
                    backgroundImage: `url('/background3.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            />
            <div className="fixed inset-0 bg-dark-900/70 -z-40" />
            <SEO title="Our Courses - DSM Outsourcing" description="Explore our expert-led tech courses and start your journey." />
            <Navbar />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
                <Courses />
            </motion.div>
            <Footer />
        </div>
    );
}
