import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  PhoneIcon, 
  BookOpenIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  WalletIcon, 
  Loader2Icon, 
  ChevronRightIcon, 
  ShieldCheckIcon, 
  MailIcon, 
  CalendarIcon, 
  CreditCardIcon,
  GraduationCapIcon,
  LogOutIcon,
  XIcon
} from '../components/icons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

// Session storage keys
const STUDENT_CREDENTIALS_KEY = 'dsm_student_credentials';
const STUDENT_DATA_KEY = 'dsm_student_data';

export default function UserDashboard() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [studentData, setStudentData] = useState<any>(null);
    const [initialLoading, setInitialLoading] = useState(true);

    // Auto-login with stored credentials
    const handleAutoLogin = async (phone: string, txnId: string) => {
        setLoading(true);
        try {
            const response = await api.studentLogin(phone, txnId);
            if (response.success && response.student) {
                setStudentData(response.student);
                // Update stored student data
                sessionStorage.setItem(STUDENT_DATA_KEY, JSON.stringify(response.student));
            } else {
                // Invalid credentials, clear storage
                sessionStorage.removeItem(STUDENT_CREDENTIALS_KEY);
                sessionStorage.removeItem(STUDENT_DATA_KEY);
            }
        } catch (err) {
            // Connection error or other issues, clear storage
            sessionStorage.removeItem(STUDENT_CREDENTIALS_KEY);
            sessionStorage.removeItem(STUDENT_DATA_KEY);
        } finally {
            setLoading(false);
        }
    };

    // Check sessionStorage on mount for auto-login
    useEffect(() => {
        const checkStoredSession = () => {
            try {
                // First try to restore from stored student data
                const storedStudentData = sessionStorage.getItem(STUDENT_DATA_KEY);
                if (storedStudentData) {
                    const parsedData = JSON.parse(storedStudentData);
                    setStudentData(parsedData);
                    setInitialLoading(false);
                    return;
                }

                // If no student data, check for stored credentials to auto-login
                const storedCredentials = sessionStorage.getItem(STUDENT_CREDENTIALS_KEY);
                if (storedCredentials) {
                    const { phone, txnId } = JSON.parse(storedCredentials);
                    if (phone && txnId) {
                        // Auto-login with stored credentials
                        handleAutoLogin(phone, txnId);
                        return;
                    }
                }
            } catch (err) {
                console.error('Error checking stored session:', err);
                // Clear corrupted data
                sessionStorage.removeItem(STUDENT_CREDENTIALS_KEY);
                sessionStorage.removeItem(STUDENT_DATA_KEY);
            }
            setInitialLoading(false);
        };

        checkStoredSession();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.studentLogin(phoneNumber, transactionId);
            if (response.success && response.student) {
                setStudentData(response.student);
                
                // Store credentials in sessionStorage for auto-login
                sessionStorage.setItem(STUDENT_CREDENTIALS_KEY, JSON.stringify({
                    phone: phoneNumber,
                    txnId: transactionId
                }));
                
                // Store student data in sessionStorage for immediate display
                sessionStorage.setItem(STUDENT_DATA_KEY, JSON.stringify(response.student));
                
                toast.success(`Welcome back, ${response.student.student_name}!`);
            } else {
                toast.error(response.error || 'Invalid phone number or transaction ID');
            }
        } catch (err: any) {
            toast.error(err.message || 'Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle logout - clear session and reset state
    const handleLogout = () => {
        sessionStorage.removeItem(STUDENT_CREDENTIALS_KEY);
        sessionStorage.removeItem(STUDENT_DATA_KEY);
        setStudentData(null);
        setPhoneNumber('');
        setTransactionId('');
        toast.success('Logged out successfully');
    };

    return (
        <div className="min-h-screen pb-12 flex flex-col pt-32 relative overflow-hidden">
            {/* Animated Background - Replacing Image */}
            <div className="absolute inset-0 -z-50">
                {/* Base Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
                
                {/* Animated Orbs */}
                <motion.div 
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px]"
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
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-600/5 rounded-full blur-[100px]"
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
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `
                        linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px'
                }} />
            </div>
            
            <div className="fixed inset-0 bg-dark-900/70 -z-40" />
            <SEO title="Student Dashboard - DSM Outsourcing" description="View your admission status and course details." />
            <Navbar />

            <main className="flex-1 max-w-md w-full mx-auto px-4 relative z-10 flex flex-col items-center justify-center py-12">
                {initialLoading ? (
                    <div className="flex items-center justify-center">
                        <Loader2Icon className="w-8 h-8 text-gold-500" />
                    </div>
                ) : !studentData ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full glass-card p-10 border-gold-500/20 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/[0.03] to-transparent pointer-events-none" />
                        
                        <div className="text-center mb-10 relative z-10">
                            <motion.div 
                                className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-gold"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <GraduationCapIcon className="w-8 h-8 text-dark-900" />
                            </motion.div>
                            <h2 className="text-4xl font-display font-bold text-white mb-3 tracking-tight">Student Portal</h2>
                            <p className="text-gray-400 text-sm font-light">Enter your admission details to view your status</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-8 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] block ml-1 font-semibold">PHONE NUMBER</label>
                                <div className="flex items-center group">
                                    <div className="flex items-center justify-center w-12 h-14 bg-dark-900/40 border border-gold-500/10 rounded-l-lg">
                                        <PhoneIcon className="w-5 h-5 text-gray-400 group-focus-within:text-gold-400 transition-colors" />
                                    </div>
                                    <input
                                        type="tel"
                                        className="input-field flex-1 h-14 bg-dark-900/40 border-gold-500/10 focus:border-gold-500/40 transition-all rounded-l-none"
                                        placeholder="017XXXXXXXX"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] block ml-1 font-semibold">TRANSACTION ID</label>
                                <div className="flex items-center group">
                                    <div className="flex items-center justify-center w-12 h-14 bg-dark-900/40 border border-gold-500/10 rounded-l-lg">
                                        <WalletIcon className="w-5 h-5 text-gray-400 group-focus-within:text-gold-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        className="input-field flex-1 h-14 bg-dark-900/40 border-gold-500/10 focus:border-gold-500/40 transition-all rounded-l-none"
                                        placeholder="bKash / Nagad Txn ID"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                className="gold-btn w-full h-14 text-base tracking-wide font-bold shadow-lg hover:shadow-gold/20 disabled:opacity-50"
                            >
                                {loading ? <Loader2Icon className="w-6 h-6" /> : (
                                    <div className="flex items-center justify-center gap-2">
                                        Access Dashboard <ChevronRightIcon className="w-5 h-5" />
                                    </div>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full glass-card border-gold-500/30 overflow-hidden"
                    >
                        {/* Header Area */}
                        <div className="bg-gradient-to-r from-gold-500/10 via-dark-800/50 to-transparent p-8 md:p-10 border-b border-gold-500/10">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <motion.div 
                                    className="w-28 h-28 bg-gradient-to-br from-gold-500/20 to-dark-800 rounded-2xl border border-gold-500/30 flex items-center justify-center flex-shrink-0 shadow-gold"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <UserIcon className="w-14 h-14 text-gold-400" />
                                </motion.div>
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">{studentData.student_name}</h2>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                        <span className="flex items-center gap-2 text-gold-400 bg-gold-500/10 px-4 py-1.5 rounded-full text-sm border border-gold-500/20">
                                            <ShieldCheckIcon className="w-4 h-4" /> Enrolled Student
                                        </span>
                                        {studentData.email && (
                                            <span className="flex items-center gap-2 text-gray-400 bg-dark-900/50 px-4 py-1.5 rounded-full text-sm border border-gray-700">
                                                <MailIcon className="w-4 h-4" /> {studentData.email}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <motion.button
                                    onClick={handleLogout}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="gold-btn-outline text-sm px-6 py-2 flex items-center gap-2"
                                >
                                    <LogOutIcon className="w-4 h-4" /> Log Out
                                </motion.button>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="p-8 md:p-10">
                            <div className="grid md:grid-cols-2 gap-6">
                                
                                {/* Course Information */}
                                <motion.div 
                                    className="bg-dark-900/40 rounded-2xl p-6 border border-gold-500/10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center">
                                            <BookOpenIcon className="w-5 h-5 text-gold-400" />
                                        </div>
                                        <h3 className="text-sm text-gray-400 uppercase tracking-wider">Registered Course</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-white mb-4">{studentData.course_name}</p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <CalendarIcon className="w-4 h-4 text-gold-500/50 shrink-0" />
                                            <span className="text-sm">Registered on: {new Date(studentData.reg_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <CheckCircleIcon className="w-4 h-4 text-green-500 shrink-0" />
                                            <span className={`text-sm ${studentData.payment_status === 'Paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                Payment Status: {studentData.payment_status}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Contact Information */}
                                <motion.div 
                                    className="bg-dark-900/40 rounded-2xl p-6 border border-gold-500/10"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center">
                                            <PhoneIcon className="w-5 h-5 text-gold-400" />
                                        </div>
                                        <h3 className="text-sm text-gray-400 uppercase tracking-wider">Contact Details</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <PhoneIcon className="w-4 h-4 text-gold-500/50 shrink-0" />
                                            <span className="text-sm">{studentData.phone_number}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <CreditCardIcon className="w-4 h-4 text-gold-500/50 shrink-0" />
                                            <span className="text-sm font-mono">{studentData.transaction_id}</span>
                                        </div>
                                        {studentData.notes && (
                                            <div className="mt-4 p-3 bg-dark-800/50 rounded-lg">
                                                <p className="text-xs text-gray-500 uppercase mb-1">Notes</p>
                                                <p className="text-sm text-gray-300">{studentData.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Support Section */}
                            <motion.div 
                                className="mt-6 p-6 bg-gradient-to-r from-gold-500/5 to-transparent rounded-2xl border border-gold-500/10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center shrink-0">
                                        <ClockIcon className="w-5 h-5 text-gold-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Need Help?</h4>
                                        <p className="text-gray-400 text-sm">
                                            If you have any questions about your admission or course, please contact us at{' '}
                                            <a href="tel:+8801774471120" className="text-gold-400 hover:underline">+880 17744 71120</a>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </main>
            <Footer />
        </div>
    );
}
