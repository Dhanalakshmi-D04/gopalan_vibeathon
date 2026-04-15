import { motion } from 'framer-motion';
import { AlertTriangle, Package, Leaf, Zap } from 'lucide-react';
import { VitalStats, DashboardMode } from '../types';

interface Props {
  vitals: VitalStats;
  mode: DashboardMode;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  color: string;
  pulse?: boolean;
}

function StatCard({ icon, label, value, unit, color, pulse }: StatCardProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg border"
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderColor: `${color}40`,
      }}
    >
      <motion.div
        animate={pulse ? { opacity: [1, 0.4, 1] } : {}}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="p-2 rounded-md"
        style={{ background: `${color}20`, color }}
      >
        {icon}
      </motion.div>
      <div>
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: '#6b7280' }}>{label}</p>
        <p className="text-xl font-mono font-bold leading-tight" style={{ color }}>
          {value}<span className="text-xs font-normal ml-1 text-gray-500">{unit}</span>
        </p>
      </div>
    </div>
  );
}

export default function VitalSigns({ vitals, mode }: Props) {
  const riskColor = mode === 'leak' ? '#ef4444' : vitals.activeRisks > 3 ? '#f59e0b' : '#10b981';
  const stockColor = vitals.stockHealth < 50 ? '#ef4444' : vitals.stockHealth < 70 ? '#f59e0b' : '#10b981';
  const effColor = vitals.operationalEfficiency < 65 ? '#ef4444' : vitals.operationalEfficiency < 80 ? '#f59e0b' : '#10b981';

  return (
    <div className="flex items-center gap-3">
      <StatCard
        icon={<AlertTriangle size={16} />}
        label="Active Risks"
        value={String(vitals.activeRisks)}
        color={riskColor}
        pulse={vitals.activeRisks > 3}
      />
      <StatCard
        icon={<Package size={16} />}
        label="Stock Health"
        value={String(vitals.stockHealth)}
        unit="%"
        color={stockColor}
      />
      <StatCard
        icon={<Leaf size={16} />}
        label="Waste Saved"
        value={String(vitals.dailyWasteSaved)}
        unit="kg"
        color="#10b981"
      />
      <StatCard
        icon={<Zap size={16} />}
        label="Op. Efficiency"
        value={String(vitals.operationalEfficiency)}
        unit="%"
        color={effColor}
        pulse={vitals.operationalEfficiency < 65}
      />
    </div>
  );
}
