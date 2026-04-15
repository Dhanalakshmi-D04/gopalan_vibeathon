import { CameraFeed, Incident, InventoryItem } from '../types';

export const INITIAL_CAMERA_FEEDS: CameraFeed[] = [
  {
    id: 'cam-1',
    zone: 'Zone A – Prep Station',
    status: 'Monitoring',
    boxes: [
      { x: 15, y: 20, width: 30, height: 25, label: 'Chef', color: '#10b981' },
      { x: 55, y: 40, width: 20, height: 18, label: 'Cutting Board', color: '#10b981' },
    ],
  },
  {
    id: 'cam-2',
    zone: 'Zone B – Hot Line',
    status: 'Monitoring',
    boxes: [
      { x: 10, y: 30, width: 35, height: 40, label: 'Stove Active', color: '#f59e0b' },
      { x: 60, y: 15, width: 25, height: 20, label: 'Pot', color: '#10b981' },
    ],
  },
  {
    id: 'cam-3',
    zone: 'Zone C – Cold Storage',
    status: 'Monitoring',
    boxes: [
      { x: 20, y: 10, width: 25, height: 35, label: 'Freezer Door', color: '#10b981' },
      { x: 55, y: 50, width: 30, height: 20, label: 'Stock Cart', color: '#10b981' },
    ],
  },
  {
    id: 'cam-4',
    zone: 'Zone D – Dish Pit',
    status: 'Monitoring',
    boxes: [
      { x: 25, y: 25, width: 40, height: 30, label: 'Dish Station', color: '#10b981' },
      { x: 10, y: 60, width: 20, height: 20, label: 'Staff', color: '#10b981' },
    ],
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: '1',
    type: 'compliance',
    message: 'Non-compliance: Cross-contamination risk at Station 1',
    location: 'Zone A',
    timestamp: new Date(Date.now() - 2 * 60000),
    severity: 'high',
  },
  {
    id: '2',
    type: 'logistics',
    message: 'Stock Level: Heavy Cream at 18%',
    location: 'Cold Storage',
    timestamp: new Date(Date.now() - 5 * 60000),
    severity: 'medium',
  },
  {
    id: '3',
    type: 'hazard',
    message: 'Temperature anomaly detected near Oven 3',
    location: 'Zone B',
    timestamp: new Date(Date.now() - 9 * 60000),
    severity: 'medium',
  },
  {
    id: '4',
    type: 'logistics',
    message: 'Stock Level: Atlantic Salmon at 12%',
    location: 'Walk-in Cooler',
    timestamp: new Date(Date.now() - 14 * 60000),
    severity: 'high',
  },
  {
    id: '5',
    type: 'compliance',
    message: 'PPE check passed – all staff compliant',
    location: 'Zone A & B',
    timestamp: new Date(Date.now() - 20 * 60000),
    severity: 'low',
  },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'All-Purpose Flour',
    category: 'Dry Goods',
    currentStock: 72,
    unit: 'kg',
    supplier: 'PrimeBake Supplies',
    supplierEmail: 'orders@primebake.com',
    aiStatus: 'Optimized',
  },
  {
    id: '2',
    name: 'Olive Oil (EVOO)',
    category: 'Oils & Fats',
    currentStock: 45,
    unit: 'L',
    supplier: 'MediterraFoods Ltd',
    supplierEmail: 'supply@mediterra.com',
    aiStatus: 'Drafting Order',
  },
  {
    id: '3',
    name: 'Chicken Breast',
    category: 'Proteins',
    currentStock: 28,
    unit: 'kg',
    supplier: 'FarmFirst Proteins',
    supplierEmail: 'bulk@farmfirst.io',
    aiStatus: 'Expedite Required',
  },
  {
    id: '4',
    name: 'Roma Tomatoes',
    category: 'Produce',
    currentStock: 61,
    unit: 'kg',
    supplier: 'GreenPath Organics',
    supplierEmail: 'orders@greenpath.com',
    aiStatus: 'Optimized',
  },
  {
    id: '5',
    name: 'Heavy Cream',
    category: 'Dairy',
    currentStock: 18,
    unit: 'L',
    supplier: 'Alpine Dairy Co.',
    supplierEmail: 'orders@alpinedairy.com',
    aiStatus: 'Expedite Required',
  },
  {
    id: '6',
    name: 'Kosher Salt',
    category: 'Seasonings',
    currentStock: 88,
    unit: 'kg',
    supplier: 'PrimeBake Supplies',
    supplierEmail: 'orders@primebake.com',
    aiStatus: 'Optimized',
  },
  {
    id: '7',
    name: 'Arborio Rice',
    category: 'Grains',
    currentStock: 55,
    unit: 'kg',
    supplier: 'ItalFoods Import',
    supplierEmail: 'orders@italfoods.com',
    aiStatus: 'Drafting Order',
  },
  {
    id: '8',
    name: 'Atlantic Salmon',
    category: 'Seafood',
    currentStock: 12,
    unit: 'kg',
    supplier: 'OceanDirect Ltd',
    supplierEmail: 'fresh@oceandirect.com',
    aiStatus: 'Expedite Required',
  },
];

export function generateEmailDraft(item: InventoryItem): string {
  const urgency = item.aiStatus === 'Expedite Required' ? 'URGENT: ' : '';
  return `Subject: ${urgency}Emergency Reorder Request – ${item.name}

To: ${item.supplierEmail}
From: kitchen-ops@sousvision.ai
Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Dear ${item.supplier} Procurement Team,

I am writing on behalf of SousVision AI Kitchen Management System to initiate an ${item.aiStatus === 'Expedite Required' ? 'emergency' : 'standard'} reorder of ${item.name}.

Current Status:
• Current Stock Level: ${item.currentStock}% remaining
• AI Classification: ${item.aiStatus}
• Category: ${item.category}
• Unit of Measure: ${item.unit}

Our predictive demand model indicates we require an immediate resupply to maintain uninterrupted kitchen operations. Based on current consumption rates and projected service volume, we request the following:

Requested Order Quantity: ${item.aiStatus === 'Expedite Required' ? '150% of standard order volume' : 'Standard reorder quantity'}
Requested Delivery: ${item.aiStatus === 'Expedite Required' ? 'Within 24 hours (Expedited Shipping)' : 'Within 3–5 business days'}

Please confirm availability and provide an ETA at your earliest convenience. Our kitchen operations team is standing by.

This order has been autonomously generated and validated by the SousVision AI Inventory Management Engine (v3.2.1).

Regards,
SousVision AI – Autonomous Kitchen Operations
kitchen-ops@sousvision.ai | +1 (800) 768-7847
Powered by Gemini Advanced Reasoning Engine`;
}
