import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Send, ShieldCheck, ShieldAlert, ArrowLeft, Target, Scale, FileText, CheckCircle2 } from 'lucide-react';
import { useScanContext } from '@/hooks/useScanContext';
import { DEMO_PRODUCTS_MAP, PARLE_G_DEMO, BoundingBox } from '@/data/mockData';
import ComplianceScore from '@/components/ui/ComplianceScore';
import FieldAccordion from '@/components/ui/FieldAccordion';
import { generatePDFReport } from '@/components/ui/PDFReportGenerator';
import toast from 'react-hot-toast';

export default function Results() {
  const { scanResult, selectedDemoId } = useScanContext();
  const navigate = useNavigate();
  const [activeBoxId, setActiveBoxId] = useState<string | null>(null);

  // Retrieve matching demo product for real image and bounding boxes
  const demoProduct = DEMO_PRODUCTS_MAP[selectedDemoId] || PARLE_G_DEMO;
  const result = scanResult || demoProduct.result;

  const scanId = useMemo(() => `TKS-26-${Math.floor(1000 + Math.random() * 9000)}`, []);
  const now = useMemo(() => new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }), []);

  const handleDownloadPDF = () => {
    try {
      generatePDFReport(result, scanId);
      toast.success('Official PDF Compliance Certificate downloaded!');
    } catch (e) {
      toast.error('PDF generation failed.');
    }
  };

  const isCompliant = result.overallCompliant;
  const hasCritical = result.violationCount.critical > 0;
  const hasMajor = result.violationCount.major > 0;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingTop: 64 }}>
      <div className="max-w-content" style={{ paddingTop: 24, paddingBottom: 64 }}>
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <button
            className="btn-outline"
            style={{ padding: '8px 16px', fontSize: '0.8125rem' }}
            onClick={() => navigate('/scan')}
          >
            <ArrowLeft size={16} /> Perform New Label Inspection
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
            <span>Case Ref: <strong style={{ color: 'var(--saffron)' }}>{scanId}</strong></span>
            <span>·</span>
            <span>Audited: {now}</span>
          </div>
        </div>

        {/* ── OFFICIAL VERDICT BANNER ── */}
        <div style={{
          background: isCompliant ? 'var(--india-green-bg)' : hasCritical ? 'var(--crimson-bg)' : 'var(--amber-bg)',
          border: `1.5px solid ${isCompliant ? 'rgba(21, 128, 61, 0.3)' : hasCritical ? 'rgba(220, 38, 38, 0.3)' : 'rgba(217, 119, 6, 0.3)'}`,
          borderRadius: 16, padding: '20px 28px',
          marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: '#FFFFFF', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {isCompliant
                ? <ShieldCheck size={26} color="var(--india-green)" />
                : <ShieldAlert size={26} color={hasCritical ? 'var(--crimson)' : 'var(--amber)'} />
              }
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: isCompliant ? 'var(--india-green)' : hasCritical ? 'var(--crimson)' : 'var(--amber)' }}>
                Official Legal Metrology Inspection Audit
              </div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.35rem', color: 'var(--navy-dark)', marginTop: 2 }}>
                {isCompliant
                  ? 'FULL COMPLIANCE VERIFIED ✓'
                  : hasCritical
                  ? 'NON-COMPLIANT · CRITICAL VIOLATION DETECTED ✗'
                  : 'CONDITIONALLY COMPLIANT WITH WARNINGS ⚠'
                }
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Framework: Legal Metrology (Packaged Commodities) Rules, 2011 &amp; 2017 Amendments
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }} onClick={handleDownloadPDF}>
              <Download size={16} /> Official Certificate PDF
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 32 }} className="results-grid">

          {/* ── LEFT COLUMN: Interactive Label Inspector ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--navy-dark)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Outfit' }}>
                High-Res Label OCR Inspector
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--saffron)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Target size={13} /> Interactive OCR Maps
              </span>
            </div>

            {/* Product Label Container with Bounding Box overlays */}
            <div style={{
              borderRadius: 16, overflow: 'hidden', background: '#FFFFFF',
              border: '1px solid var(--border)', marginBottom: 16, position: 'relative',
              boxShadow: 'var(--shadow-md)',
            }}>
              <img
                src={demoProduct.imageUrl}
                alt={result.productName}
                style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block', background: '#F8FAFC' }}
              />

              {/* Bounding Box Overlays */}
              {demoProduct.boundingBoxes.map((box: BoundingBox, i: number) => {
                const isActive = activeBoxId === box.fieldId;
                const isViol = box.status === 'violation';
                const isWarn = box.status === 'warning';
                const color = isViol ? '#DC2626' : isWarn ? '#D97706' : '#15803D';
                const bg = isViol ? 'rgba(220, 38, 38, 0.2)' : isWarn ? 'rgba(217, 119, 6, 0.2)' : 'rgba(21, 128, 61, 0.2)';

                return (
                  <motion.div
                    key={box.id}
                    onMouseEnter={() => setActiveBoxId(box.fieldId)}
                    onMouseLeave={() => setActiveBoxId(null)}
                    style={{
                      position: 'absolute',
                      top: `${box.top}%`,
                      left: `${box.left}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                      border: `2px solid ${color}`,
                      background: isActive ? `${color}40` : bg,
                      borderRadius: 6,
                      cursor: 'pointer',
                      boxShadow: isActive ? `0 0 16px ${color}` : 'none',
                      transition: 'all 0.2s ease',
                      zIndex: isActive ? 20 : 10,
                    }}
                  >
                    <span style={{
                      position: 'absolute', top: -10, left: -10,
                      background: color, color: '#FFFFFF',
                      width: 20, height: 20, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 800, fontFamily: 'Outfit',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    }}>
                      {i + 1}
                    </span>

                    {/* Active tooltip */}
                    {isActive && (
                      <div style={{
                        position: 'absolute', bottom: '105%', left: '50%', transform: 'translateX(-50%)',
                        background: '#0F172A', color: '#FFFFFF', padding: '6px 10px', borderRadius: 6,
                        fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', zIndex: 30,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)', pointerEvents: 'none',
                      }}>
                        {box.label} ({box.status.toUpperCase()})
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Grid overlay lines for Ruler Calibration effect */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'linear-gradient(rgba(234, 88, 12, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(234, 88, 12, 0.04) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }} />
            </div>

            {/* Barcode Scale Calibration Widget */}
            <div style={{
              background: '#FFFFFF', border: '1px solid var(--border)',
              borderRadius: 14, padding: '14px 18px', marginBottom: 20,
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Scale size={16} color="var(--saffron)" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--navy-dark)', fontFamily: 'Outfit' }}>
                  Barcode-as-Ruler Scale Ratio
                </span>
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#F8FAFC', padding: '10px 14px', borderRadius: 8,
                border: '1px solid var(--border)', fontSize: '0.78rem', fontFamily: 'JetBrains Mono',
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Ratio: </span>
                  <strong style={{ color: 'var(--saffron)' }}>{result.barcodeCalibration.mmPerPx.toFixed(4)} mm/px</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Accuracy: </span>
                  <strong style={{ color: 'var(--india-green)' }}>{result.barcodeCalibration.confidence}% GS1 Match</strong>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
                onClick={handleDownloadPDF}
              >
                <Download size={18} /> Download Official PDF Certificate
              </button>
              <button
                className="btn-outline"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                onClick={() => {
                  toast.success('Official Enforcement Notice dispatched to District Legal Inspector.');
                  navigate('/dashboard');
                }}
              >
                <Send size={16} /> Submit Formal Notice to District Inspector
              </button>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Detailed Compliance Audit ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Product Title + Score Card */}
            <div className="glass-card" style={{ padding: 24, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--saffron)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  {demoProduct.category}
                </div>
                <h2 className="text-h2" style={{ marginBottom: 6, color: 'var(--navy-dark)' }}>{result.productName}</h2>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{demoProduct.subtitle}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ComplianceScore score={result.complianceScore} size={110} />
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: 4 }}>Compliance Index</div>
              </div>
            </div>

            {/* Violation Summary Chips */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Critical Issues', count: result.violationCount.critical, color: 'var(--crimson)', bg: 'var(--crimson-bg)', border: 'rgba(220,38,38,0.3)' },
                { label: 'Major Issues', count: result.violationCount.major, color: 'var(--amber)', bg: 'var(--amber-bg)', border: 'rgba(217,119,6,0.3)' },
                { label: 'Minor Warnings', count: result.violationCount.minor, color: 'var(--text-muted)', bg: '#F1F5F9', border: 'var(--border)' },
              ].map(v => (
                <div key={v.label} style={{
                  padding: '14px 16px', borderRadius: 12,
                  background: v.bg, border: `1px solid ${v.border}`,
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.5rem', fontWeight: 800, color: v.color, lineHeight: 1 }}>
                    {v.count}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--navy-dark)', fontWeight: 700, marginTop: 4 }}>{v.label}</div>
                </div>
              ))}
            </div>

            {/* Field Verification Header */}
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="text-h3" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={18} color="var(--saffron)" /> Rule 6 Field Declarations Audit
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
                12 Declarations Scanned
              </span>
            </div>

            {/* Field Accordions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {result.fields.map((field, i) => (
                <div
                  key={field.id}
                  onMouseEnter={() => setActiveBoxId(field.id)}
                  onMouseLeave={() => setActiveBoxId(null)}
                >
                  <FieldAccordion field={field} index={i} />
                </div>
              ))}
            </div>

            {/* Semantic Flags */}
            {result.semanticFlags && result.semanticFlags.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Semantic AI Discrepancies Flagged
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {result.semanticFlags.map((flag, i) => (
                    <span key={i} style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700,
                      background: 'var(--amber-bg)', border: '1px solid rgba(217,119,6,0.3)',
                      color: 'var(--amber)',
                    }}>
                      ⚠ {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Inspector Recommendation Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid var(--border)', borderLeft: '4px solid var(--saffron)',
              borderRadius: '0 14px 14px 0', padding: '18px 22px', marginBottom: 24,
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--saffron)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Official Enforcement Action Plan
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--navy-dark)', lineHeight: 1.65, fontWeight: 500 }}>
                {result.officerRecommendation}
              </p>
            </div>

            {/* Certificate Status Badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
              borderRadius: 14,
              background: result.certificateEligible ? 'var(--india-green-bg)' : 'var(--crimson-bg)',
              border: `1px solid ${result.certificateEligible ? 'rgba(21, 128, 61, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`,
            }}>
              {result.certificateEligible
                ? <CheckCircle2 size={22} color="var(--india-green)" />
                : <ShieldAlert size={22} color="var(--crimson)" />
              }
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: result.certificateEligible ? 'var(--india-green)' : 'var(--crimson)' }}>
                {result.certificateEligible
                  ? 'Pre-Print Clearance Certificate: ELIGIBLE — Approved for Manufacturing'
                  : 'Pre-Print Clearance: DENIED — Mandatory violations must be rectified prior to production.'
                }
              </span>
            </div>

          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .results-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
