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
import TimelineReplay from './components/TimelineReplay';

// Example waste mapping
const WASTE_DATABASE = [
  { keywords: ['tomato', 'red', 'vegetable'], ingredient: 'Tomato', quantity: '100g' },
  { keywords: ['onion', 'peel', 'white'], ingredient: 'Onion', quantity: '150g' },
  { keywords: ['lettuce', 'leaf', 'green'], ingredient: 'Lettuce', quantity: '80g' },
];

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
    setVitals,
    timelineEvents,
  } = useDashboardState();

  const [isScanning, setIsScanning] = useState(false);
  const [isWasteScanning, setIsWasteScanning] = useState(false);
  const [isGeneratingEOD, setIsGeneratingEOD] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const wasteInputRef = useRef<HTMLInputElement>(null);

  const showSuccessNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEOD = async () => {
    setIsGeneratingEOD(true);
    try {
      const res = await fetch('https://legal-mammals-wear.loca.lt/api/generate-eod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'sinchanasabha983@gmail.com' }) // Verified Manager Email
      });
      const data = await res.json();
      showSuccessNotification('EOD Report Dispatched to Manager Email');
    } catch (err) {
      console.error(err);
      showSuccessNotification('Failed to generate EOD.');
    } finally {
      setIsGeneratingEOD(false);
    }
  };

  const handleScanWaste = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsWasteScanning(true);
    const imageUrl = URL.createObjectURL(file);

    try {
      const formData = new FormData();
      formData.append('image', file);

      // We mark this as a waste scan in some way or let the AI decide
      const res = await fetch('https://legal-mammals-wear.loca.lt/api/scan', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      addIncident({
        type: 'waste',
        message: data.detection,
        location: data.zone || 'Prep Station',
        severity: 'medium',
        ingredient: data.category === 'Waste' ? data.detection.split(' ')[0] : 'Vegetables', // dynamic-ish
        quantity: '150g',
        relatedImage: imageUrl,
      });
      
      setVitals(prev => ({
        ...prev,
        dailyWasteSaved: prev.dailyWasteSaved + 0.5,
      }));

      showSuccessNotification("Waste detected and logged successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsWasteScanning(false);
    }
  };

  const handleScanFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const imageUrl = URL.createObjectURL(file);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('https://legal-mammals-wear.loca.lt/api/scan', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.status === 'Critical') {
        setMode('leak');
      } else if (data.status === 'Warning') {
        setMode('stockout');
      }

      addIncident({
        type: data.category.toLowerCase() === 'safety' ? 'hazard' : 
              data.category.toLowerCase() === 'logistics' ? 'logistics' : 'compliance',
        message: data.detection,
        location: data.zone,
        severity: data.status.toLowerCase() === 'critical' ? 'critical' : 
                 data.status.toLowerCase() === 'warning' ? 'high' : 'medium',
        relatedImage: imageUrl
      });

      if (data.inventory_update) {
        // Simple mock inventory update loop
      }

      showSuccessNotification(data.badge_text || "Audit Complete");
    } catch (err) {
      console.error(err);
      allClear(); // reset on error
    } finally {
      setIsScanning(false);
    }
  };

  const accentColor = mode === 'leak' ? '#ef4444' : mode === 'stockout' ? '#f59e0b' : '#10b981';
  const now = new Date().toLocaleTimeString('en-US', { hour12: false });

  return (
    <div
      className="min-h-screen w-full flex flex-col overflow-hidden"
      style={{ background: '#0a0a0a', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
    >
      {notification && (
        <motion.div
           initial={{ opacity: 0, y: -20, x: '-50%' }}
           animate={{ opacity: 1, y: 0, x: '-50%' }}
           exit={{ opacity: 0, y: -20, x: '-50%' }}
           className="fixed top-20 left-1/2 z-50 px-6 py-3 rounded-xl border font-mono text-sm shadow-xl font-bold flex items-center gap-2"
           style={{ background: '#8b5cf610', borderColor: '#8b5cf650', color: '#8b5cf6', backdropFilter: 'blur(12px)' }}
        >
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          {notification}
        </motion.div>
      )}

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
            {/* EOD SUMMARY BUTTON */}
            <button
              onClick={handleEOD}
              disabled={isGeneratingEOD}
              className="px-3 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 mr-2"
            >
              {isGeneratingEOD ? 'DISPATCHING...' : 'EOD SUMMARY'}
            </button>

            {/* TIMELINE REPLAY BUTTON */}
            <button
              onClick={() => setShowTimeline(true)}
              className="px-3 py-1.5 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 font-mono text-xs font-bold transition-all flex items-center gap-2 mr-2"
            >
              TIMELINE REPLAY
            </button>

            {/* WASTE DETECT BUTTON */}
            <input 
              type="file" 
              ref={wasteInputRef} 
              onChange={handleScanWaste} 
              className="hidden" 
              accept="image/*" 
            />
            <button
              onClick={() => wasteInputRef.current?.click()}
              disabled={isWasteScanning}
              className="px-3 py-1.5 rounded text-white font-mono text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 mr-2"
              style={{ background: isWasteScanning ? '#4b5563' : '#8b5cf6', color: '#fff' }}
            >
              {isWasteScanning ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Cpu size={14} />
                </motion.div>
              ) : (
                <Camera size={14} />
              )}
              {isWasteScanning ? 'SCANNING...' : 'SCAN WASTE IMAGE'}
            </button>

            {/* NOMINAL SCAN FRAME BUTTON */}
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
              className="px-3 py-1.5 rounded hover:opacity-80 text-white font-mono text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 mr-4 shadow-lg"
              style={{ background: isScanning ? '#4b5563' : accentColor, color: '#000' }}
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

      {showTimeline && (
        <TimelineReplay 
          events={timelineEvents} 
          onClose={() => setShowTimeline(false)} 
        />
      )}

      <SimulationPanel
        mode={mode}
        onSimulateLeak={simulateLeak}
        onSimulateStockOut={simulateStockOut}
        onAllClear={allClear}
      />
    </div>
  );
}
