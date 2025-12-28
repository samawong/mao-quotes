import React from 'react';
import { motion } from 'framer-motion';
import type { Quote } from '../data/quotes.ts';
import { Quote as QuoteIcon, Copy, Check, Share2 } from 'lucide-react';

interface QuoteCardProps {
    quote: Quote;
    index: number;
    onShare?: (quote: Quote) => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, index, onShare }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${quote.text} —— ${quote.source}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative bg-white p-8 rounded-xl shadow-lg border-2 border-transparent hover:border-china-red/20 transition-all duration-300 group flex flex-col justify-between h-full"
        >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                    onClick={() => onShare && onShare(quote)}
                    className="p-2 text-gray-400 hover:text-china-red transition-colors"
                    title="分享语录"
                >
                    <Share2 size={20} />
                </button>
                <button
                    onClick={handleCopy}
                    className="p-2 text-gray-400 hover:text-china-red transition-colors"
                    title="复制语录"
                >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
            </div>

            <QuoteIcon className="text-china-red/20 absolute top-6 left-6 w-12 h-12 -z-0" />

            <div className="relative z-10 pt-4 flex-grow">
                <h3 className="text-2xl font-serif text-gray-900 font-bold mb-6 leading-relaxed">
                    {quote.text}
                </h3>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between border-t border-gray-100 pt-4 mt-4">
                <span className="text-china-red font-medium text-sm md:text-base">
                    {quote.source}
                </span>
                {quote.year && (
                    <span className="text-gray-400 text-sm mt-1 md:mt-0 font-mono">
                        {quote.year}
                    </span>
                )}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-china-red to-revolution-gold opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl" />
        </motion.div>
    );
};
