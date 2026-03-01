import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import SuccessStories from '../components/SuccessStories';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function StoriesPage() {
    return (
        <div className="min-h-screen pt-20">
            {/* Background Image */}
            <div 
                className="fixed inset-0 -z-50"
                style={{
                    backgroundImage: `url('/background2.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            />
            <div className="fixed inset-0 bg-dark-900/70 -z-40" />
            <SEO title="Success Stories - DSM Outsourcing" description="Read about the successful journeys of our alumni." />
            <Navbar />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
                <SuccessStories />
            </motion.div>
            <Footer />
        </div>
    );
}
