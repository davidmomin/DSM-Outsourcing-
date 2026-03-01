import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AdmissionForm from '../components/AdmissionForm';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

export default function AdmissionPage() {
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
            <SEO title="Admission - DSM Outsourcing" description="Enroll now in our professional tech courses." />
            <Navbar />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-24">
                <AdmissionForm />
            </motion.div>
            <Footer />
        </div>
    );
}
