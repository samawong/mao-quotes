import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quotes, type Quote } from './data/quotes.ts';
import { QuoteCard } from './components/QuoteCard';
import { Star, RefreshCw, BookOpen, X, Download } from 'lucide-react';
// @ts-ignore
import * as htmlToImage from 'html-to-image';

function App() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [shareQuote, setShareQuote] = useState<Quote | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all', label: '全部' },
    { id: 'work', label: '工作' },
    { id: 'study', label: '学习' },
    { id: 'youth', label: '青年' },
    { id: 'philosophy', label: '哲学' },
    { id: 'revolution', label: '革命' },
  ];

  const filteredQuotes = useMemo(() => {
    if (activeCategory === 'all') return quotes;
    return quotes.filter(q => q.category === activeCategory);
  }, [activeCategory]);

  const handleRandomQuote = () => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setRandomQuote(random);
  };

  const handleDownload = async () => {
    if (cardRef.current) {
      const dataUrl = await htmlToImage.toPng(cardRef.current);
      const link = document.createElement('a');
      link.download = `mao-quote-${shareQuote?.id || 'share'}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-paper-bg pb-20">
      {/* Hero Section */}
      <header className="bg-china-red text-revolution-gold py-16 px-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mx-auto w-20 h-20 mb-6 bg-revolution-gold rounded-full flex items-center justify-center shadow-lg border-4 border-white/20">
              <Star className="text-china-red w-12 h-12 fill-current" />
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 tracking-wider">
              毛泽东语录
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light tracking-widest">
              MAO ZEDONG QUOTES
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">

        {/* Controls */}
        <div className="bg-white p-4 rounded-xl shadow-lg mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 gap-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                  ? 'bg-china-red text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRandomQuote}
            className="w-full md:w-auto px-6 py-2 bg-revolution-gold text-china-red font-bold rounded-lg shadow-md hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            随机一条
          </button>
        </div>

        {/* Random Quote Modal */}
        <AnimatePresence>
          {randomQuote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRandomQuote(null)}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg"
              >
                <QuoteCard quote={randomQuote} index={0} onShare={setShareQuote} />
                <div className="text-center mt-4">
                  <button
                    onClick={() => setRandomQuote(null)}
                    className="bg-white/10 text-white hover:bg-white/20 px-4 py-2 rounded-full transition-colors backdrop-blur-md"
                  >
                    关闭 Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Modal */}
        <AnimatePresence>
          {shareQuote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShareQuote(null)}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-transparent max-w-md w-full"
              >
                <div className="flex justify-end mb-2 gap-2">
                  <button
                    onClick={handleDownload}
                    className="text-white/80 hover:text-white p-2 flex items-center gap-1"
                    title="保存图片"
                  >
                    <Download size={24} />
                  </button>
                  <button
                    onClick={() => setShareQuote(null)}
                    className="text-white/80 hover:text-white p-2"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* The Card to Share (Playing Card Style) */}
                <div ref={cardRef} className="bg-transparent p-4 flex justify-center">
                  <div className="bg-[#fcfaf7] w-[320px] h-[480px] rounded-[20px] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-8 border border-gray-200 select-none">

                    {/* Card Border */}
                    <div className="absolute inset-3 border-2 border-china-red/30 rounded-[12px] pointer-events-none"></div>

                    {/* Top-Left Corner Index */}
                    <div className="absolute top-5 left-5 flex flex-col items-center leading-none text-china-red">
                      <span className="font-serif font-bold text-2xl mb-1">M</span>
                      <Star size={16} fill="currentColor" />
                    </div>

                    {/* Bottom-Right Corner Index (Rotated) */}
                    <div className="absolute bottom-5 right-5 flex flex-col items-center leading-none text-china-red transform rotate-180">
                      <span className="font-serif font-bold text-2xl mb-1">M</span>
                      <Star size={16} fill="currentColor" />
                    </div>

                    {/* Center Pattern (Watermark) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                      <Star size={200} fill="black" />
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 text-center w-full flex flex-col h-full justify-center">

                      {/* Avatar/Symbol Placeholder */}
                      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-china-red/5 flex items-center justify-center border border-china-red/10">
                        <span className="font-serif text-3xl text-china-red font-bold">毛语</span>
                      </div>

                      <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 leading-relaxed mb-6 px-2 break-words">
                        “{shareQuote.text}”
                      </h2>

                      <div className="mt-4">
                        <div className="inline-block h-px w-10 bg-china-red/40 mb-2"></div>
                        <p className="text-china-red font-medium text-sm tracking-widest">
                          {shareQuote.source}
                        </p>
                        {shareQuote.year && (
                          <p className="text-gray-400 text-xs font-mono mt-1">{shareQuote.year}</p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                <p className="text-center text-white/50 text-sm mt-6 font-light tracking-wider">
                  - 截图保存分享 -
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='wait'>
            {filteredQuotes.map((quote, index) => (
              <QuoteCard key={quote.id} quote={quote} index={index} onShare={setShareQuote} />
            ))}
          </AnimatePresence>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>暂无相关语录</p>
          </div>
        )}

      </main>

      <footer className="mt-20 text-center text-gray-400 py-8 border-t border-gray-200">
        <p className="flex items-center justify-center gap-2 text-sm">
          <span>好好学习</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>天天向上</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
