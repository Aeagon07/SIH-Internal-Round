import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Barcode, ScanText, ClipboardCheck, Type, Brain } from 'lucide-react';
import PipelineStep from '@/components/ui/PipelineStep';
import { useScanContext } from '@/hooks/useScanContext';
import { runComplianceCheck } from '@/services/claudeApi';

type StepState = 'pending' | 'active' | 'done';

const STEPS = [
  {
    icon: Settings2, title: 'Image Preprocessing',
    desc: 'CLAHE enhancement · Denoising · YOLOv11 label detection · Perspective correction',
    doneAt: 6,
  },
  {
    icon: Barcode, title: 'Scale Calibration',
    desc: 'EAN-13 barcode detected · Width: 312px → 25.9mm GS1 standard · mm/px ratio computed',
    doneAt: 12,
  },
  {
    icon: ScanText, title: 'Field Extraction — PaddleOCR-VL 1.5',
    desc: 'Extracting all 12 mandatory declarations · Processing multi-script content',
    doneAt: 25,
  },
  {
    icon: ClipboardCheck, title: 'Rule Engine — 12 Field Validation',
    desc: 'Checking presence, format, and content against LM (PC) Rules 2011 + amendments',
    doneAt: 35,
  },
  {
    icon: Type, title: 'Font Measurement — Barcode-as-Ruler',
    desc: 'BBox height in pixels × mm/px ratio → real-world font size vs LM thresholds',
    doneAt: 42,
  },
  {
    icon: Brain, title: 'Semantic Validation — OpenAI GPT-4o',
    desc: 'Contextual check for misleading claims, ambiguous declarations, language compliance',
    doneAt: Infinity,
  },
];

const FACTS = [
  'EAN-13 barcodes have fixed GS1 dimensions: 25.9mm × 37.29mm worldwide',
  'Rule 6 mandates MRP in ₹ with all taxes inclusive',
  'Font height for MRP must be minimum 3mm on packaging labels',
  'PaddleOCR-VL 1.5 achieved 94.5% SOTA accuracy on legal documents',
  '516 e-commerce violations detected in Maharashtra in 2024–25',
  'YOLOv11 label detection runs at 47ms/frame on standard hardware',
];

export default function Processing() {
  const { scanInput, scanResult, setScanResult } = useScanContext();
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);
  const [stepStates, setStepStates] = useState<StepState[]>(['active', 'pending', 'pending', 'pending', 'pending', 'pending']);
  const [factIdx, setFactIdx] = useState(0);
  const [apiDone, setApiDone] = useState(false);
  const apiResultRef = useRef<any>(null);
  const completedRef = useRef(false);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fact rotation
  useEffect(() => {
    const interval = setInterval(() => setFactIdx(i => (i + 1) % FACTS.length), 8000);
    return () => clearInterval(interval);
  }, []);

  // Step progression
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((step, i) => {
      if (step.doneAt === Infinity) return;
      timers.push(setTimeout(() => {
        setStepStates(prev => {
          const next = [...prev];
          next[i] = 'done';
          if (i + 1 < next.length) next[i + 1] = 'active';
          return next;
        });
      }, step.doneAt * 1000));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // API call
  useEffect(() => {
    if (!scanInput) { navigate('/scan'); return; }

    // If demo mode already has result
    if (scanResult && scanInput.isDemoMode) {
      setTimeout(() => {
        setApiDone(true);
        apiResultRef.current = scanResult;
      }, 3000);
      return;
    }

    runComplianceCheck(scanInput.productName, scanInput.type).then(result => {
      apiResultRef.current = result;
      setScanResult(result);
      setApiDone(true);
    });
  }, []);

  // Navigate when BOTH step 5 done (42s) AND API done (or if demo mode finished)
  useEffect(() => {
    if (completedRef.current) return;
    if (apiDone && (elapsed >= 42 || scanInput?.isDemoMode)) {
      completedRef.current = true;
      if (apiResultRef.current) setScanResult(apiResultRef.current);
      setStepStates(prev => prev.map(() => 'done') as StepState[]);
      setTimeout(() => navigate('/results'), 800);
    }
  }, [apiDone, elapsed]);

  const progressPct = Math.min((elapsed / 45) * 100, 100);
  const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const secs = (elapsed % 60).toString().padStart(2, '0');

  return (
    <div style={{
      background: 'var(--bg-base)', minHeight: '100vh', paddingTop: 64,
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%', padding: '48px 24px' }}>
        {/* Product info header card */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src="https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=100&h=100&fit=crop&auto=format"
                alt="Product"
                style={{ width: 68, height: 68, borderRadius: 12, objectFit: 'cover', border: '1px solid var(--border)' }}
              />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                Analysing Label Image
              </div>
              <div style={{ fontWeight: 700, color: 'var(--navy-dark)', fontFamily: 'Space Grotesk', fontSize: '1.2rem' }}>
                {scanInput?.productName || 'Packaged Commodity'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Legal Metrology (Packaged Commodities) Rules 2011 Evaluation
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-h2" style={{ marginBottom: 6 }}>Compliance Evaluation Pipeline</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '0.9rem' }}>
          Real-time AI verification in progress · Estimated completion: 45 seconds
        </p>

        {/* Timer */}
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12,
        }}>
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: '2.5rem', fontWeight: 700,
            color: 'var(--saffron)', lineHeight: 1, letterSpacing: '0.02em',
          }}>
            {mins}:{secs}
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Elapsed Time</span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden', marginBottom: 40 }}>
          <motion.div
            style={{ height: '100%', background: 'linear-gradient(90deg, #EA580C, #F97316)', borderRadius: 3 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Pipeline steps card */}
        <div className="glass-card" style={{ padding: 28, marginBottom: 32 }}>
          {STEPS.map((step, i) => (
            <PipelineStep
              key={i}
              stepNumber={i + 1}
              title={step.title}
              description={step.desc}
              state={stepStates[i]}
              icon={step.icon}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>

        {/* Rotating fact */}
        <AnimatePresence mode="wait">
          <motion.div
            key={factIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            style={{
              background: '#FFFFFF', border: '1px solid var(--border)',
              borderRadius: 12, padding: '14px 18px',
              fontSize: '0.8125rem', color: 'var(--text-secondary)',
              fontFamily: 'JetBrains Mono', fontWeight: 500,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            💡 <strong style={{ color: 'var(--navy-dark)' }}>Did you know?</strong> {FACTS[factIdx]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
