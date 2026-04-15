import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Package, ShieldCheck, Activity,
  Zap, Mail, Loader2, CheckCircle2, TrendingUp, TrendingDown,
  Camera, Eye, Cpu, BellRing, Settings, Battery
} from 'lucide-react';

export default function App() {
  const [globalStatus, setGlobalStatus] = useState('Optimized'); // Optimized, Critical, Warning
  const [incidents, setIncidents] = useState([
    { id: 101, type: 'Compliance', desc: 'Routine Hygiene Check Passed.', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', time: '10:42 AM' }
  ]);
  const [inventory, setInventory] = useState([
    { id: 1, item: 'High-Gluten Flour', type: 'Dry Goods', level: 88, status: 'Optimized', action: 'N/A' },
    { id: 2, item: 'Canola Oil (Bulk)', type: 'Liquids', level: 45, status: 'Drafting Order', action: 'Pending' },
    { id: 3, item: 'Sea Salt', type: 'Spices', level: 92, status: 'Optimized', action: 'N/A' },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Stats
  const vStats = {
    risks: globalStatus === 'Critical' ? 1 : 0,
    health: globalStatus === 'Warning' ? 82 : (globalStatus === 'Critical' ? 74 : 98),
    waste: '42.5 kg',
    efficiency: globalStatus === 'Optimized' ? '99.2%' : '88.4%'
  };

  const getAccentColor = () => {
    if(globalStatus === 'Critical') return 'red';
    if(globalStatus === 'Warning') return 'amber';
    return 'green';
  };

  const runSimulation = (type) => {
    if (type === 'leak') {
      setGlobalStatus('Critical');
      setIncidents(prev => [{ 
        id: Date.now(), type: 'Hazard', desc: 'Liquid Spill detected in Zone B', 
        icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', time: new Date().toLocaleTimeString() 
      }, ...prev]);
    } else if (type === 'stock') {
      setGlobalStatus('Warning');
      setInventory(prev => prev.map(inv => inv.id === 1 ? { ...inv, level: 5, status: 'Expedite Required', action: 'Reorder' } : inv));
      setIncidents(prev => [{ 
        id: Date.now(), type: 'Logistics', desc: 'Stock Level: Flour at 5%', 
        icon: Package, color: 'text-amber-500', bg: 'bg-amber-500/10', time: new Date().toLocaleTimeString() 
      }, ...prev]);
    } else if (type === 'clear') {
      setGlobalStatus('Optimized');
      setInventory(prev => prev.map(inv => inv.id === 1 ? { ...inv, level: 88, status: 'Optimized', action: 'N/A' } : inv));
      setIncidents(prev => [{ 
        id: Date.now(), type: 'System', desc: 'All zones cleared by operator.', 
        icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', time: new Date().toLocaleTimeString() 
      }, ...prev]);
    }
  };

  const handleReorder = (item) => {
    setModalData(item);
    setIsModalOpen(true);
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-300 font-sans flex flex-col h-screen overflow-hidden">
      
      {/* Top Bar: Vital Signs */}
      <header className="h-16 border-b border-white/10 glass-panel flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Cpu className="text-emerald-500 w-6 h-6" />
          <h1 className="text-lg font-bold tracking-widest uppercase text-white">SousVision<span className="text-emerald-500 font-mono ml-1">OS</span></h1>
          <span className="ml-4 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-white/5 border border-white/10 text-slate-400">v2.4.1</span>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Active Risks</span>
            <span className={`font-mono text-lg font-bold ${vStats.risks > 0 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>{vStats.risks}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Stock Health</span>
            <span className={`font-mono text-lg font-bold ${vStats.health < 90 ? 'text-amber-500' : 'text-emerald-500'}`}>{vStats.health}%</span>
          </div>
          <div className="flex flex-col items-center hidden sm:flex">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Daily Waste Saved</span>
            <span className="font-mono text-lg font-bold text-slate-200">{vStats.waste}</span>
          </div>
          <div className="flex flex-col items-center hidden md:flex">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Efficiency Index</span>
            <span className="font-mono text-lg font-bold text-slate-200">{vStats.efficiency}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Battery className="w-5 h-5 text-emerald-500" />
          <Settings className="w-5 h-5 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors" />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4">
        
        {/* Left/Center Column: Visions & Inventory */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          
          {/* Omni-Eye Vision Feed */}
          <div className={`flex-[3] relative rounded-xl overflow-hidden glass-panel border ${globalStatus === 'Critical' ? 'alert-pulse border-red-500/50' : 'border-white/10'}`}>
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded border border-white/10">
              <Eye className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">Omni-Eye Network</span>
            </div>

            {/* 4-Grid CCTV layout */}
            <div className="grid grid-cols-2 grid-rows-2 h-full w-full gap-1 p-1 bg-black">
              {[
                { id: '1A', zone: 'Prep Station', status: 'Monitoring', color: 'emerald', bg: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&q=80&w=800' },
                { id: '1B', zone: 'Walk-in Cooler', status: 'Monitoring', color: 'emerald', bg: 'https://images.unsplash.com/photo-1587293852726-adfbbe5128ff?auto=format&fit=crop&q=80&w=800' },
                { id: '1C', zone: 'Dry Storage', status: globalStatus === 'Warning' ? 'Low Stock' : 'Monitoring', color: globalStatus === 'Warning' ? 'amber' : 'emerald', bg: 'https://images.unsplash.com/photo-1590310237000-ad1e53a391cb?auto=format&fit=crop&q=80&w=800' },
                { id: '1D', zone: 'Hot Line', status: globalStatus === 'Critical' ? 'Hazard Detected' : 'Monitoring', color: globalStatus === 'Critical' ? 'red' : 'emerald', bg: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800' }
              ].map((feed, idx) => (
                <div key={feed.id} className="relative bg-zinc-900 border border-white/5 overflow-hidden group">
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity transition-opacity duration-1000 group-hover:opacity-60" style={{backgroundImage: `url(${feed.bg})`}}></div>
                  <div className={`scanning-line ${getAccentColor()}`} style={{animationDelay: `${idx * 0.5}s`}}></div>
                  
                  {/* Bounding Box Simulation */}
                  {feed.color !== 'emerald' && (
                    <motion.div 
                      key={feed.status}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className={`absolute top-[30%] left-[30%] w-32 h-32 border-2 ${feed.color === 'red' ? 'border-red-500' : 'border-amber-500'} border-dashed z-10 flex items-end p-1`}
                    >
                      <span className={`text-[9px] font-mono font-bold bg-black/80 px-1 ${feed.color === 'red' ? 'text-red-500' : 'text-amber-500'}`}>
                        {feed.color === 'red' ? 'LIQUID_DETECTED' : 'CAPACITY_LOW'}
                      </span>
                    </motion.div>
                  )}

                  <div className="absolute bottom-2 left-2 flex flex-col gap-1 z-20">
                    <span className="text-[10px] font-mono text-white/50 bg-black/60 px-1 rounded inline-block w-max">CAM_{feed.id}</span>
                    <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                      <div className={`w-1.5 h-1.5 rounded-full ${feed.color === 'red' ? 'bg-red-500 animate-pulse' : (feed.color === 'amber' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500')}`}></div>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${feed.color === 'red' ? 'text-red-500' : (feed.color === 'amber' ? 'text-amber-500' : 'text-emerald-500')}`}>
                        {feed.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Autonomous Inventory Matrix */}
          <div className="flex-[2] glass-panel rounded-xl border border-white/10 flex flex-col min-h-0">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-500" />
                Autonomous Inventory Matrix
              </h2>
              <span className="text-xs font-mono text-slate-500">Live Sync</span>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar p-0">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#0a0a0a]/90 backdrop-blur border-b border-white/10 z-10">
                  <tr>
                    <th className="p-4 text-xs font-mono text-slate-500 uppercase tracking-widest font-normal">Item</th>
                    <th className="p-4 text-xs font-mono text-slate-500 uppercase tracking-widest font-normal w-1/3">Current Stock</th>
                    <th className="p-4 text-xs font-mono text-slate-500 uppercase tracking-widest font-normal">AI Status</th>
                    <th className="p-4 text-xs font-mono text-slate-500 uppercase tracking-widest font-normal text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <p className="text-sm font-bold text-slate-200">{item.item}</p>
                        <p className="text-[10px] font-mono text-slate-500 uppercase">{item.type}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-mono font-bold w-10 ${item.level < 20 ? 'text-amber-500 animate-pulse' : 'text-slate-300'}`}>{item.level}%</span>
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{width:0}} animate={{width:`${item.level}%`}} 
                              className={`h-full ${item.level < 20 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-mono uppercase px-2 py-1 border rounded ${
                          item.status === 'Optimized' ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' : 
                          (item.status === 'Expedite Required' ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' : 'text-blue-400 border-blue-400/30 bg-blue-400/10')
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {item.action === 'Reorder' && (
                          <button 
                            onClick={() => handleReorder(item)}
                            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 border border-amber-500/50 px-3 py-1.5 rounded text-xs font-bold uppercase transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                          >
                            Smart Reorder
                          </button>
                        )}
                        {item.action !== 'Reorder' && <span className="text-xs font-mono text-slate-600 border border-transparent px-3 py-1.5">{item.action}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Incident Stream */}
        <div className="w-80 glass-panel rounded-xl border border-white/10 flex flex-col">
          <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Incident Stream
            </h2>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <AnimatePresence>
              {incidents.map((incident) => (
                <motion.div 
                  key={incident.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-white/5 border border-white/5 rounded-lg flex flex-col gap-2 relative overflow-hidden group hover:bg-white/10 transition-colors"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${incident.type === 'Hazard' ? 'bg-red-500' : (incident.type === 'Logistics' ? 'bg-amber-500' : 'bg-emerald-500')}`} />
                  
                  <div className="flex justify-between items-start pl-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${incident.bg}`}>
                        <incident.icon className={`w-3.5 h-3.5 ${incident.color}`} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{incident.type}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{incident.time}</span>
                  </div>
                  <p className={`text-sm pl-2 ${incident.type === 'Hazard' ? 'font-bold text-red-100' : 'text-slate-300'}`}>{incident.desc}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Simulation Control Panel (Bottom Docked) */}
      <div className="h-14 border-t border-white/10 glass-panel shrink-0 flex items-center justify-between px-6 bg-black/80">
        <div className="flex items-center gap-3">
          <Settings className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Simulation Control Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => runSimulation('leak')} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded text-xs font-mono uppercase transition-colors">
            Simulate Leak
          </button>
          <button onClick={() => runSimulation('stock')} className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded text-xs font-mono uppercase transition-colors">
            Simulate Stock Out
          </button>
          <button onClick={() => runSimulation('clear')} className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded text-xs font-mono uppercase transition-colors flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" /> All Clear
          </button>
        </div>
      </div>

      {/* Smart Reorder Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-lg rounded-xl border border-white/10 p-6 flex flex-col relative overflow-hidden"
            >
              {/* Modal Top Bar */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-500" /> Agentic Intervention
                  </h3>
                  <p className="text-xs font-mono text-slate-500">{modalData?.item} • Critical Replenishment</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
              </div>

              {/* Modal Content */}
              {isThinking ? (
                <div className="py-12 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                  <p className="text-sm font-mono text-emerald-500 tracking-widest animate-pulse">Gemini is thinking...</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="bg-black/50 border border-white/5 rounded-lg p-4 font-mono text-sm text-slate-300">
                    <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Drafted Email (Supplier Prime)
                    </div>
                    <p className="leading-relaxed">
                      Subject: URGENT: Reorder Request - {modalData?.item}<br/><br/>
                      Dear Supplier,<br/>
                      Our automated inventory system indicates critical stock levels ({modalData?.level}%) for {modalData?.item}. <br/><br/>
                      Please expedite a bulk delivery to our main receiving bay within 24 hours to prevent operational disruption.<br/><br/>
                      System ID: SYS-A09X
                    </p>
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded text-xs font-bold uppercase text-slate-400 hover:text-white transition-colors">
                      Cancel
                    </button>
                    <button onClick={() => { setIsModalOpen(false); runSimulation('clear'); }} className="px-6 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <Zap className="w-3 h-3" /> Execute Order
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
