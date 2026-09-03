import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Globe, FileCheck, ArrowRight, ShieldCheck, Zap, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const STATUS_ROWS = [
  { text: '✓ Preprocessing complete', color: 'var(--india-green)' },
  { text: '✓ Barcode detected — 4.2 mm/px', color: 'var(--india-green)' },
  { text: '✓ 12 mandatory fields extracted', color: 'var(--india-green)' },
  { text: '⚠ Font size: 2.1mm (Rule 6 req: 3mm)', color: 'var(--amber)' },
  { text: '◉ Processing semantic validation...', color: 'var(--text-muted)', dots: true },
];

const TRACK_CARDS = [
  {
    icon: Camera,
    title: 'Physical Product Scan',
    desc: 'Upload a photo of any packaged product. Our Barcode-as-Ruler technique measures real font sizes without a physical ruler.',
    badge: 'Field Inspection',
    color: 'var(--saffron)',
    bg: '#FFF7ED',
  },
  {
    icon: Globe,
    title: 'E-Commerce Monitor',
    desc: 'Paste an Amazon or Flipkart URL. Checks Rule 6(10) compliance instantly — used in 516+ violation cases in Maharashtra.',
    badge: 'Automated Crawl',
    color: 'var(--india-green)',
    bg: '#F0FDF4',
  },
  {
    icon: FileCheck,
    title: 'Manufacturer Pre-Print',
    desc: 'Upload your label design before printing. Get a compliance certificate in under 60 seconds. Prevent violations at source.',
    badge: 'Pre-Production',
    color: 'var(--navy-dark)',
    bg: '#F8FAFC',
  },
];

const STATS = [
  { value: 10000, suffix: '+', label: 'Products / officer / day', icon: TrendingUp },
  { value: 945, label: 'OCR Accuracy', suffix: '%', isDecimal: true, icon: Zap },
  { value: 60, suffix: 's', label: 'Per compliance check', prefix: '<', icon: Clock },
  { value: 80, suffix: '+', label: 'Indian languages supported', icon: ShieldCheck },
];

