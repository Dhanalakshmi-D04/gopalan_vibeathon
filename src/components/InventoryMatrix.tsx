import { motion } from 'framer-motion';
import { Database, ShoppingCart, TrendingDown, CheckCircle, AlertTriangle } from 'lucide-react';
import { InventoryItem, AIActionStatus } from '../types';

interface Props {
  inventory: InventoryItem[];
  onReorder: (item: InventoryItem) => void;
}

const STATUS_CONFIG: Record<AIActionStatus, { color: string; bg: string; icon: React.ReactNode }> = {
  'Optimized': {
    color: '#10b981',
    bg: '#10b98120',
    icon: <CheckCircle size={11} />,
  },
  'Drafting Order': {
    color: '#f59e0b',
    bg: '#f59e0b20',
    icon: <ShoppingCart size={11} />,
  },
  'Expedite Required': {
    color: '#ef4444',
    bg: '#ef444420',
    icon: <AlertTriangle size={11} />,
  },
};

function StockBar({ value }: { value: number }) {
  const color = value <= 20 ? '#ef4444' : value <= 40 ? '#f59e0b' : '#10b981';
  return (
    <div className="flex items-center gap-2 w-full">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span
        className="font-mono text-xs w-8 text-right font-bold"
        style={{ color }}
      >
        {value}%
      </span>
    </div>
  );
}

export default function InventoryMatrix({ inventory, onReorder }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Database size={14} className="text-emerald-400" />
          <span className="font-mono text-sm font-bold text-emerald-400 tracking-wider uppercase">Autonomous Inventory Matrix</span>
        </div>
        <div className="flex items-center gap-3">
          {(['Optimized', 'Drafting Order', 'Expedite Required'] as AIActionStatus[]).map(s => {
            const cfg = STATUS_CONFIG[s];
            return (
              <div key={s} className="flex items-center gap-1">
                <div style={{ color: cfg.color }}>{cfg.icon}</div>
                <span className="font-mono text-xs" style={{ color: cfg.color }}>{s}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="flex-1 overflow-auto rounded-lg border"
        style={{
          borderColor: '#10b98120',
          scrollbarWidth: 'thin',
          scrollbarColor: '#10b98140 transparent',
        }}
      >
        <table className="w-full min-w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #10b98120' }}>
              {['Item', 'Category', 'Current Stock', 'Unit', 'Supplier', 'AI Status', 'Action'].map(col => (
                <th
                  key={col}
                  className="font-mono text-xs uppercase tracking-widest px-3 py-2.5 text-left"
                  style={{ color: '#4b5563', background: 'rgba(16,185,129,0.04)', whiteSpace: 'nowrap' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, i) => {
              const cfg = STATUS_CONFIG[item.aiStatus];
              const isLow = item.currentStock <= 20;
              return (
                <motion.tr
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b transition-colors"
                  style={{
                    borderColor: '#ffffff06',
                    background: isLow ? 'rgba(239,68,68,0.04)' : 'transparent',
                  }}
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {isLow && (
                        <motion.div
                          animate={{ opacity: [1, 0.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        >
                          <TrendingDown size={12} className="text-red-400" />
                        </motion.div>
                      )}
                      <span className="font-mono text-sm text-gray-200 whitespace-nowrap">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-xs text-gray-500">{item.category}</span>
                  </td>
                  <td className="px-3 py-2.5" style={{ minWidth: '140px' }}>
                    <StockBar value={item.currentStock} />
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-xs text-gray-500">{item.unit}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="font-mono text-xs text-gray-400 whitespace-nowrap">{item.supplier}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div
                      className="flex items-center gap-1.5 px-2 py-1 rounded font-mono text-xs font-bold w-fit whitespace-nowrap"
                      style={{ color: cfg.color, background: cfg.bg }}
                    >
                      {cfg.icon}
                      {item.aiStatus}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onReorder(item)}
                      className="font-mono text-xs px-3 py-1.5 rounded border font-bold whitespace-nowrap transition-colors"
                      style={{
                        color: '#10b981',
                        borderColor: '#10b98140',
                        background: '#10b98110',
                      }}
                    >
                      Smart Reorder
                    </motion.button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
