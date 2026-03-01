import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClockIcon, ChevronRightIcon, XIcon, CheckCircleIcon, Loader2Icon, BookOpenIcon } from './icons';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import type { Course } from '../types';

function CourseModal({ course, onClose }: { course: Course; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="glass-card p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto mx-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6 gap-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start w-full">
            {/* Course Icon */}
            <div className="flex-shrink-0">
              {course.icon && course.icon.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) ? (
                <img 
                  src={course.icon} 
                  alt={course.name} 
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-gold-500/20 to-gold-600/10 rounded-xl flex items-center justify-center text-4xl sm:text-5xl md:text-6xl border border-gold-500/20">
                  {course.icon || '📚'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-display font-bold gold-text leading-tight">{course.name}</h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                <span className="flex items-center gap-1 text-gold-400 text-sm">
                  <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {course.duration}
                </span>
                <span className="text-gold-300 font-semibold text-base sm:text-lg">{course.fee}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gold-400 transition-colors p-2 hover:bg-gold-500/10 rounded-lg self-end sm:self-start">
            <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Full Description */}
        <div className="mb-4 sm:mb-6">
          <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">About This Course</h4>
          <p className="text-gray-400 leading-relaxed text-xs sm:text-sm">{course.description}</p>
        </div>

        {/* AI Insight */}
        {course.ai_insight && (
          <motion.div 
            className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-gold-500/10 to-transparent border border-gold-500/20 rounded-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-gold-400 font-semibold mb-2 text-xs sm:text-sm flex items-center gap-2">
              <span className="text-base sm:text-lg">✨</span> AI Career Insight
            </h4>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{course.ai_insight}</p>
          </motion.div>
        )}

        {/* Course Modules */}
        <div className="mb-4 sm:mb-6">
          <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Course Modules</h4>
          <div className="grid gap-1.5 sm:gap-2">
            {course.modules?.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 sm:gap-3 text-gray-400 bg-dark-400/30 p-2.5 sm:p-3 rounded-lg border border-gold-500/5 hover:border-gold-500/20 transition-colors"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-500 text-xs font-bold shrink-0">
                  {i + 1}
                </div>
                <span className="text-xs sm:text-sm">{mod}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <a
          href="#admission"
          onClick={onClose}
          className="gold-btn w-full mt-2 sm:mt-4 inline-flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          Enroll in this Course
          <ChevronRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>
      </motion.div>
    </motion.div>
  );
}

export default function Courses() {
  const [selected, setSelected] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.getCourses();
        setCourses(data);
      } catch (err: any) {
        console.error('Failed to load courses:', err);
        toast.error(err.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="py-16 sm:py-24 flex items-center justify-center">
        <Loader2Icon className="w-6 h-6 sm:w-8 sm:h-8 text-gold-500" />
      </div>
    );
  }

  return (
    <section id="courses" className="py-16 sm:py-24 relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/3 right-0 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gold-500/5 rounded-full blur-[60px] sm:blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6"
          >
            <span className="text-gold-400 text-xs sm:text-sm font-medium">🎯 Professional Training</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4">
            Our <span className="gold-text">Professional Courses</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto px-4 sm:px-0">
            Industry-aligned programs designed to launch your career in the digital world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course, i) => (
            <motion.div
              key={course.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              onClick={() => setSelected(course)}
              className="glass-card-hover p-4 sm:p-6 cursor-pointer group"
            >
              {/* Course Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center text-2xl sm:text-3xl mb-3 sm:mb-4 border border-gold-500/20 group-hover:border-gold-500/40 transition-colors">
                {course.icon || '📚'}
              </div>

              <h3 className="text-base sm:text-lg md:text-xl font-display font-bold text-white mb-1.5 sm:mb-2 group-hover:text-gold-300 transition-colors line-clamp-1">
                {course.name}
              </h3>

              <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                <span className="flex items-center gap-1 text-gold-400">
                  <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {course.duration}
                </span>
                <span className="text-gold-300 font-semibold">{course.fee}</span>
              </div>

              {/* Hover Reveal */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-gold-400 text-xs sm:text-sm flex items-center gap-1">
                  View Details <ChevronRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {courses.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16 px-4"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gold-500/10 flex items-center justify-center">
              <BookOpenIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gold-400" />
            </div>
            <p className="text-gray-400 text-sm sm:text-base">No courses available at the moment.</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">Check back soon for new offerings!</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && <CourseModal course={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
