import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '../lib/theme';
import MatrixBackground from './MatrixBackground';

const BACKGROUNDS = [
    '/Background1.png',
    '/backgound2.png',
    '/background3.png',
    '/background4.png'
];

export default function GlobalBackground() {
    const [bgIndex, setBgIndex] = useState(0);
    const [showMatrix, setShowMatrix] = useState(true);
    const { actualTheme } = useTheme();

    useEffect(() => {
        const calculateBgIndex = () => {
            const fiveMins = 5 * 60 * 1000;
            const block = Math.floor(Date.now() / fiveMins);
            return block % BACKGROUNDS.length;
        };

        setBgIndex(calculateBgIndex());

        const interval = setInterval(() => {
            setBgIndex(calculateBgIndex());
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // Different overlay opacity for light/dark theme
    const overlayOpacity = actualTheme === 'dark' ? '0.6' : '0.75';
    const bgOpacity = actualTheme === 'dark' ? '0.45' : '0.25';
    const matrixOpacity = actualTheme === 'dark' ? 0.08 : 0.05;

    return (
        <>
            {/* Matrix Background Effect */}
            {showMatrix && <MatrixBackground opacity={matrixOpacity} speed={40} />}
            
            {/* Full page background - visible on all sections */}
            <div className="fixed inset-0 -z-50 pointer-events-none">
                {/* Base dark/light overlay */}
                <div 
                    className="absolute inset-0 backdrop-blur-[1px]" 
                    style={{ 
                        backgroundColor: actualTheme === 'dark' 
                            ? 'rgba(10, 10, 10, 0.6)' 
                            : 'rgba(245, 245, 245, 0.75)' 
                    }} 
                />
                
                {/* Animated background image */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={bgIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: parseFloat(bgOpacity) }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url('${BACKGROUNDS[bgIndex]}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundAttachment: 'fixed',
                        }}
                    />
                </AnimatePresence>
                
                {/* Gradient overlays */}
                <div 
                    className="absolute inset-0" 
                    style={{
                        background: actualTheme === 'dark'
                            ? 'linear-gradient(to bottom, rgba(10,10,10,0.4), transparent 30%, transparent 70%, rgba(10,10,10,0.5))'
                            : 'linear-gradient(to bottom, rgba(245,245,245,0.5), transparent 30%, transparent 70%, rgba(245,245,245,0.6))'
                    }}
                />
                
                {/* Subtle gold tint */}
                <div className="absolute inset-0 bg-gold-500/3 mix-blend-overlay" />
            </div>
            
            {/* Top and bottom gradient fades */}
            <div className="fixed inset-0 -z-40 pointer-events-none">
                <div 
                    className="absolute top-0 left-0 right-0 h-32" 
                    style={{
                        background: actualTheme === 'dark'
                            ? 'linear-gradient(to bottom, rgba(10,10,10,0.8), transparent)'
                            : 'linear-gradient(to bottom, rgba(245,245,245,0.9), transparent)'
                    }}
                />
                <div 
                    className="absolute bottom-0 left-0 right-0 h-32" 
                    style={{
                        background: actualTheme === 'dark'
                            ? 'linear-gradient(to top, rgba(10,10,10,0.8), transparent)'
                            : 'linear-gradient(to top, rgba(245,245,245,0.9), transparent)'
                    }}
                />
            </div>
        </>
    );
}
