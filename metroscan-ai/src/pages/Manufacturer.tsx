import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShieldX, Download, Building2, ChevronRight, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import UploadZone from '@/components/ui/UploadZone';
import PipelineStep from '@/components/ui/PipelineStep';
import { Settings2, ScanText, ClipboardCheck } from 'lucide-react';
import { MOCK_SCAN_RESULT } from '@/data/mockData';
import { generatePDFReport } from '@/components/ui/PDFReportGenerator';
import toast from 'react-hot-toast';

type StepState = 'pending' | 'active' | 'done';

const INLINE_STEPS = [
  { icon: Settings2, title: 'Label Preprocessing & OCR', desc: 'Extracting all 12 mandatory fields using PaddleOCR-VL 1.5' },
  { icon: ScanText, title: 'Rule 6 Compliance Engine', desc: 'Validating declarations against Packaged Commodities Rules 2011' },
  { icon: ClipboardCheck, title: 'Digital Certificate Clearance', desc: 'Issuing official Government Pre-Print Compliance Certificate' },
];

export default function Manufacturer() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [gstin, setGstin] = useState('');
  const [company, setCompany] = useState('');
  const [product, setProduct] = useState('');
  const [netQty, setNetQty] = useState('');
  const [fssai, setFssai] = useState('');
  const [certFor, setCertFor] = useState('Retailer Distribution Clearance');
  const [processing, setProcessing] = useState(false);
  const [pipelineStates, setPipelineStates] = useState<StepState[]>(['pending', 'pending', 'pending']);
  const [result, setResult] = useState<typeof MOCK_SCAN_RESULT | null>(null);
  const [certNo] = useState(`MSLM-2026-${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [officerName, setOfficerName] = useState('Inspector Rajesh Kumar');
  const [badgeId, setBadgeId] = useState('MH-LM-4029');

  const navigate = useNavigate();
  const sidebarWidth = sidebarCollapsed ? 68 : 240;

  const runCheck = () => {
    if (!file) { toast.error('Please upload a high-resolution label design image first.'); return; }
    if (!company || !product) { toast.error('Please enter Manufacturer Company Name and Product Name.'); return; }

    setProcessing(true);
    setPipelineStates(['active', 'pending', 'pending']);

    setTimeout(() => setPipelineStates(['done', 'active', 'pending']), 2500);
    setTimeout(() => setPipelineStates(['done', 'done', 'active']), 5000);
    setTimeout(() => {
      setPipelineStates(['done', 'done', 'done']);
      setResult(MOCK_SCAN_RESULT);
      setProcessing(false);
      toast.success('Official Pre-Print Certificate issued successfully!');
    }, 7500);
  };

  return (
    <div style={{ display: 'flex', background: 'var(--bg-base)', minHeight: '100vh' }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        officerName={officerName}
        badgeId={badgeId}
        onUpdateOfficer={(name, badge) => {
          setOfficerName(name);
          setBadgeId(badge);
          toast.success(`Inspector authenticated: ${name}`);
        }}
      />

      <div style={{ marginLeft: sidebarWidth, flex: 1, transition: 'margin-left 0.25s ease', minWidth: 0 }}>
        {/* Top Sticky Bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          padding: '12px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/')}
            className="btn-outline"
            style={{ padding: '7px 16px', fontSize: '0.8125rem' }}
          >
            <ArrowLeft size={16} /> Back to Home Page
          </button>

          {/* Active Officer Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FFF7ED', border: '1px solid rgba(234, 88, 12, 0.3)',
              padding: '6px 14px', borderRadius: 20,
              fontSize: '0.78rem', color: 'var(--saffron)', fontWeight: 700,
            }}>
              <ShieldCheck size={14} color="var(--saffron)" />
              {officerName} ({badgeId}) · Clearance Officer
            </div>
          </div>
        </div>

        <div style={{ padding: '32px 32px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}>
            <Building2 size={14} />
            <ChevronRight size={12} />
            <span style={{ color: 'var(--navy-dark)' }}>Manufacturer Portal</span>
          </div>
          <h1 className="text-h1" style={{ marginBottom: 4 }}>Manufacturer Pre-Print Label Verification</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.9rem' }}>
            Submit label artwork for automated compliance check under LM (PC) Rules 2011 before commercial printing
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 28 }} className="mfg-grid">
            {/* LEFT: Form Steps */}
            <div>
              {/* Step 1: Company Details */}
              <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--saffron)', color: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.875rem', fontWeight: 800, fontFamily: 'Outfit',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)',
                  }}>1</div>
                  <h3 className="text-h3">Manufacturer GST &amp; Registration Context</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { label: 'GSTIN Number', ph: '27AAAAA0000A1Z5', val: gstin, set: setGstin },
                    { label: 'Manufacturer Name', ph: 'ABC Foods Pvt. Ltd.', val: company, set: setCompany },
                    { label: 'Commodity / Product Name', ph: 'Glucose Biscuits 200g', val: product, set: setProduct },
                    { label: 'Declared Net Quantity', ph: '200g', val: netQty, set: setNetQty },
                    { label: 'FSSAI License No. (Optional)', ph: '14-digit number', val: fssai, set: setFssai },
                  ].map(f => (
                    <div key={f.label} style={{ gridColumn: f.label === 'Manufacturer Name' || f.label === 'FSSAI License No. (Optional)' ? 'span 2' : 'auto' }}>
                      <label style={{ fontSize: '0.78rem', color: 'var(--navy-dark)', fontWeight: 700, display: 'block', marginBottom: 5 }}>{f.label}</label>
                      <input className="input-base" placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--navy-dark)', fontWeight: 700, display: 'block', marginBottom: 5 }}>Intended Purpose</label>
                    <select className="input-base" value={certFor} onChange={e => setCertFor(e.target.value)}>
                      <option>Retailer Distribution Clearance</option>
                      <option>Distributor Supply Chain Audit</option>
                      <option>Pre-Print Packaging Sign-off</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Artwork Upload */}
              <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: file ? 'var(--saffron)' : '#E2E8F0', color: file ? '#FFFFFF' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.875rem', fontWeight: 800, fontFamily: 'Outfit',
                    flexShrink: 0,
                  }}>2</div>
                  <h3 className="text-h3">Upload Package Label Artwork</h3>
                </div>
                <UploadZone onFileSelect={setFile} selectedFile={file} onClear={() => setFile(null)} hint="Accepts PNG, High-res JPG, PDF design files up to 15MB" />
              </div>

              {/* Step 3: Action & Pipeline */}
              <div className="glass-card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: result ? 'var(--india-green)' : '#E2E8F0', color: result ? '#FFFFFF' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.875rem', fontWeight: 800, fontFamily: 'Outfit',
                    flexShrink: 0,
                  }}>3</div>
                  <h3 className="text-h3">Verification &amp; Digital Clearance</h3>
                </div>

                {!processing && !result && (
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 15, fontSize: '0.95rem' }} onClick={runCheck}>
                    Verify Design &amp; Generate Certificate
                  </button>
                )}

                {processing && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {INLINE_STEPS.map((s, i) => (
                      <PipelineStep
                        key={i}
                        stepNumber={i + 1}
                        title={s.title}
                        description={s.desc}
                        state={pipelineStates[i]}
                        icon={s.icon}
                        isLast={i === INLINE_STEPS.length - 1}
                      />
                    ))}
                  </div>
                )}

                {result && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'var(--india-green-bg)', borderRadius: 12, border: '1px solid rgba(21, 128, 61, 0.3)' }}>
                    <CheckCircle size={18} color="var(--india-green)" />
                    <span style={{ color: 'var(--india-green)', fontWeight: 700, fontSize: '0.875rem' }}>Certificate Generated &amp; Logged on NIC Cloud!</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Certificate Display */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                Digital Pre-Print Certificate
              </div>

              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div
                    key="placeholder"
                    className="glass-card"
                    style={{ padding: 36, textAlign: 'center', minHeight: 460, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#F8FAFC', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                      <Building2 size={30} color="var(--text-muted)" />
                    </div>
                    <h3 className="text-h3" style={{ marginBottom: 6 }}>No Certificate Generated Yet</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 280 }}>
                      Complete manufacturer registration and upload label artwork to generate an official digital clearance certificate.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cert"
                    className="certificate-card"
                    style={{ padding: 32, minHeight: 520 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  >
                    {/* GOI Header */}
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--saffron)' }}>
                        GOVERNMENT OF INDIA
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--navy-dark)', fontWeight: 700, letterSpacing: '0.02em', marginTop: 2 }}>
                        Ministry of Consumer Affairs, Food &amp; Public Distribution
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Legal Metrology Directorate · Digital Clearance Portal
                      </div>
                      <div style={{ height: 3, background: 'linear-gradient(90deg, #EA580C, #15803D)', borderRadius: 2, marginTop: 12 }} />
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      <div style={{ fontFamily: 'Outfit', fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: 8 }}>
                        Certificate of Pre-Print Compliance
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        This certifies that the label design submitted by{' '}
                        <strong style={{ color: 'var(--navy-dark)' }}>{company || 'ABC Foods Pvt. Ltd.'}</strong>{' '}
                        for product{' '}
                        <strong style={{ color: 'var(--navy-dark)' }}>{product || 'Glucose Biscuits 200g'}</strong>{' '}
                        has been verified under Legal Metrology (Packaged Commodities) Rules 2011.
                      </div>
                    </div>

                    <div style={{ background: '#F8FAFC', borderRadius: 12, border: '1px solid var(--border)', padding: '16px 18px', marginBottom: 24 }}>
                      {[
                        { label: 'Certificate No', value: certNo },
                        { label: 'Authorized Inspector', value: officerName },
                        { label: 'Validity Period', value: '90 days from date of issue' },
                        { label: 'Issue Date', value: new Date().toLocaleDateString('en-IN', { dateStyle: 'long' }) },
                        { label: 'Verification Method', value: 'MetroScan AI · Rule 6 Certified' },
                      ].map(row => (
                        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{row.label}:</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--navy-dark)', fontFamily: 'JetBrains Mono', fontWeight: 700, textAlign: 'right' }}>{row.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* QR block */}
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                      <div style={{
                        display: 'inline-block', padding: 10, background: '#FFFFFF', borderRadius: 10,
                        border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                      }}>
                        <div style={{
                          width: 84, height: 84,
                          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1,
                        }}>
                          {Array.from({ length: 49 }).map((_, i) => (
                            <div key={i} style={{ background: Math.random() > 0.5 ? '#0F172A' : '#FFFFFF', aspectRatio: '1' }} />
                          ))}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 6, fontWeight: 600 }}>Scan QR to verify digital authenticity</div>
                    </div>

                    <button
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '12px' }}
                      onClick={() => { generatePDFReport(MOCK_SCAN_RESULT, certNo); toast.success('Official Certificate Downloaded!'); }}
                    >
                      <Download size={16} /> Download Official PDF Certificate
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .mfg-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
