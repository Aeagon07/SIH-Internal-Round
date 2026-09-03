// TypeScript interfaces for MetroScan AI compliance data

export interface BarcodeCalibration {
  detected: boolean;
  pixelWidth: number;
  mmPerPx: number;
  confidence: number;
}

export interface ViolationCount {
  critical: number;
  major: number;
  minor: number;
}

export type FieldStatus = 'compliant' | 'violation' | 'warning';
export type Severity = 'critical' | 'major' | 'minor' | null;

export interface ComplianceField {
  id: string;
  label: string;
  ruleRef: string;
  status: FieldStatus;
  severity: Severity;
  found: string;
  required: string;
  fontSizeMm: number | null;
  fontRequiredMm: number | null;
  notes: string;
}

export interface ScanResult {
  productName: string;
  overallCompliant: boolean;
  complianceScore: number;
  violationCount: ViolationCount;
  processingTimeMs: number;
  barcodeCalibration: BarcodeCalibration;
  fields: ComplianceField[];
  semanticFlags: string[];
  officerRecommendation: string;
  certificateEligible: boolean;
}

export type ScanType = 'physical' | 'ecommerce' | 'manufacturer';

export interface ScanInput {
  type: ScanType;
  imageFile?: File;
  imageUrl?: string;
  productUrl?: string;
  productName?: string;
  gstin?: string;
  companyName?: string;
  netQuantity?: string;
  fssaiLic?: string;
  isDemoMode?: boolean;
  demoProduct?: 'parle' | 'maggi' | 'handwash';
}

export interface DashboardStat {
  label: string;
  value: number;
  unit?: string;
  trend: string;
  trendUp: boolean;
  color: 'saffron' | 'crimson' | 'green' | 'amber';
}

export interface RecentScan {
  id: string;
  product: string;
  track: string;
  officer: string;
  time: string;
  score: number;
  violations: { critical: number; major: number; minor: number };
  status: 'compliant' | 'warning' | 'violation';
}
