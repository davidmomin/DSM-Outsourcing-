import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
    { id: 'interest', label: "What is your main goal?", options: ["Earn Money Online", "Building Websites", "Working with Data", "Graphic Design"] },
    { id: 'time', label: "How much time can you commit?", options: ["Quick (3 Months)", "Deep Dive (6 Months)"] },
    { id: 'level', label: "Your current experience?", options: ["Beginner", "Intermediate"] }
];

export default function AIRecommender() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [recommendation, setRecommendation] = useState<string | null>(null);

    const handleNext = (option: string) => {
        const newAnswers = { ...answers, [questions[step].id]: option };
        setAnswers(newAnswers);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            generateRecommendation(newAnswers);
        }
    };

    const generateRecommendation = (ans: any) => {
        // Basic AI logic simulation
        if (ans.interest === "Earn Money Online") setRecommendation("Professional Freelancing & Outsourcing");
        else if (ans.interest === "Building Websites") setRecommendation("Full-Stack Web Development");
        else if (ans.interest === "Graphic Design") setRecommendation("Graphic & UI/UX Design");
        else setRecommendation("Advanced Office Application & AI Mastery");
    };

    return (
        <div className="glass-gold p-8 rounded-3xl max-w-xl mx-auto text-center border-gold-base/20 border">
            <div className="flex items-center justify-center gap-2 mb-6 text-gold-base">
                <Sparkles size={24} />
                <h2 className="text-2xl font-bold">AI Course Recommender</h2>
            </div>

            <AnimatePresence mode="wait">
                {!recommendation ? (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <p className="text-xl mb-6 font-medium">{questions[step].label}</p>
                        <div className="grid grid-cols-1 gap-3">
                            {questions[step].options.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleNext(opt)}
                                    className="p-4 rounded-xl border border-white/10 hover:border-gold-base/50 hover:bg-gold-base/5 transition-all text-left"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-4"
                    >
                        <p className="text-gray-400 mb-2">Our AI recommends:</p>
                        <h3 className="text-3xl font-bold text-gold-gradient mb-6">{recommendation}</h3>
                        <button
                            onClick={() => window.location.hash = '#admission'}
                            className="btn-luxury flex items-center gap-2 mx-auto"
                        >
                            Enroll Now <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => { setStep(0); setRecommendation(null); setAnswers({}); }}
                            className="mt-6 text-sm text-gray-500 hover:text-white"
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
