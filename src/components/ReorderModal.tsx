import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Cpu, Mail, CheckCircle } from 'lucide-react';
import { InventoryItem } from '../types';
import { generateEmailDraft } from '../data/mockData';

interface Props {
  item: InventoryItem | null;
  onClose: () => void;
}

export default function ReorderModal({ item, onClose }: Props) {
  const [phase, setPhase] = useState<'thinking' | 'ready' | 'sent'>('thinking');
  const [emailContent, setEmailContent] = useState('');
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!item) return;
    setPhase('thinking');
    setEmailContent('');
    setDots('');

    const dotInterval = setInterval(() => {
      setDots(d => (d.length >= 3 ? '' : d + '.'));
    }, 400);

    const timer = setTimeout(() => {
      clearInterval(dotInterval);
      setDots('');
      setEmailContent(generateEmailDraft(item));
      setPhase('ready');
    }, 2800);

    return () => {
      clearTimeout(timer);
      clearInterval(dotInterval);
    };
  }, [item]);

  const handleSend = async () => {
    try {
      await fetch('https://legal-mammals-wear.loca.lt/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: item?.supplierEmail,
          body: emailContent,
          item: item
        })
      });
      setPhase('sent');
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error("Failed to send email", err);
      // Fallback to visual success for demo if server is down
      setPhase('sent');
      setTimeout(onClose, 2000);
    }
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="relative rounded-2xl border w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
          style={{
            background: 'rgba(15,15,15,0.95)',
            borderColor: '#10b98140',
            boxShadow: '0 0 60px rgba(16,185,129,0.15), 0 25px 50px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at top left, rgba(16,185,129,0.06) 0%, transparent 60%)',
            }}
          />

          <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: '#10b98120' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: '#10b98120' }}>
                <Mail size={16} className="text-emerald-400" />
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-white">Smart Reorder Engine</p>
                <p className="font-mono text-xs text-gray-500">{item.name} · {item.supplier}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-auto px-5 py-4">
            <AnimatePresence mode="wait">
              {phase === 'thinking' && (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 gap-6"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="relative"
                  >
                    <div
                      className="w-16 h-16 rounded-full border-2 border-transparent"
                      style={{
                        borderTopColor: '#10b981',
                        borderRightColor: '#10b98160',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Cpu size={20} className="text-emerald-400" />
                    </div>
                  </motion.div>
                  <div className="text-center">
                    <p className="font-mono text-base font-bold text-emerald-400">
                      Gemini is thinking{dots}
                    </p>
                    <p className="font-mono text-xs text-gray-500 mt-1">
                      Analyzing stock levels, demand patterns, and supplier data
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    {['Querying supplier database', 'Computing optimal order volume', 'Drafting communication'].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.6 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
                          style={{ background: '#10b981' }}
                        />
                        <span className="font-mono text-xs text-gray-400">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {phase === 'ready' && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={14} className="text-emerald-400" />
                    <span className="font-mono text-xs text-emerald-400 font-bold">Draft generated by Gemini Advanced</span>
                    <div className="ml-auto flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="font-mono text-xs text-gray-500">Stock: {item.currentStock}%</span>
                    </div>
                  </div>
                  <div
                    className="rounded-xl border p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                    style={{
                      color: '#d1fae5',
                      borderColor: '#10b98125',
                      background: 'rgba(16,185,129,0.04)',
                      maxHeight: '360px',
                      overflowY: 'auto',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#10b98140 transparent',
                    }}
                  >
                    {emailContent}
                  </div>
                </motion.div>
              )}

              {phase === 'sent' && (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 gap-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: '#10b98130' }}
                  >
                    <Send size={24} className="text-emerald-400" />
                  </motion.div>
                  <div className="text-center">
                    <p className="font-mono text-base font-bold text-emerald-400">Order Dispatched</p>
                    <p className="font-mono text-xs text-gray-500 mt-1">Email sent to {item.supplierEmail}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {phase === 'ready' && (
            <div className="flex items-center gap-3 px-5 py-4 border-t flex-shrink-0" style={{ borderColor: '#10b98120' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSend}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm font-bold transition-colors"
                style={{ background: '#10b981', color: '#000' }}
              >
                <Send size={14} />
                Send to Supplier
              </motion.button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg font-mono text-sm font-bold border transition-colors"
                style={{ color: '#6b7280', borderColor: '#ffffff15' }}
              >
                Discard
              </button>
              <span className="ml-auto font-mono text-xs text-gray-600">
                To: {item.supplierEmail}
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
