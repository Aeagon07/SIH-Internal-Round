import { ScanResult } from '@/types/compliance';

export interface BoundingBox {
  id: string;
  fieldId: string;
  label: string;
  top: number; // percentage
  left: number; // percentage
  width: number; // percentage
  height: number; // percentage
  status: 'compliant' | 'violation' | 'warning';
}

export interface DemoProduct {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  barcodeImageUrl?: string;
  boundingBoxes: BoundingBox[];
  result: ScanResult;
}

export const PARLE_G_DEMO: DemoProduct = {
  id: 'parle-g',
  name: 'Parle-G Original Glucose Biscuits 200g',
  subtitle: 'Packaged Food Commodity · Biscuits & Confectionery',
  category: 'Food Product (FSSAI Regulated)',
  imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop&auto=format',
  boundingBoxes: [
    { id: 'box-1', fieldId: 'name_of_commodity', label: 'Commodity Name', top: 12, left: 18, width: 62, height: 16, status: 'compliant' },
    { id: 'box-2', fieldId: 'net_quantity', label: 'Net Quantity (200g)', top: 68, left: 12, width: 35, height: 14, status: 'compliant' },
    { id: 'box-3', fieldId: 'mrp', label: 'MRP Declaration', top: 66, left: 52, width: 40, height: 18, status: 'violation' },
    { id: 'box-4', fieldId: 'date_of_manufacture', label: 'Mfg Date & Expiry', top: 45, left: 58, width: 36, height: 14, status: 'compliant' },
    { id: 'box-5', fieldId: 'manufacturer_address', label: 'Mfr Details & Contact', top: 44, left: 10, width: 44, height: 20, status: 'warning' },
  ],
  result: {
    productName: 'Parle-G Original Glucose Biscuits 200g',
    overallCompliant: false,
    complianceScore: 74,
    violationCount: { critical: 0, major: 1, minor: 2 },
    processingTimeMs: 41200,
    barcodeCalibration: {
      detected: true,
      pixelWidth: 312,
      mmPerPx: 0.0830,
      confidence: 97.2,
    },
    fields: [
      {
        id: 'name_of_commodity',
        label: 'Generic Name of Commodity',
        ruleRef: 'Rule 6(1)(a)',
        status: 'compliant',
        severity: null,
        found: 'Biscuits - Glucose Biscuits',
        required: 'Generic or common name on principal display panel',
        fontSizeMm: 5.4,
        fontRequiredMm: 3.0,
        notes: 'Prominently displayed in bold title font (5.4mm measured vs 3.0mm required).',
      },
      {
        id: 'net_quantity',
        label: 'Net Quantity Declaration',
        ruleRef: 'Rule 6(1)(c)',
        status: 'compliant',
        severity: null,
        found: 'Net Wt. 200 g',
        required: 'Standard SI unit (g/kg) with mandatory font size',
        fontSizeMm: 4.8,
        fontRequiredMm: 4.0,
        notes: 'Unit symbol "g" complies with LM metric unit standards.',
      },
      {
        id: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        ruleRef: 'Rule 6(1)(e) + 2017 Amend',
        status: 'violation',
        severity: 'major',
        found: 'MRP Rs. 20.00',
        required: 'Must state "MRP ₹ xx.xx (incl. of all taxes)"',
        fontSizeMm: 2.1,
        fontRequiredMm: 3.0,
        notes: 'VIOLATION: Font height is 2.1mm (under 3.0mm threshold). Missing "incl. of all taxes" suffix.',
      },
      {
        id: 'date_of_manufacture',
        label: 'Month & Year of Manufacture',
        ruleRef: 'Rule 6(1)(d)',
        status: 'compliant',
        severity: null,
        found: 'Mfg: 08/2026',
        required: 'Month and Year in MM/YYYY or Month YYYY format',
        fontSizeMm: 3.6,
        fontRequiredMm: 2.0,
        notes: 'Compliant format and legible print.',
      },
      {
        id: 'best_before',
        label: 'Best Before / Expiry Indication',
        ruleRef: 'Rule 6(1)(d) proviso',
        status: 'compliant',
        severity: null,
        found: 'Best before 6 months from packaging',
        required: 'Mandatory for food commodities',
        fontSizeMm: 3.1,
        fontRequiredMm: 2.0,
        notes: 'Clear indication present on rear panel.',
      },
      {
        id: 'manufacturer_address',
        label: 'Name & Address of Manufacturer',
        ruleRef: 'Rule 6(1)(b)',
        status: 'warning',
        severity: 'minor',
        found: 'Parle Products Pvt. Ltd., Vile Parle East, Mumbai',
        required: 'Complete postal address with Pincode',
        fontSizeMm: 2.2,
        fontRequiredMm: 2.0,
        notes: 'Pincode (400057) missing from primary address block.',
      },
      {
        id: 'country_of_origin',
        label: 'Country of Origin',
        ruleRef: 'Rule 6(1)(n) 2020 Amend',
        status: 'compliant',
        severity: null,
        found: 'Made in India / Country of Origin: India',
        required: 'Mandatory declaration for all packaged goods',
        fontSizeMm: 3.2,
        fontRequiredMm: 2.0,
        notes: 'Explicit country of origin declaration verified.',
      },
      {
        id: 'customer_care',
        label: 'Consumer Care Details',
        ruleRef: 'Rule 6(2)',
        status: 'warning',
        severity: 'minor',
        found: 'Email: cs@parle.biz | Tel: 022-66916911',
        required: 'Name, Address, Phone, Email of officer handling complaints',
        fontSizeMm: 1.8,
        fontRequiredMm: 2.0,
        notes: 'Font size 1.8mm slightly below 2.0mm minimum guideline.',
      },
      {
        id: 'consumer_complaint_address',
        label: 'Consumer Complaint Postal Address',
        ruleRef: 'Rule 6(2)(a)',
        status: 'compliant',
        severity: null,
        found: 'Consumer Care Officer, Parle House, Mumbai 400057',
        required: 'Full postal contact for grievance redressal',
        fontSizeMm: 2.4,
        fontRequiredMm: 2.0,
        notes: 'Compliant grievance redressal contact.',
      },
      {
        id: 'common_name',
        label: 'Common Commodity Name',
        ruleRef: 'Rule 6(1)(a)',
        status: 'compliant',
        severity: null,
        found: 'Sweet Biscuits',
        required: 'Common commercial classification',
        fontSizeMm: 4.1,
        fontRequiredMm: 3.0,
        notes: 'Accurately stated on side panel.',
      },
      {
        id: 'quantity_dimensions',
        label: 'Dimensions of Commodity',
        ruleRef: 'Rule 6(1)(f)',
        status: 'compliant',
        severity: null,
        found: 'Dimensions: 14cm x 6cm x 4cm',
        required: 'Required if size affects consumer value',
        fontSizeMm: 2.6,
        fontRequiredMm: 2.0,
        notes: 'Package dimensions declared.',
      },
      {
        id: 'fssai_number',
        label: 'FSSAI License & Logo',
        ruleRef: 'FSSAI Packaging Reg 2018',
        status: 'compliant',
        severity: null,
        found: 'Lic. No. 10012022000045',
        required: '14-digit FSSAI license number + logo',
        fontSizeMm: 3.0,
        fontRequiredMm: 2.0,
        notes: 'Valid FSSAI license number and logo verified.',
      },
    ],
    semanticFlags: [
      'MRP missing "inclusive of all taxes" mandatory clause',
      'Missing 6-digit Pincode in manufacturer address',
    ],
    officerRecommendation: 'Issue Rule 6 violation notice to manufacturer for MRP font size non-compliance (2.1mm vs 3.0mm required) and missing tax clause. Recommend ₹10,000 preliminary penalty under Section 36 of Legal Metrology Act 2009.',
    certificateEligible: false,
  },
};