export default function Landing() {
  const navigate = useNavigate();
  const [visibleRowsCount, setVisibleRowsCount] = useState<number>(0);

  // Sequential status rows animation on page load/reload
  useEffect(() => {
    setVisibleRowsCount(0);
    const timers = [
      setTimeout(() => setVisibleRowsCount(1), 400),
      setTimeout(() => setVisibleRowsCount(2), 1000),
      setTimeout(() => setVisibleRowsCount(3), 1600),
      setTimeout(() => setVisibleRowsCount(4), 2200),
      setTimeout(() => setVisibleRowsCount(5), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', paddingTop: 64 }}>
      {/* ── HERO ── */}
      <div className="max-w-content">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,0.9fr)',
            gap: 56,
            alignItems: 'center',
            paddingTop: 80,
            paddingBottom: 72,
          }}
          className="hero-grid"
        >
          {/* LEFT */}
          <div>
            {/* Eyebrow */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                border: '1px solid rgba(234, 88, 12, 0.3)',
                background: '#FFF7ED',
                borderRadius: 24, padding: '6px 16px 6px 12px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <motion.div
                  style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--saffron)' }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
                <span style={{ fontSize: '0.8125rem', color: 'var(--saffron)', fontWeight: 700, fontFamily: 'Outfit' }}>
                  Smart India Hackathon 2026 · Problem Statement #26034
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1
              className="text-display"
              style={{ color: 'var(--navy-dark)', marginBottom: 20 }}
            >
              AI-Powered Label<br />
              <span style={{ color: 'var(--saffron)' }}>Compliance</span> at<br />
              Government Scale.
            </h1>

            {/* Sub */}
            <p
              style={{
                fontSize: '1.0625rem', color: 'var(--text-secondary)',
                maxWidth: 500, lineHeight: 1.7, marginBottom: 36,
              }}
            >
              MetroScan AI verifies every mandatory declaration under LM&nbsp;(PC) Rules,&nbsp;2011
              in under 60&nbsp;seconds — physical products, e-commerce listings, and
              manufacturer label designs.
            </p>

            {/* Stats strip */}
            <div
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                borderRadius: 16, overflow: 'hidden',
                border: '1px solid var(--border)',
                background: '#FFFFFF',
                boxShadow: 'var(--shadow-md)',
                marginBottom: 36,
              }}
            >
              {STATS.map((s, i) => {
                return (
                  <div
                    key={i}
                    style={{
                      padding: '18px 14px',
                      borderRight: i < 3 ? '1px solid var(--border)' : 'none',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 800,
                      color: 'var(--saffron)', lineHeight: 1, marginBottom: 4,
                    }}>
                      {s.prefix || ''}
                      {s.isDecimal ? '94.5' : <AnimatedCounter target={s.value} />}
                      {s.suffix}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, lineHeight: 1.3 }}>
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <motion.button
                className="btn-primary"
                style={{ fontSize: '1rem', padding: '14px 28px' }}
                onClick={() => navigate('/scan')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Compliance Check <ArrowRight size={18} />
              </motion.button>
              <motion.button
                className="btn-outline"
                style={{ fontSize: '1rem', padding: '14px 24px' }}
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Dashboard
              </motion.button>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={14} color="var(--india-green)" />
              Free for government enforcement officers · NIC Cloud Hosted
            </p>
          </div>

          {/* RIGHT — Scan mockup card */}
          <div>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border)',
                borderRadius: 20, overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {/* Window bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border)',
                background: '#F8FAFC',
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#DC2626','#D97706','#15803D'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: '#FFF7ED', border: '1px solid rgba(234, 88, 12, 0.3)',
                  borderRadius: 20, padding: '4px 12px',
                  fontSize: '0.68rem', color: 'var(--saffron)', fontWeight: 700, letterSpacing: '0.06em',
                }}>
                  <motion.div
                    style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--saffron)' }}
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  LIVE COMPLIANCE SCAN
                </div>
              </div>

              {/* Product image with continuous, infinite up-and-down laser scan beam */}
              <div style={{ position: 'relative', overflow: 'hidden', background: '#F1F5F9' }}>
                <img
                  src="https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=240&fit=crop&auto=format"
                  alt="Product label scan"
                  style={{ width: '100%', height: 210, objectFit: 'cover', display: 'block' }}
                />
                {/* Continuous Infinite Pure CSS Laser Scan Beam */}
                <div className="scan-beam" />
              </div>

              {/* Sequential status rows */}
              <div style={{ padding: '16px 20px', background: '#FFFFFF', minHeight: 180 }}>
                {STATUS_ROWS.slice(0, visibleRowsCount).map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 0',
                      borderBottom: i < STATUS_ROWS.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    {row.dots ? (
                      <motion.span
                        style={{ fontSize: '0.78rem', color: row.color, fontWeight: 600 }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {row.text}
                      </motion.span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: row.color, fontWeight: 600 }}>
                        {row.text}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── TRACK CARDS ── */}
        <div style={{ paddingBottom: 80 }}>
          <div style={{ marginBottom: 24, textAlign: 'left' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--saffron)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Outfit' }}>
              Enforcement Modalities
            </span>
            <h2 className="text-h2" style={{ color: 'var(--navy-dark)', marginTop: 4 }}>
              Three Automated Compliance Tracks
            </h2>
          </div>

          <div
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
            }}
            className="track-grid"
          >
            {TRACK_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  className="glass-card-hover"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  style={{ padding: 32, cursor: 'pointer' }}
                  onClick={() => navigate('/scan')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <div style={{
                      width: 52, height: 52,
                      background: card.bg,
                      border: `1px solid ${card.color}30`,
                      borderRadius: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={24} color={card.color} />
                    </div>
                    <span style={{
                      fontSize: '0.725rem', fontWeight: 700,
                      background: card.bg, border: `1px solid ${card.color}30`,
                      color: card.color, padding: '4px 12px', borderRadius: 20,
                    }}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.15rem', marginBottom: 12, color: 'var(--navy-dark)' }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {card.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        borderTop: '1px solid var(--border)', background: '#FFFFFF',
        padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <ShieldCheck size={16} color="var(--india-green)" />
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Made for Government of India · Ministry of Consumer Affairs, Food &amp; Public Distribution · Team Takshak · SIH 2026
        </span>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .track-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
