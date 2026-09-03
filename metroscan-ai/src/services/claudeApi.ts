import { ScanResult } from '@/types/compliance';
import { MOCK_SCAN_RESULT } from '@/data/mockData';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

export async function runComplianceCheck(
  productName?: string,
  uploadType: string = 'physical'
): Promise<ScanResult> {
  if (!API_KEY) {
    console.warn('No API key — using mock data');
    await new Promise(r => setTimeout(r, 1000));
    return MOCK_SCAN_RESULT;
  }

  try {
    const prompt = `You are MetroScan AI, an automated Legal Metrology compliance officer for India. A product label has been scanned.

Product context: ${productName || 'Unknown packaged commodity'}.
Upload type: ${uploadType} (physical/ecommerce/manufacturer).

Simulate a realistic, detailed compliance check under Legal Metrology (Packaged Commodities) Rules 2011 + 2017 amendment for a typical Indian FMCG product.

Return ONLY a valid JSON object (no markdown, no preamble) with this exact structure:
{
  "productName": "string — inferred product name",
  "overallCompliant": boolean,
  "complianceScore": number (0-100),
  "violationCount": { "critical": number, "major": number, "minor": number },
  "processingTimeMs": number (between 35000 and 58000),
  "barcodeCalibration": {
    "detected": true,
    "pixelWidth": number (250-400),
    "mmPerPx": number (0.06-0.12, 4 decimal places),
    "confidence": number (85-99)
  },
  "fields": [
    {
      "id": "name_of_commodity",
      "label": "Name of Commodity",
      "ruleRef": "Rule 6(1)",
      "status": "compliant",
      "severity": null,
      "found": "string",
      "required": "string",
      "fontSizeMm": 5.2,
      "fontRequiredMm": 3.0,
      "notes": "string"
    }
  ],
  "semanticFlags": ["string"],
  "officerRecommendation": "string — 2-3 sentence enforcement recommendation",
  "certificateEligible": boolean
}

Include all 12 fields: name_of_commodity, net_quantity, mrp, date_of_manufacture, best_before, manufacturer_address, country_of_origin, customer_care, consumer_complaint_address, common_name, quantity_dimensions, fssai_number.

Make it realistic: most products have 1-3 violations. Use specific believable values. Vary severity across fields.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 2000,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are MetroScan AI. Always respond with valid JSON only. No markdown, no explanation.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    const result = JSON.parse(text) as ScanResult;
    return result;
  } catch (err) {
    console.error('OpenAI API failed, using mock:', err);
    return MOCK_SCAN_RESULT;
  }
}
