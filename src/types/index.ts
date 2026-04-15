export type IncidentType = 'hazard' | 'logistics' | 'compliance' | 'waste';
export type AIActionStatus = 'Drafting Order' | 'Optimized' | 'Expedite Required';
export type DashboardMode = 'normal' | 'leak' | 'stockout';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Incident {
  id: string;
  type: IncidentType;
  message: string;
  location: string;
  timestamp: Date;
  severity: Severity;
  relatedImage?: string;
  ingredient?: string;
  quantity?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  supplier: string;
  supplierEmail: string;
  aiStatus: AIActionStatus;
}

export interface VitalStats {
  activeRisks: number;
  stockHealth: number;
  dailyWasteSaved: number;
  operationalEfficiency: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color: string;
}

export interface CameraFeed {
  id: string;
  zone: string;
  status: 'Monitoring' | 'Alert' | 'Offline';
  boxes: BoundingBox[];
}
