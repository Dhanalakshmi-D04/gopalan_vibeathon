import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Package, Shield, Activity, Trash2 } from 'lucide-react';
import { Incident, IncidentType, Severity } from '../types';

interface Props {
  incidents: Incident[];
}

const TYPE_CONFIG: Record<IncidentType, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  hazard: {
    icon: <AlertTriangle size={13} />,
    color: '#ef4444',
    bg: '#ef444415',
    label: 'HAZARD',
  },
  logistics: {
    icon: <Package size={13} />,
    color: '#f59e0b',
    bg: '#f59e0b15',
    label: 'LOGISTICS',
  },
  compliance: {
    icon: <Shield size={13} />,
    color: '#10b981',
    bg: '#10b98115',
    label: 'COMPLIANCE',
  },
  waste: {
    icon: <Trash2 size={13} />,
    color: '#8b5cf6',
    bg: '#8b5cf615',
    label: 'WASTE',
  },
};

const SEVERITY_DOT: Record<Severity, string> = {
  low: '#6b7280',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#ef4444',
};

function formatRelativeTime(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function IncidentRow({ incident }: { incident: Incident }) {
  const cfg = TYPE_CONFIG[incident.type];
  const isCritical = incident.severity === 'critical';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.35 }}
      className="relative rounded-lg border p-2.5 overflow-hidden"
      style={{
        borderColor: `${cfg.color}30`,
        background: cfg.bg,
      }}
    >
      {isCritical && (
        <motion.div
          className="absolute inset-0 rounded-lg border pointer-events-none"
          animate={{ borderColor: [`${cfg.color}80`, `${cfg.color}10`, `${cfg.color}80`] }}
          transition={{ duration: 0.9, repeat: Infinity }}
          style={{ borderColor: `${cfg.color}80` }}
        />
      )}
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5" style={{ color: cfg.color }}>
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="font-mono text-xs font-bold tracking-wider px-1 py-0.5 rounded"
              style={{ color: cfg.color, background: `${cfg.color}20` }}
            >
              {cfg.label}
            </span>
            {isCritical && (
              <motion.span
                className="font-mono text-xs font-bold px-1 py-0.5 rounded"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                style={{ color: '#ef4444', background: '#ef444425' }}
              >
                CRITICAL
              </motion.span>
            )}
          </div>
          <p className="font-mono text-xs text-gray-300 leading-tight break-words">{incident.message}</p>
          {incident.type === 'waste' && incident.ingredient && (
            <div className="mt-1 font-mono text-[10px] text-gray-400">
              <span className="opacity-70">Ingredient:</span> {incident.ingredient} <br />
              <span className="opacity-70">Est. Quantity:</span> {incident.quantity}
            </div>
          )}
          <div className="flex items-center gap-2 mt-1">
            <motion.div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: SEVERITY_DOT[incident.severity] }}
              animate={isCritical ? { opacity: [1, 0.3, 1] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <span className="font-mono text-xs text-gray-600">{incident.location}</span>
            <span className="font-mono text-xs text-gray-600 ml-auto">{formatRelativeTime(incident.timestamp)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function IncidentStream({ incidents }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [incidents.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-emerald-400" />
          <span className="font-mono text-sm font-bold text-emerald-400 tracking-wider uppercase">Incident Stream</span>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-2 h-2 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="font-mono text-xs text-gray-500">LIVE</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 pr-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#10b98140 transparent' }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {incidents.map(incident => (
            <IncidentRow key={incident.id} incident={incident} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
