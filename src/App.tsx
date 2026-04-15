import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Cpu, ChevronRight, Camera } from 'lucide-react';
import { useDashboardState } from './hooks/useDashboardState';
import VitalSigns from './components/VitalSigns';
import OmniEyeFeed from './components/OmniEyeFeed';
import IncidentStream from './components/IncidentStream';
import InventoryMatrix from './components/InventoryMatrix';
import ReorderModal from './components/ReorderModal';
import SimulationPanel from './components/SimulationPanel';

export default function App() {
  const {
    mode,
    incidents,
    inventory,
    vitals,
    cameraFeeds,
    reorderItem,
    setReorderItem,
    simulateLeak,
    simulateStockOut,
    allClear,
    addIncident,
    setMode,
  } = useDashboardState();

  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScanFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    // Simulate 2s processing
    await new Promise(r => setTimeout(r, 2000));
    setIsScanning(false);

    const name = file.name.toLowerCase();
    
    if (name.includes('wet_floor') || name.includes('spill')) {
      simulateLeak();
    } else if (name.includes('flour') || name.includes('empty')) {
      simulateStockOut();
    } else if (name.includes('glove') || name.includes('chef')) {
      setMode('normal');
      addIncident({
        type: 'compliance',
        message: 'Non-compliance: Cross-contamination risk at Station 1 (No Gloves)',
        location: 'Zone C',
        severity: 'high',
      });
    } else {
      allClear();
    }
  };

  const accentColor = mode === 'leak' ? '#ef4444' : mode === 'stockout' ? '#f59e0b' : '#10b981';
  const now = new Date().toLocaleTimeString('en-US', { hour12: false });

  return (
    <div
      className="min-h-screen w-full flex flex-col overflow-hidden"
      style={{ background: '#0a0a0a', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
    >
      {mode === 'leak' && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-30"
          animate={{ opacity: [0, 0.04, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ background: '#ef4444' }}
        />
      )}

      <header
        className="flex-shrink-0 border-b px-6 py-3"
        style={{
          borderColor: `${accentColor}25`,
          background: 'rgba(10,10,10,0.98)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="p-2 rounded-lg" style={{ background: `${accentColor}20` }}>
              <Eye size={18} style={{ color: accentColor }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-white tracking-tight">SousVision</span>
                <span className="font-mono text-base font-bold tracking-tight" style={{ color: accentColor }}>AI</span>
                <span
                  className="font-mono text-xs px-1.5 py-0.5 rounded border"
                  style={{ color: accentColor, borderColor: `${accentColor}40`, background: `${accentColor}15` }}
                >
                  B2B
                </span>
              </div>
              <p className="font-mono text-xs text-gray-600">Autonomous Kitchen Infrastructure</p>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-800" />

          <AnimatePresence mode="wait">
            {mode !== 'normal' && (
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}40`,
                  background: `${accentColor}15`,
                }}
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  style={{ background: accentColor }}
                />
                {mode === 'leak' ? 'CRITICAL HAZARD ACTIVE' : 'STOCK ALERT ACTIVE'}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1" />

          <VitalSigns vitals={vitals} mode={mode} />

          <div className="w-px h-8 bg-gray-800" />

          <div className="flex items-center gap-2 flex-shrink-0">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleScanFile} 
              className="hidden" 
              accept="image/*" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 mr-4"
              style={{ background: isScanning ? '#4b5563' : '#10b981', color: '#000' }}
            >
              {isScanning ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Cpu size={14} />
                </motion.div>
              ) : (
                <Camera size={14} />
              )}
              {isScanning ? 'ANALYZING...' : 'SCAN FRAME'}
            </button>

            <Cpu size={12} style={{ color: accentColor }} />
            <span className="font-mono text-xs text-gray-500">{now}</span>
            <ChevronRight size={10} className="text-gray-700" />
            <span className="font-mono text-xs" style={{ color: accentColor }}>SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col p-4 gap-4 pb-16">
        <div className="flex gap-4 flex-1 min-h-0" style={{ minHeight: '420px', maxHeight: '520px' }}>
          <div
            className="flex-1 rounded-xl border p-4 overflow-hidden"
            style={{
              borderColor: `${accentColor}20`,
              background: 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <OmniEyeFeed feeds={cameraFeeds} mode={mode} />
          </div>

          <div
            className="w-80 xl:w-96 rounded-xl border p-4 flex flex-col overflow-hidden flex-shrink-0"
            style={{
              borderColor: `${accentColor}20`,
              background: 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <IncidentStream incidents={incidents} />
          </div>
        </div>

        <div
          className="rounded-xl border p-4 flex flex-col overflow-hidden"
          style={{
            borderColor: `${accentColor}20`,
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(12px)',
            maxHeight: '340px',
          }}
        >
          <InventoryMatrix inventory={inventory} onReorder={setReorderItem} />
        </div>
      </main>

      <ReorderModal item={reorderItem} onClose={() => setReorderItem(null)} />

      <SimulationPanel
        mode={mode}
        onSimulateLeak={simulateLeak}
        onSimulateStockOut={simulateStockOut}
        onAllClear={allClear}
      />
    </div>
  );
}