export const MAGGI_DEMO: DemoProduct = {
  id: 'maggi',
  name: 'Maggi 2-Minute Noodles 70g (E-Commerce Listing)',
  subtitle: 'Instant Noodles · E-Commerce Listing Inspection',
  category: 'Food Product (Rule 6(10) E-Commerce)',
  imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&h=600&fit=crop&auto=format',
  boundingBoxes: [
    { id: 'box-m1', fieldId: 'name_of_commodity', label: 'Product Title', top: 15, left: 15, width: 70, height: 20, status: 'compliant' },
    { id: 'box-m2', fieldId: 'net_quantity', label: 'Net Quantity', top: 60, left: 15, width: 30, height: 15, status: 'compliant' },
    { id: 'box-m3', fieldId: 'mrp', label: 'Price Listing', top: 60, left: 55, width: 35, height: 18, status: 'violation' },
  ],
  result: {
    productName: 'Maggi 2-Minute Instant Noodles 70g',
    overallCompliant: false,
    complianceScore: 68,
    violationCount: { critical: 1, major: 1, minor: 1 },
    processingTimeMs: 38900,
    barcodeCalibration: {
      detected: true,
      pixelWidth: 298,
      mmPerPx: 0.0869,
      confidence: 96.1,
    },
    fields: [
      {
        id: 'name_of_commodity',
        label: 'Generic Name of Commodity',
        ruleRef: 'Rule 6(10) E-Com',
        status: 'compliant',
        severity: null,
        found: 'Maggi 2-Minute Masala Instant Noodles',
        required: 'Display on listing page PDP',
        fontSizeMm: 6.0,
        fontRequiredMm: 3.0,
        notes: 'Title displayed on PDP listing header.',
      },
      {
        id: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        ruleRef: 'Rule 6(10) E-Com',
        status: 'violation',
        severity: 'critical',
        found: 'Price: ₹14.00 (MOP shown as MRP)',
        required: 'Actual MRP must be shown alongside any discounted price',
        fontSizeMm: 2.0,
        fontRequiredMm: 3.0,
        notes: 'CRITICAL VIOLATION: E-commerce portal displaying selling price as MRP without original package MRP.',
      },
      {
        id: 'country_of_origin',
        label: 'Country of Origin Declaration',
        ruleRef: 'Rule 6(10) proviso',
        status: 'violation',
        severity: 'major',
        found: 'Not declared on product image/specifications',
        required: 'Mandatory on e-commerce PDP',
        fontSizeMm: null,
        fontRequiredMm: 2.0,
        notes: 'MAJOR VIOLATION: Country of origin field missing on e-commerce listing page.',
      },
      {
        id: 'net_quantity',
        label: 'Net Quantity',
        ruleRef: 'Rule 6(10)',
        status: 'compliant',
        severity: null,
        found: '70 g',
        required: 'Declared net weight',
        fontSizeMm: 4.5,
        fontRequiredMm: 3.0,
        notes: 'Properly declared in product specifications table.',
      },
      {
        id: 'manufacturer_address',
        label: 'Manufacturer / Importer Address',
        ruleRef: 'Rule 6(10)',
        status: 'warning',
        severity: 'minor',
        found: 'Nestlé India Ltd, New Delhi',
        required: 'Complete manufacturer name & office address',
        fontSizeMm: 2.1,
        fontRequiredMm: 2.0,
        notes: 'Partial address listed without street details.',
      },
      {
        id: 'customer_care',
        label: 'Customer Care Details',
        ruleRef: 'Rule 6(10)',
        status: 'compliant',
        severity: null,
        found: '1800-266-1188 / wecare@in.nestle.com',
        required: 'Phone & Email details',
        fontSizeMm: 2.8,
        fontRequiredMm: 2.0,
        notes: 'Valid helpline number listed on PDP.',
      },
    ],
    semanticFlags: [
      'E-commerce listing failed Rule 6(10) mandatory origin check',
      'Selling price misrepresented as original package MRP',
    ],
    officerRecommendation: 'Serve notice to e-commerce marketplace platform for non-compliance under Rule 6(10) of Legal Metrology (Packaged Commodities) Rules. Order correction of PDP listing within 48 hours.',
    certificateEligible: false,
  },
};

