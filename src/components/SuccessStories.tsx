import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QuoteIconIcon, Loader2IconIcon } from './icons';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export default function SuccessStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      try {
        const data = await api.getSuccessStories();
        setStories(data);
      } catch (err: any) {
        console.error('Failed to load stories:', err);
        toast.error(err.message || 'Failed to load success stories');
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2Icon className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (stories.length === 0) return null;

  return (
    <section id="stories" className="py-24 relative">
      {/* Subtle overlay for better readability */}
      <div className="absolute inset-0 bg-dark-900/40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title mb-4">
            <span className="gold-text">Success</span> Stories
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Real graduates, real careers. See how our students transformed their futures.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {stories.map((story, i) => (
            <motion.div
              key={story.id || story.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card-hover p-6 md:p-8"
            >
              <QuoteIcon className="w-8 h-8 text-gold-500/30 mb-4" />
              <p className="text-gray-300 mb-6 leading-relaxed">{story.story}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center text-2xl border border-gold-500/20">
                  {story.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{story.name}</h4>
                  <p className="text-sm text-gold-500/70">{story.course}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
