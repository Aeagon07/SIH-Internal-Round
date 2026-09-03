import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, X, Cookie, ShoppingCart, Droplets, ArrowRight } from 'lucide-react';
import { useScanContext } from '@/hooks/useScanContext';
import { DEMO_PRODUCTS_MAP } from '@/data/mockData';

const DEMO_LIST = [
  {
    id: 'parle-g',
    name: 'Parle-G Glucose Biscuits 200g',
    desc: 'Rule 6(1)(e) MRP Font Size Violation (2.1mm)',
    icon: Cookie,
    color: 'var(--saffron)',
    bgColor: '#FFF7ED',
  },
  {
    id: 'maggi',
    name: 'Maggi 2-Min Noodles 70g',
    desc: 'Rule 6(10) E-Commerce Price Misrepresentation',
    icon: ShoppingCart,
    color: 'var(--amber)',
    bgColor: '#FEF3C7',
  },
  {
    id: 'handwash',
    name: 'Generic Liquid Handwash 250ml',
    desc: 'Critical Seizure Level Non-Compliance (38%)',
    icon: Droplets,
    color: 'var(--crimson)',
    bgColor: '#FEE2E2',
  },
];

export default function DemoModal() {
  const [open, setOpen] = useState(false);
  const { setScanInput, setScanResult, setSelectedDemoId } = useScanContext();
  const navigate = useNavigate();

  const runDemo = (demoId: string) => {
    const demo = DEMO_PRODUCTS_MAP[demoId];
    if (!demo) return;

    setSelectedDemoId(demoId);
    setScanInput({
      type: demoId === 'maggi' ? 'ecommerce' : 'physical',
      productName: demo.name,
      isDemoMode: true,
    });
    setScanResult(demo.result);
    setOpen(false);
    navigate('/processing');
  };

  return (
    <>
      {/* Floating demo chip docked in bottom-right corner without obscuring page content */}
      <motion.button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 90,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
          border: '1px solid #C2410C',
          borderRadius: 30, padding: '9px 20px',
          color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(234, 88, 12, 0.35)',
          fontFamily: 'Outfit',
          letterSpacing: '0.02em',
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <Zap size={15} color="#FFFFFF" fill="#FFFFFF" />
        TRY DEMO MODE
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 300,
                background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(6px)',
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              style={{
                position: 'fixed', bottom: 76, right: 20, zIndex: 301,
                background: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: 20, padding: 24, width: 360,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy-dark)' }}>
                    Sample Legal Metrology Audits
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Instant offline evaluation for presentation
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: '#F1F5F9', border: 'none', color: 'var(--text-muted)',
                    cursor: 'pointer', borderRadius: '50%', width: 28, height: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {DEMO_LIST.map(p => {
                  const Icon = p.icon;
                  return (
                    <motion.button
                      key={p.id}
                      onClick={() => runDemo(p.id)}
                      whileHover={{ x: 4, backgroundColor: '#FFF7ED' }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '12px 14px',
                        background: '#FFFFFF',
                        border: '1px solid var(--border)',
                        borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: p.bgColor, border: `1px solid ${p.color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon size={18} color={p.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--navy-dark)', fontFamily: 'Outfit' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {p.desc}
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </motion.button>
                  );
                })}
              </div>

              <div style={{
                marginTop: 16, padding: '10px 12px', borderRadius: 10,
                background: 'var(--india-green-bg)', border: '1px solid rgba(21, 128, 61, 0.2)',
                fontSize: '0.75rem', color: 'var(--india-green)', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--india-green)' }} />
                Offline Ready · Zero API Latency Response
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