export const HANDWASH_DEMO: DemoProduct = {
  id: 'handwash',
  name: 'Generic Herbal Liquid Handwash 250ml',
  subtitle: 'Personal Care Commodity · Liquid Soap Container',
  category: 'Cosmetic / Personal Care',
  imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=600&fit=crop&auto=format',
  boundingBoxes: [
    { id: 'box-h1', fieldId: 'name_of_commodity', label: 'Commodity Title', top: 20, left: 20, width: 60, height: 18, status: 'compliant' },
    { id: 'box-h2', fieldId: 'net_quantity', label: 'Net Volume (250ml)', top: 75, left: 25, width: 50, height: 16, status: 'violation' },
    { id: 'box-h3', fieldId: 'mrp', label: 'MRP & Date', top: 55, left: 20, width: 60, height: 16, status: 'violation' },
  ],
  result: {
    productName: 'Generic Herbal Liquid Handwash 250ml',
    overallCompliant: false,
    complianceScore: 38,
    violationCount: { critical: 2, major: 3, minor: 1 },
    processingTimeMs: 44000,
    barcodeCalibration: {
      detected: true,
      pixelWidth: 275,
      mmPerPx: 0.0941,
      confidence: 91.5,
    },
    fields: [
      {
        id: 'name_of_commodity',
        label: 'Generic Name of Commodity',
        ruleRef: 'Rule 6(1)(a)',
        status: 'compliant',
        severity: null,
        found: 'Liquid Handwash',
        required: 'Common name of commodity',
        fontSizeMm: 4.2,
        fontRequiredMm: 3.0,
        notes: 'Compliant product name declaration.',
      },
      {
        id: 'net_quantity',
        label: 'Net Quantity Declaration',
        ruleRef: 'Rule 6(1)(c)',
        status: 'violation',
        severity: 'critical',
        found: '250 ML (incorrect casing)',
        required: 'Must use "ml" or "mL" in lower case per SI standard',
        fontSizeMm: 2.2,
        fontRequiredMm: 4.0,
        notes: 'CRITICAL VIOLATION: Font size 2.2mm is far below required 4.0mm for 250ml volume. Non-standard unit casing "ML".',
      },
      {
        id: 'mrp',
        label: 'Maximum Retail Price (MRP)',
        ruleRef: 'Rule 6(1)(e)',
        status: 'violation',
        severity: 'critical',
        found: 'Rs 99/- (missing tax phrase)',
        required: 'Must state "MRP ₹ 99.00 (incl. of all taxes)"',
        fontSizeMm: 1.9,
        fontRequiredMm: 3.0,
        notes: 'CRITICAL VIOLATION: Missing mandatory ₹ symbol and tax inclusive clause. Font size 1.9mm vs 3.0mm threshold.',
      },
      {
        id: 'date_of_manufacture',
        label: 'Month & Year of Manufacture',
        ruleRef: 'Rule 6(1)(d)',
        status: 'violation',
        severity: 'major',
        found: 'Mfg: Aug 26 (ambiguous year format)',
        required: 'Must state Month & 4-digit Year (08/2026)',
        fontSizeMm: 1.8,
        fontRequiredMm: 2.0,
        notes: 'MAJOR VIOLATION: Ambiguous 2-digit year format on chemical/personal care product.',
      },
      {
        id: 'manufacturer_address',
        label: 'Manufacturer Address',
        ruleRef: 'Rule 6(1)(b)',
        status: 'violation',
        severity: 'major',
        found: 'Mfd by HerbalCare, MIDC Industrial Area',
        required: 'Full postal address with city, state & pincode',
        fontSizeMm: 1.7,
        fontRequiredMm: 2.0,
        notes: 'MAJOR VIOLATION: Incomplete address lacking city name, state, and 6-digit pincode.',
      },
      {
        id: 'customer_care',
        label: 'Consumer Care Contact',
        ruleRef: 'Rule 6(2)',
        status: 'violation',
        severity: 'major',
        found: 'Missing consumer care details',
        required: 'Name, Address, Phone, Email of grievance officer',
        fontSizeMm: null,
        fontRequiredMm: 2.0,
        notes: 'MAJOR VIOLATION: No consumer grievance contact details printed on container.',
      },
    ],
    semanticFlags: [
      'Multiple critical font height violations under Rule 6(1)',
      'Missing consumer grievance contact details',
      'Incomplete manufacturer postal address',
    ],
    officerRecommendation: 'SEIZURE & FORFEITURE RECOMMENDED under Section 15 of Legal Metrology Act 2009. Issue stop-sale order to distributor due to multiple critical declaration failures.',
    certificateEligible: false,
  },
};

