import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ScanResult } from '@/types/compliance';

export function generatePDFReport(result: ScanResult, scanId: string) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();

  // ── PAGE 1: Header + Verdict ──────────────────────────────
  // Header bar
  doc.setFillColor(7, 11, 20);
  doc.rect(0, 0, w, 297, 'F');

  doc.setFillColor(249, 115, 22);
  doc.rect(0, 0, w, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(249, 115, 22);
  doc.text('MetroScan AI', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('Legal Metrology Compliance Report', 14, 25);
  doc.text('Government of India · Ministry of Consumer Affairs', 14, 31);
  doc.text(`Smart India Hackathon 2026 · PS #26034 · Team Takshak`, 14, 37);

  doc.setTextColor(148, 163, 184);
  doc.text(scanId, w - 14, 18, { align: 'right' });
  doc.text(new Date().toLocaleString('en-IN'), w - 14, 25, { align: 'right' });

  // Divider
  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(0.3);
  doc.line(14, 43, w - 14, 43);

  // Verdict box
  const isCompliant = result.overallCompliant;
  const hasWarnings = !isCompliant && result.violationCount.critical === 0 && result.violationCount.major === 0;
  const bgColor = isCompliant ? [22, 163, 74] : hasWarnings ? [217, 119, 6] : [220, 38, 38];
  const verdict = isCompliant ? 'COMPLIANT ✓' : hasWarnings ? 'COMPLIANT WITH WARNINGS ⚠' : 'NON-COMPLIANT ✗';

  doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
  doc.roundedRect(14, 48, w - 28, 18, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(verdict, w / 2, 60, { align: 'center' });

  // Product info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(241, 245, 249);
  doc.text(result.productName, 14, 76);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Compliance Score: ${result.complianceScore}/100`, 14, 84);
  doc.text(`Rule Set: LM (PC) Rules 2011 + 2017 Amendment`, 14, 90);
  doc.text(`Processing Time: ${(result.processingTimeMs / 1000).toFixed(1)}s`, 14, 96);
  doc.text(`Barcode: ${result.barcodeCalibration.detected ? `EAN-13 · ${result.barcodeCalibration.mmPerPx.toFixed(4)} mm/px · ${result.barcodeCalibration.confidence}% confidence` : 'Not detected'}`, 14, 102);

  // Violation summary
  doc.setFillColor(22, 32, 53);
  doc.roundedRect(14, 108, w - 28, 22, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(220, 38, 38);
  doc.text(`Critical: ${result.violationCount.critical}`, 30, 122);
  doc.setTextColor(217, 119, 6);
  doc.text(`Major: ${result.violationCount.major}`, w / 2, 122, { align: 'center' });
  doc.setTextColor(148, 163, 184);
  doc.text(`Minor: ${result.violationCount.minor}`, w - 30, 122, { align: 'right' });

  // Recommendation
  doc.setFillColor(14, 21, 37);
  doc.roundedRect(14, 135, w - 28, 40, 3, 3, 'F');
  doc.setFillColor(249, 115, 22);
  doc.rect(14, 135, 3, 40, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(249, 115, 22);
  doc.text('OFFICER RECOMMENDATION', 22, 143);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  const lines = doc.splitTextToSize(result.officerRecommendation, w - 46);
  doc.text(lines, 22, 150);

  // AI disclaimer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('AI-generated report. Officer discretion applies.', 22, 173);

  // ── PAGE 2: Field Analysis Table ────────────────────────
  doc.addPage();
  doc.setFillColor(7, 11, 20);
  doc.rect(0, 0, w, 297, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(241, 245, 249);
  doc.text('Rule 6 Field Analysis', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Detailed compliance check for all 12 mandatory declarations under LM (PC) Rules 2011', 14, 27);

  autoTable(doc, {
    startY: 33,
    head: [['#', 'Field', 'Rule Ref', 'Status', 'Found', 'Font (mm)', 'Notes']],
    body: result.fields.map((f, i) => [
      i + 1,
      f.label,
      f.ruleRef,
      f.status.toUpperCase(),
      f.found.substring(0, 30) + (f.found.length > 30 ? '…' : ''),
      f.fontSizeMm ? `${f.fontSizeMm}mm` : 'N/A',
      f.notes.substring(0, 60) + (f.notes.length > 60 ? '…' : ''),
    ]),
    styles: {
      fillColor: [14, 21, 37],
      textColor: [148, 163, 184],
      fontSize: 7,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [22, 32, 53],
      textColor: [249, 115, 22],
      fontStyle: 'bold',
      fontSize: 7,
    },
    alternateRowStyles: { fillColor: [7, 11, 20] },
    columnStyles: {
      0: { cellWidth: 8 },
      3: { cellWidth: 20 },
      5: { cellWidth: 15 },
    },
    didDrawCell: (data) => {
      if (data.column.index === 3 && data.section === 'body') {
        const val = String(data.cell.raw || '').toLowerCase();
        if (val === 'violation') data.cell.styles.textColor = [220, 38, 38];
        else if (val === 'warning') data.cell.styles.textColor = [217, 119, 6];
        else if (val === 'compliant') data.cell.styles.textColor = [22, 163, 74];
      }
    },
  });

  // ── PAGE 3: Certificate Status ────────────────────────
  doc.addPage();
  doc.setFillColor(7, 11, 20);
  doc.rect(0, 0, w, 297, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(241, 245, 249);
  doc.text('Certificate Status', 14, 20);

  if (result.certificateEligible) {
    doc.setFillColor(14, 83, 45);
    doc.roundedRect(14, 28, w - 28, 100, 5, 5, 'F');
    doc.setFillColor(22, 163, 74);
    doc.rect(14, 28, 3, 100, 'F');
    doc.setTextColor(74, 222, 128);
    doc.setFontSize(16);
    doc.text('ELIGIBLE FOR CERTIFICATE ✓', w / 2, 60, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('This product label design is compliant with all mandatory', w / 2, 72, { align: 'center' });
    doc.text('declarations under LM (PC) Rules 2011 + 2017 Amendment.', w / 2, 79, { align: 'center' });
  } else {
    doc.setFillColor(127, 29, 29);
    doc.roundedRect(14, 28, w - 28, 60, 5, 5, 'F');
    doc.setTextColor(248, 113, 113);
    doc.setFontSize(13);
    doc.text('NOT ELIGIBLE FOR CERTIFICATE ✗', w / 2, 50, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('Resolve all Critical and Major violations to obtain certificate.', w / 2, 62, { align: 'center' });
  }

  // Semantic flags
  if (result.semanticFlags.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(241, 245, 249);
    doc.text('Semantic Validation Flags', 14, 145);
    result.semanticFlags.forEach((flag, i) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(251, 191, 36);
      doc.text(`⚠ ${flag}`, 14, 155 + i * 10);
    });
  }

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Powered by PaddleOCR-VL 1.5 · Mistral-7B · YOLOv11 · MetroScan AI v2.1.0', w / 2, 280, { align: 'center' });
  doc.text('Made for Government of India · Ministry of Consumer Affairs, Food & Public Distribution', w / 2, 286, { align: 'center' });

  // Save
  const productSlug = result.productName.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`MetroScan_Report_${productSlug}_${dateStr}.pdf`);
}
