import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Package, CheckCircle, ChevronUp, ChevronDown, Terminal } from 'lucide-react';
import { DashboardMode } from '../types';

interface Props {
  mode: DashboardMode;
  onSimulateLeak: () => void;
  onSimulateStockOut: () => void;
  onAllClear: () => void;
}

export default function SimulationPanel({ mode, onSimulateLeak, onSimulateStockOut, onAllClear }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="flex justify-center pb-0">
        <motion.div
          initial={false}
          className="w-full max-w-5xl mx-6"
        >
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2 mx-auto px-4 py-1.5 rounded-t-lg border-t border-l border-r font-mono text-xs font-bold transition-colors"
            style={{
              background: 'rgba(10,10,10,0.95)',
              borderColor: '#10b98140',
              color: '#10b981',
            }}
          >
            <Terminal size={12} />
            Simulation Control Panel
            {open ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  className="border-t border-l border-r px-6 py-4 flex items-center gap-4 flex-wrap"
                  style={{
                    background: 'rgba(10,10,10,0.97)',
                    borderColor: '#10b98140',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="flex items-center gap-2 mr-4">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: mode === 'normal' ? '#10b981' : mode === 'leak' ? '#ef4444' : '#f59e0b' }}
                    />
                    <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                      Mode: <span style={{ color: mode === 'normal' ? '#10b981' : mode === 'leak' ? '#ef4444' : '#f59e0b' }}>
                        {mode === 'normal' ? 'Nominal' : mode === 'leak' ? 'Hazard Active' : 'Stock Alert'}
                      </span>
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onSimulateLeak}
                    disabled={mode === 'leak'}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      color: '#ef4444',
                      borderColor: '#ef444440',
                      background: '#ef444415',
                    }}
                  >
                    <Droplets size={13} />
                    Simulate Leak
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onSimulateStockOut}
                    disabled={mode === 'stockout'}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      color: '#f59e0b',
                      borderColor: '#f59e0b40',
                      background: '#f59e0b15',
                    }}
                  >
                    <Package size={13} />
                    Simulate Stock Out
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onAllClear}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-xs font-bold transition-all"
                    style={{
                      color: '#10b981',
                      borderColor: '#10b98140',
                      background: '#10b98115',
                    }}
                  >
                    <CheckCircle size={13} />
                    All Clear
                  </motion.button>

                  <div className="ml-auto font-mono text-xs text-gray-600">
                    SousVision AI · Simulation Mode · v3.2.1
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
