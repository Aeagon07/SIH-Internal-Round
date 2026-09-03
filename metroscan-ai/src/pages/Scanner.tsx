import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Globe, Factory, AlertCircle, ArrowRight, Home, ChevronRight, Check } from 'lucide-react';
import UploadZone from '@/components/ui/UploadZone';
import { useScanContext } from '@/hooks/useScanContext';
import { ScanInput } from '@/types/compliance';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'physical', label: 'Physical Scan', icon: Camera },
  { id: 'ecommerce', label: 'E-Commerce URL', icon: Globe },
  { id: 'manufacturer', label: 'Manufacturer Upload', icon: Factory },
];

const RULE_SETS = [
  'LM (PC) Rules 2011 (Base)',
  'LM (PC) Rules 2011 + 2015 Amendment',
  'LM (PC) Rules 2011 + 2017 Amendment (Recommended)',
  'LM (PC) Rules 2011 + 2021 Amendment',
];

const EXAMPLE_URLS = [
  { label: 'Amazon Example', url: 'https://www.amazon.in/dp/B09EXAMPLE' },
  { label: 'Flipkart Example', url: 'https://www.flipkart.com/product/EXAMPLE' },
  { label: 'Meesho Example', url: 'https://www.meesho.com/product/EXAMPLE' },
];

