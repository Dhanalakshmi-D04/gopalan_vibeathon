import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, Image as ImageIcon } from 'lucide-react';
import { Incident } from '../types';

interface Props {
  events: Incident[];
  onClose: () => void;
}

const TYPE_COLORS: Record<string, { color: string; bg: string }> = {
  hazard:     { color: '#ef4444', bg: '#ef444420' },
  logistics:  { color: '#f59e0b', bg: '#f59e0b20' },
  compliance: { color: '#10b981', bg: '#10b98120' },
  waste:      { color: '#8b5cf6', bg: '#8b5cf620' },
};

export default function TimelineReplay({ events, onClose }: Props) {
  const sorted = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const [idx, setIdx] = useState(sorted.length > 0 ? sorted.length - 1 : 0);

  if (sorted.length === 0) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        >
          <div className="font-mono text-gray-400 text-sm text-center">
            <History size={40} className="mx-auto mb-4 opacity-30" />
            <p>No timeline events yet.</p>
            <p className="text-xs mt-2 text-gray-600">Trigger a simulation or scan waste to generate events.</p>
            <button onClick={onClose} className="mt-6 px-4 py-2 rounded border border-white/10 text-gray-400 text-xs">Close</button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const ev = sorted[idx];
  const tc = TYPE_COLORS[ev.type] ?? { color: '#9ca3af', bg: '#9ca3af20' };
  const total = sorted.length;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative rounded-2xl border w-full max-w-4xl overflow-hidden flex flex-col"
          style={{
            background: 'rgba(12,12,12,0.97)',
            borderColor: '#3b82f640',
            boxShadow: '0 0 60px rgba(59,130,246,0.12), 0 25px 50px rgba(0,0,0,0.8)',
            maxHeight: '90vh',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: '#3b82f620' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: '#3b82f620' }}>
                <History size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-white uppercase tracking-wider">Kitchen Timeline Replay</p>
                <p className="font-mono text-xs text-gray-500">Inspector Mode — {total} events recorded</p>
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

          {/* Body */}
          <div className="flex flex-1 overflow-hidden" style={{ minHeight: '360px', maxHeight: '460px' }}>
            {/* Left: Event detail */}
            <div className="flex-1 p-6 flex flex-col gap-4 border-r overflow-auto" style={{ borderColor: '#3b82f615', scrollbarWidth: 'thin' }}>
              <div>
                <span className="font-mono text-xs uppercase text-blue-400 tracking-widest">Selected Time</span>
                <h3 className="font-mono text-2xl font-bold text-white mt-1">
                  {ev.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </h3>
                <p className="font-mono text-xs text-gray-600 mt-0.5">
                  {ev.timestamp.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
              </div>

              <div className="rounded-xl border p-4" style={{ borderColor: tc.color + '30', background: tc.bg }}>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="font-mono text-xs font-bold px-2 py-0.5 rounded uppercase"
                    style={{ background: tc.bg, color: tc.color, border: '1px solid ' + tc.color + '40' }}
                  >
                    {ev.type}
                  </span>
                  <span className="font-mono text-xs" style={{ color: tc.color }}>
                    {ev.severity.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs text-gray-500 ml-auto">{ev.location}</span>
                </div>

                <p className="font-mono text-sm text-gray-200 leading-relaxed">{ev.message}</p>

                {ev.type === 'waste' && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3 rounded-lg border" style={{ borderColor: '#8b5cf630', background: '#8b5cf610' }}>
                      <p className="font-mono text-xs uppercase text-purple-400 mb-1">Ingredient</p>
                      <p className="font-mono text-base font-bold text-white">{ev.ingredient ?? 'Unknown'}</p>
                    </div>
                    <div className="p-3 rounded-lg border" style={{ borderColor: '#8b5cf630', background: '#8b5cf610' }}>
                      <p className="font-mono text-xs uppercase text-purple-400 mb-1">Est. Quantity</p>
                      <p className="font-mono text-base font-bold text-white">{ev.quantity ?? '—'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Event index position */}
              <p className="font-mono text-xs text-gray-600">
                Event {idx + 1} of {total}
              </p>
            </div>

            {/* Right: Image Evidence */}
            <div className="w-80 flex-shrink-0 bg-black/60 flex flex-col items-center justify-center relative p-4 gap-3">
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 bg-black/50">
                <ImageIcon size={11} className="text-gray-500" />
                <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">Optical Evidence</span>
              </div>

              {ev.relatedImage ? (
                <img
                  src={ev.relatedImage}
                  alt="Event evidence"
                  className="max-h-60 max-w-full object-contain rounded-lg border"
                  style={{ borderColor: tc.color + '30' }}
                />
              ) : (
                <div className="text-center">
                  <ImageIcon size={36} className="text-gray-700 mx-auto mb-3" />
                  <p className="font-mono text-xs text-gray-600 uppercase tracking-wide">No Image Attached</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="border-t px-6 py-5 flex flex-col gap-3 bg-black/40 flex-shrink-0" style={{ borderColor: '#3b82f620' }}>
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-gray-500">
                {sorted[0].timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="font-mono text-xs font-bold text-blue-400 uppercase tracking-widest">
                Timeline Scrubber
              </span>
              <span className="font-mono text-xs text-gray-500">
                {sorted[total - 1].timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={total - 1}
              value={idx}
              onChange={e => setIdx(Number(e.target.value))}
              className="w-full h-2 rounded-full outline-none"
              style={{ accentColor: '#3b82f6', cursor: 'ew-resize', background: '#1f2937' }}
            />

            {/* Tick marks */}
            <div className="relative h-3 w-full">
              {sorted.map((event, i) => {
                const pct = total > 1 ? (i / (total - 1)) * 96 + 2 : 50;
                const isSelected = i === idx;
                return (
                  <span
                    key={event.id}
                    className="absolute font-mono"
                    style={{
                      left: pct + '%',
                      fontSize: '9px',
                      transform: 'translateX(-50%)',
                      color: isSelected ? '#3b82f6' : '#374151',
                      opacity: isSelected ? 1 : 0.6,
                      fontWeight: isSelected ? 'bold' : 'normal',
                    }}
                  >
                    |
                  </span>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
