import { motion } from 'framer-motion';
import { Camera, Wifi } from 'lucide-react';
import { CameraFeed, DashboardMode } from '../types';

interface Props {
  feeds: CameraFeed[];
  mode: DashboardMode;
}

function BoundingBoxOverlay({ box }: { box: CameraFeed['boxes'][0] }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <rect
        x={`${box.x}%`}
        y={`${box.y}%`}
        width={`${box.width}%`}
        height={`${box.height}%`}
        fill="none"
        stroke={box.color}
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />
      <rect
        x={`${box.x}%`}
        y={`calc(${box.y}% - 14px)`}
        width={`${box.width}%`}
        height="14"
        fill={`${box.color}30`}
      />
      <text
        x={`${box.x + 1}%`}
        y={`${box.y + 1}%`}
        dominantBaseline="hanging"
        fill={box.color}
        fontSize="9"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {box.label}
      </text>
    </motion.g>
  );
}

function ScanLine() {
  return (
    <motion.div
      className="absolute inset-x-0 pointer-events-none"
      style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)',
        zIndex: 10,
      }}
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
    />
  );
}

function CameraCell({ feed, index, mode }: { feed: CameraFeed; index: number; mode: DashboardMode }) {
  const isAlert = feed.status === 'Alert';
  const borderColor = isAlert ? '#ef4444' : '#10b98140';

  const zoneColors = ['#0d1f17', '#1a1a0d', '#0d1727', '#1a0d1a'];

  return (
    <div
      className="relative overflow-hidden rounded-lg border flex flex-col"
      style={{
        borderColor,
        background: zoneColors[index % zoneColors.length],
        minHeight: '200px',
      }}
    >
      {isAlert && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20 rounded-lg border-2"
          animate={{ borderColor: ['#ef4444', '#ef444420', '#ef4444'] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ borderColor: '#ef4444' }}
        />
      )}

      <ScanLine />

      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)
          `,
        }}
      />

      <svg className="absolute inset-0 w-full h-full z-5" style={{ zIndex: 5 }}>
        {feed.boxes.map((box, i) => (
          <BoundingBoxOverlay key={i} box={box} />
        ))}
      </svg>

      <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5">
        <Camera size={10} className="text-gray-400" />
        <span className="font-mono text-gray-400 text-xs">{`CAM-0${index + 1}`}</span>
      </div>

      <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Wifi size={10} style={{ color: isAlert ? '#ef4444' : '#10b981' }} />
        </motion.div>
        <span
          className="font-mono text-xs px-1.5 py-0.5 rounded"
          style={{
            color: isAlert ? '#ef4444' : '#10b981',
            background: isAlert ? '#ef444420' : '#10b98120',
          }}
        >
          {isAlert ? 'ALERT' : 'LIVE'}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 px-2 py-1.5" style={{ background: 'rgba(0,0,0,0.7)' }}>
        <p className="font-mono text-xs text-gray-300 truncate">{feed.zone}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isAlert ? '#ef4444' : '#10b981' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="font-mono text-xs" style={{ color: isAlert ? '#ef4444' : '#10b981' }}>
            {feed.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OmniEyeFeed({ feeds, mode }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Camera size={14} className="text-emerald-400" />
          <span className="font-mono text-sm font-bold text-emerald-400 tracking-wider uppercase">Omni-Eye Vision Feed</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="font-mono text-xs text-gray-500">4 FEEDS ACTIVE</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 flex-1">
        {feeds.map((feed, i) => (
          <CameraCell key={feed.id} feed={feed} index={i} mode={mode} />
        ))}
      </div>
    </div>
  );
}