export default function Scanner() {
  const [activeTab, setActiveTab] = useState<'physical' | 'ecommerce' | 'manufacturer'>('physical');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [ruleSet, setRuleSet] = useState(RULE_SETS[2]);
  const [ecommerceCtx, setEcommerceCtx] = useState(false);
  const [multiLang, setMultiLang] = useState(true);
  const [skipFont, setSkipFont] = useState(false);
  const [skipOrigin, setSkipOrigin] = useState(false);
  const [semantic, setSemantic] = useState(true);
  const [productName, setProductName] = useState('');
  const [gstin, setGstin] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [netQty, setNetQty] = useState('');
  const [fssai, setFssai] = useState('');
  const [mfgFile, setMfgFile] = useState<File | null>(null);

  const { setScanInput } = useScanContext();
  const navigate = useNavigate();

  const runScan = () => {
    if (activeTab === 'physical' && !selectedFile) {
      toast.error('Please upload a product label image first.');
      return;
    }
    if (activeTab === 'ecommerce' && !url.trim()) {
      toast.error('Please enter a product listing URL.');
      return;
    }
    if (activeTab === 'manufacturer' && !mfgFile) {
      toast.error('Please upload a label artwork file.');
      return;
    }

    const input: ScanInput = {
      type: activeTab,
      imageFile: activeTab === 'physical' ? selectedFile ?? undefined : mfgFile ?? undefined,
      productUrl: activeTab === 'ecommerce' ? url : undefined,
      productName: activeTab === 'manufacturer' ? productName : undefined,
      gstin: activeTab === 'manufacturer' ? gstin : undefined,
      companyName: activeTab === 'manufacturer' ? companyName : undefined,
      netQuantity: activeTab === 'manufacturer' ? netQty : undefined,
      fssaiLic: activeTab === 'manufacturer' ? fssai : undefined,
    };

    setScanInput(input);
    navigate('/processing');
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingTop: 64 }}>
      <div className="max-w-content" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 500 }}>
          <Home size={14} />
          <ChevronRight size={12} />
          <span style={{ color: 'var(--navy-dark)', fontWeight: 600 }}>Compliance Scanner</span>
        </div>

        <h1 className="text-h1" style={{ marginBottom: 6 }}>Compliance Scanner</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.95rem' }}>Select your scan modality and configure rules</p>

        {/* Tab buttons */}
        <div style={{
          display: 'flex', gap: 6, marginBottom: 32,
          background: '#FFFFFF', border: '1px solid var(--border)',
          borderRadius: 14, padding: 6, width: 'fit-content',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 22px', borderRadius: 10, border: 'none',
                  cursor: 'pointer', fontSize: '0.9rem', fontWeight: active ? 700 : 500,
                  fontFamily: 'Space Grotesk',
                  background: active ? 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)' : 'transparent',
                  color: active ? '#FFFFFF' : 'var(--text-secondary)',
                  boxShadow: active ? '0 4px 14px rgba(234, 88, 12, 0.3)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon size={16} color={active ? '#FFFFFF' : 'var(--text-secondary)'} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── TAB 1: Physical ── */}
            {activeTab === 'physical' && (
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 28 }} className="scan-grid">
                <UploadZone
                  onFileSelect={setSelectedFile}
                  selectedFile={selectedFile}
                  onClear={() => setSelectedFile(null)}
                />
                <div className="glass-card" style={{ padding: 28 }}>
                  <h3 className="text-h3" style={{ marginBottom: 20 }}>Scan Configuration</h3>

                  <label style={{ fontSize: '0.8rem', color: 'var(--navy-dark)', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    Rule Set Version
                  </label>
                  <select
                    className="input-base"
                    style={{ marginBottom: 24 }}
                    value={ruleSet}
                    onChange={e => setRuleSet(e.target.value)}
                  >
                    {RULE_SETS.map(r => <option key={r}>{r}</option>)}
                  </select>

                  {/* Toggles */}
                  {[
                    { label: 'E-commerce label context', state: ecommerceCtx, set: setEcommerceCtx },
                    { label: 'Multi-language label', state: multiLang, set: setMultiLang },
                  ].map(t => (
                    <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--navy-dark)', fontWeight: 500 }}>{t.label}</span>
                      <div className={`toggle-track ${t.state ? 'on' : ''}`} onClick={() => t.set(v => !v)}>
                        <div className="toggle-thumb" />
                      </div>
                    </div>
                  ))}

                  <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                    Override checks (advanced)
                  </p>
                  {[
                    { label: 'Skip font size check', state: skipFont, set: setSkipFont },
                    { label: 'Skip country of origin check', state: skipOrigin, set: setSkipOrigin },
                    { label: 'Include semantic validation (OpenAI)', state: semantic, set: setSemantic },
                  ].map(c => (
                    <label key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer' }}>
                      <div className={`custom-checkbox ${c.state ? 'checked' : ''}`} onClick={() => c.set(v => !v)}>
                        {c.state && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{c.label}</span>
                    </label>
                  ))}

                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 24, padding: '14px' }} onClick={runScan}>
                    Run Compliance Check <ArrowRight size={18} />
                  </button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 10, textAlign: 'center', fontWeight: 500 }}>
                    Est. processing time: 45–60 seconds
                  </p>
                </div>
              </div>
            )}

            {/* ── TAB 2: E-Commerce ── */}
            {activeTab === 'ecommerce' && (
              <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <div className="glass-card" style={{ padding: 36 }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy-dark)', display: 'block', marginBottom: 10 }}>
                    Product Listing URL
                  </label>
                  <div style={{ position: 'relative', marginBottom: 16 }}>
                    <Globe size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                    <input
                      className="input-base"
                      style={{ paddingLeft: 46, height: 54, fontSize: '0.95rem' }}
                      placeholder="https://www.amazon.in/dp/... or flipkart.com/..."
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                    {EXAMPLE_URLS.map(ex => (
                      <button
                        key={ex.label}
                        className="btn-ghost"
                        style={{ fontSize: '0.8rem', padding: '6px 14px', background: '#F8FAFC', border: '1px solid var(--border)' }}
                        onClick={() => setUrl(ex.url)}
                      >
                        {ex.label}
                      </button>
                    ))}
                  </div>

                  {/* Rule 6(10) callout */}
                  <div style={{
                    background: 'var(--amber-bg)', border: '1px solid rgba(217,119,6,0.3)',
                    borderRadius: 12, padding: '16px 18px', marginBottom: 24,
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}>
                    <AlertCircle size={18} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: '0.8125rem', color: '#B45309', lineHeight: 1.5, fontWeight: 500 }}>
                      <strong>Rule 6(10) Mandate:</strong> E-commerce platforms must display all declarations
                      required under LM (PC) Rules. Non-compliance penalty: up to ₹25,000 fine per listing.
                    </p>
                  </div>

                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} onClick={runScan}>
                    Crawl &amp; Analyse Listing <ArrowRight size={18} />
                  </button>

                  <div style={{
                    marginTop: 20, padding: '12px 14px',
                    background: '#F8FAFC', borderRadius: 10, border: '1px solid var(--border)',
                    fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center',
                    fontFamily: 'JetBrains Mono', fontWeight: 600,
                  }}>
                    516 e-commerce violations detected in Maharashtra (2024–25)
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 3: Manufacturer ── */}
            {activeTab === 'manufacturer' && (
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 28 }} className="scan-grid">
                <div>
                  <UploadZone
                    onFileSelect={setMfgFile}
                    selectedFile={mfgFile}
                    onClear={() => setMfgFile(null)}
                    hint="Accepts PNG, AI-exported PNG, PDF (first page scanned)"
                  />
                </div>
                <div className="glass-card" style={{ padding: 28 }}>
                  <h3 className="text-h3" style={{ marginBottom: 20 }}>Product Metadata</h3>
                  {[
                    { label: 'GSTIN', placeholder: '27AAAAA0000A1Z5', val: gstin, set: setGstin },
                    { label: 'Company Name', placeholder: 'ABC Foods Pvt. Ltd.', val: companyName, set: setCompanyName },
                    { label: 'Product Name', placeholder: 'e.g. Glucose Biscuits 200g', val: productName, set: setProductName },
                    { label: 'Net Quantity', placeholder: 'e.g. 200g or 500ml', val: netQty, set: setNetQty },
                    { label: 'FSSAI License (optional)', placeholder: '14-digit number', val: fssai, set: setFssai },
                  ].map(f => (
                    <div key={f.label} style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--navy-dark)', fontWeight: 700, display: 'block', marginBottom: 5 }}>
                        {f.label}
                      </label>
                      <input
                        className="input-base"
                        placeholder={f.placeholder}
                        value={f.val}
                        onChange={e => f.set(e.target.value)}
                      />
                    </div>
                  ))}
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: '14px' }} onClick={runScan}>
                    Verify &amp; Issue Pre-Print Certificate <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .scan-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
