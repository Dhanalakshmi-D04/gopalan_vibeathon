import { useState, useCallback, useEffect, useRef } from 'react';
import { DashboardMode, Incident, InventoryItem, VitalStats, CameraFeed } from '../types';
import { INITIAL_INCIDENTS, INITIAL_INVENTORY, INITIAL_CAMERA_FEEDS } from '../data/mockData';

const NORMAL_VITALS: VitalStats = {
  activeRisks: 2,
  stockHealth: 74,
  dailyWasteSaved: 18.4,
  operationalEfficiency: 91,
};

const LEAK_VITALS: VitalStats = {
  activeRisks: 7,
  stockHealth: 74,
  dailyWasteSaved: 18.4,
  operationalEfficiency: 58,
};

const STOCKOUT_VITALS: VitalStats = {
  activeRisks: 4,
  stockHealth: 41,
  dailyWasteSaved: 18.4,
  operationalEfficiency: 79,
};

export function useDashboardState() {
  const [mode, setMode] = useState<DashboardMode>('normal');
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [vitals, setVitals] = useState<VitalStats>(NORMAL_VITALS);
  const [cameraFeeds, setCameraFeeds] = useState<CameraFeed[]>(INITIAL_CAMERA_FEEDS);
  const [reorderItem, setReorderItem] = useState<InventoryItem | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addIncident = useCallback((incident: Omit<Incident, 'id' | 'timestamp'>) => {
    const newIncident: Incident = {
      ...incident,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setIncidents(prev => [newIncident, ...prev].slice(0, 30));
  }, []);

  const simulateLeak = useCallback(() => {
    setMode('leak');
    setVitals(LEAK_VITALS);
    addIncident({
      type: 'hazard',
      message: 'CRITICAL: Liquid spill detected in Zone B – Immediate response required',
      location: 'Zone B – Hot Line',
      severity: 'critical',
    });
    addIncident({
      type: 'hazard',
      message: 'Floor sensor triggered – slip hazard active near Oven Station',
      location: 'Zone B',
      severity: 'critical',
    });
    setCameraFeeds(prev => prev.map(feed =>
      feed.id === 'cam-2'
        ? {
            ...feed,
            status: 'Alert',
            boxes: [
              ...feed.boxes,
              { x: 30, y: 55, width: 40, height: 25, label: 'SPILL DETECTED', color: '#ef4444' },
            ],
          }
        : feed
    ));
  }, [addIncident]);

  const simulateStockOut = useCallback(() => {
    setMode('stockout');
    setVitals(STOCKOUT_VITALS);
    setInventory(prev => prev.map(item =>
      item.name === 'All-Purpose Flour'
        ? { ...item, currentStock: 5, aiStatus: 'Expedite Required' }
        : item
    ));
    addIncident({
      type: 'logistics',
      message: 'ALERT: Stock Level: Flour dropped to 5% – Autonomous reorder initiated',
      location: 'Dry Storage',
      severity: 'critical',
    });
    addIncident({
      type: 'logistics',
      message: 'AI Reorder Draft generated for PrimeBake Supplies – awaiting confirmation',
      location: 'System',
      severity: 'high',
    });
  }, [addIncident]);

  const allClear = useCallback(() => {
    setMode('normal');
    setVitals(NORMAL_VITALS);
    setInventory(INITIAL_INVENTORY);
    setCameraFeeds(INITIAL_CAMERA_FEEDS);
    addIncident({
      type: 'compliance',
      message: 'All Clear – System restored to nominal operating parameters',
      location: 'All Zones',
      severity: 'low',
    });
  }, [addIncident]);

  useEffect(() => {
    const autoMessages: Array<Omit<Incident, 'id' | 'timestamp'>> = [
      { type: 'compliance', message: 'Hand-wash protocol verified – Station 2 compliant', location: 'Zone A', severity: 'low' },
      { type: 'logistics', message: 'AI Demand Forecast updated – weekend menu loaded', location: 'System', severity: 'low' },
      { type: 'hazard', message: 'Oven temp variance detected – self-correcting', location: 'Zone B', severity: 'medium' },
      { type: 'compliance', message: 'HACCP checkpoint passed – Cold chain verified', location: 'Zone C', severity: 'low' },
      { type: 'logistics', message: 'Supplier ETA confirmed – OceanDirect delivery at 06:00', location: 'Receiving', severity: 'low' },
    ];
    let idx = 0;
    tickRef.current = setInterval(() => {
      if (idx < autoMessages.length) {
        addIncident(autoMessages[idx % autoMessages.length]);
        idx++;
      }
    }, 12000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [addIncident]);

  return {
    mode,
    incidents,
    inventory,
    vitals,
    cameraFeeds,
    reorderItem,
    setReorderItem,
    setMode,
    setVitals,
    setInventory,
    setCameraFeeds,
    addIncident,
    simulateLeak,
    simulateStockOut,
    allClear,
  };
}