export const DEMO_PRODUCTS_MAP: Record<string, DemoProduct> = {
  'parle-g': PARLE_G_DEMO,
  'maggi': MAGGI_DEMO,
  'handwash': HANDWASH_DEMO,
};

export const MOCK_SCAN_RESULT = PARLE_G_DEMO.result;
export const MOCK_MAGGI = MAGGI_DEMO.result;
export const MOCK_HANDWASH = HANDWASH_DEMO.result;

export const RECENT_SCANS = [
  { id: 'TKS-26-8912', product: 'Parle-G Glucose Biscuits 200g', track: 'Physical Scan', officer: 'Inspector Rajesh Kumar', time: '10 mins ago', score: 74, status: 'violation' as const, violations: { critical: 0, major: 1, minor: 2 } },
  { id: 'TKS-26-8911', product: 'Maggi 2-Minute Noodles 70g', track: 'E-Commerce URL', officer: 'Inspector Priya Sharma', time: '28 mins ago', score: 68, status: 'violation' as const, violations: { critical: 1, major: 1, minor: 1 } },
  { id: 'TKS-26-8910', product: 'Amul Butter 500g Carton', track: 'Manufacturer', officer: 'Inspector Amit Verma', time: '1 hr ago', score: 98, status: 'compliant' as const, violations: { critical: 0, major: 0, minor: 0 } },
  { id: 'TKS-26-8909', product: 'Generic Herbal Liquid Handwash', track: 'Physical Scan', officer: 'Inspector Rajesh Kumar', time: '2 hrs ago', score: 38, status: 'violation' as const, violations: { critical: 2, major: 3, minor: 1 } },
  { id: 'TKS-26-8908', product: 'Tata Salt Vaccum Evaporated 1kg', track: 'Physical Scan', officer: 'Inspector Sneha Patel', time: '3 hrs ago', score: 95, status: 'compliant' as const, violations: { critical: 0, major: 0, minor: 0 } },
  { id: 'TKS-26-8907', product: 'Dabur Honey 250g Glass Jar', track: 'Manufacturer', officer: 'Inspector Amit Verma', time: '4 hrs ago', score: 91, status: 'compliant' as const, violations: { critical: 0, major: 0, minor: 1 } },
];

export const VIOLATION_BY_FIELD = [
  { field: 'MRP Declaration', count: 68 },
  { field: 'Net Quantity', count: 54 },
  { field: 'Mfr. Address', count: 48 },
  { field: 'Font Size', count: 42 },
  { field: 'Expiry Date', count: 38 },
  { field: 'Country of Origin', count: 31 },
  { field: 'Customer Care', count: 28 },
  { field: 'Others', count: 33 },
];

export const SCAN_DISTRIBUTION = [
  { name: 'Physical Scan', value: 58, color: '#EA580C' },
  { name: 'E-Commerce', value: 28, color: '#15803D' },
  { name: 'Manufacturer', value: 14, color: '#0F172A' },
];

export function generateDailyData() {
  const data = [];
  for (let i = 30; i >= 1; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    data.push({
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      scans: Math.floor(30 + Math.random() * 25),
      violations: Math.floor(8 + Math.random() * 10),
    });
  }
  return data;
}
