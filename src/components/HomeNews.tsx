import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, Clock, Eye, ChevronLeft, ChevronRight, X, Pin } from 'lucide-react';
import { fetchNews } from '../lib/store';
import { NewsArticle } from '../types';
import { cn } from '../lib/utils';

const CATEGORY_COLORS = {
  match_report: 'bg-emerald-500',
  transfer: 'bg-amber-500',
  announcement: 'bg-blue-500',
  award: 'bg-purple-500',
  general: 'bg-slate-500',
};

const CATEGORY_LABELS = {
  match_report: 'Match Report',
  transfer: 'Transfer',
  announcement: 'Announcement',
  award: 'Award',
  general: 'News',
};

export default function HomeNews() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const articles = await fetchNews(10);
      setNews(articles);
    } catch (e) {
      // Silently fail
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (news.length === 0) return null;

  const featuredArticle = news.find(n => n.featured) || news[0];
  const otherNews = news.filter(n => n.id !== featuredArticle?.id).slice(0, 4);

  const nextSlide = () => setCurrentIndex(i => (i + 1) % Math.max(1, otherNews.length));
  const prevSlide = () => setCurrentIndex(i => (i - 1 + Math.max(1, otherNews.length)) % Math.max(1, otherNews.length));

  return (
    <>
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center">
            <Newspaper size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-dark dark:text-white tracking-tighter">CLUB NEWS</h2>
            <p className="text-xs font-bold text-slate-400 tracking-widest mt-1 uppercase">Latest updates & announcements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article */}
          {featuredArticle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div
                onClick={() => setSelectedArticle(featuredArticle)}
                className="relative h-[400px] rounded-2xl overflow-hidden cursor-pointer group"
              >
                {featuredArticle.image ? (
                  <img src={featuredArticle.image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple to-brand-dark" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={cn('px-3 py-1 rounded-full text-xs font-black text-white uppercase tracking-wider', CATEGORY_COLORS[featuredArticle.category])}>
                    {CATEGORY_LABELS[featuredArticle.category]}
                  </span>
                  {featuredArticle.pinned && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white uppercase tracking-wider flex items-center gap-1">
                      <Pin size={10} /> Pinned
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-white/60 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(featuredArticle.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {featuredArticle.views} views
                    </span>
                    <span>by {featuredArticle.authorName}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other News */}
          <div className="space-y-4">
            {otherNews.slice(0, 3).map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  onClick={() => setSelectedArticle(article)}
                  className="flex gap-4 p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 cursor-pointer hover:border-brand-purple/50 transition-all group"
                >
                  {article.image && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                      <img src={article.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('px-2 py-0.5 rounded text-[10px] font-black text-white uppercase', CATEGORY_COLORS[article.category])}>
                        {CATEGORY_LABELS[article.category]}
                      </span>
                    </div>
                    <h4 className="font-black text-sm text-brand-dark dark:text-white line-clamp-2 group-hover:text-brand-purple transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{formatDate(article.publishedAt)}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {otherNews.length > 3 && (
              <div className="relative">
                <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-brand-dark border border-slate-200 dark:border-white/20 flex items-center justify-center hover:bg-brand-purple hover:text-white transition-all">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-brand-dark border border-slate-200 dark:border-white/20 flex items-center justify-center hover:bg-brand-purple hover:text-white transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-brand-dark rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {selectedArticle.image && (
                <div className="h-64 relative">
                  <img src={selectedArticle.image} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={cn('px-3 py-1 rounded-full text-xs font-black text-white uppercase', CATEGORY_COLORS[selectedArticle.category])}>
                    {CATEGORY_LABELS[selectedArticle.category]}
                  </span>
                  <span className="text-slate-400 text-xs">{formatDate(selectedArticle.publishedAt)}</span>
                </div>
                <h2 className="text-2xl font-black text-brand-dark dark:text-white mb-4">{selectedArticle.title}</h2>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.content}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <span className="text-sm text-slate-500">By {selectedArticle.authorName}</span>
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Eye size={14} /> {selectedArticle.views} views
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
