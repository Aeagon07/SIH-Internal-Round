import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { FieldCheck } from '@/types/compliance';

interface FieldAccordionProps {
  field: FieldCheck;
  index: number;
}

export default function FieldAccordion({ field, index }: FieldAccordionProps) {
  const [open, setOpen] = useState(false);

  const isPass = field.status === 'compliant';
  const isViol = field.status === 'violation';

  const statusColor = isPass ? 'var(--india-green)' : isViol ? 'var(--crimson)' : 'var(--amber)';
  const statusBg = isPass ? 'var(--india-green-bg)' : isViol ? 'var(--crimson-bg)' : 'var(--amber-bg)';
  const borderColor = isPass ? 'rgba(21, 128, 61, 0.2)' : isViol ? 'rgba(220, 38, 38, 0.2)' : 'rgba(217, 119, 6, 0.2)';

  const StatusIcon = isPass ? CheckCircle2 : isViol ? XCircle : AlertTriangle;

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1.5px solid ${open ? statusColor : 'var(--border)'}`,
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        boxShadow: open ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      }}
    >
      {/* Header Bar */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '14px 18px', display: 'flex', alignItems: 'center',
          justify: 'space-between', background: open ? '#F8FAFC' : '#FFFFFF',
          border: 'none', cursor: 'pointer', textAlign: 'left',
          transition: 'background 0.15s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: statusBg, border: `1px solid ${borderColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 800, color: statusColor, fontFamily: 'Outfit',
            flexShrink: 0,
          }}>
            {index + 1}
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy-dark)', fontFamily: 'Outfit' }}>
              {field.label}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 1 }}>
              {field.ruleRef}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Status Chip */}
          <span style={{
            padding: '4px 10px', borderRadius: 20,
            background: statusBg, color: statusColor,
            border: `1px solid ${borderColor}`,
            fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <StatusIcon size={13} />
            {isPass ? 'COMPLIANT' : isViol ? 'VIOLATION' : 'WARNING'}
          </span>

          <ChevronDown
            size={18}
            color="var(--text-muted)"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
          />
        </div>
      </button>

      {/* Expanded Accordion Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ borderTop: '1px solid var(--border)', background: '#F8FAFC', padding: '16px 18px' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              {/* Detected OCR Text */}
              <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                  Extracted OCR Text
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                  {field.found || 'Not Detected'}
                </div>
              </div>

              {/* Statutory Rule Requirement */}
              <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                  Statutory Rule Standard
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {field.required}
                </div>
              </div>
            </div>

            {/* Font Size Metric Comparison bar */}
            {field.fontSizeMm !== null && field.fontRequiredMm !== null && (
              <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: 6 }}>
                  <span>Font Height Measurement</span>
                  <span style={{ fontWeight: 700, color: field.fontSizeMm >= field.fontRequiredMm ? 'var(--india-green)' : 'var(--crimson)' }}>
                    {field.fontSizeMm}mm measured / {field.fontRequiredMm}mm required
                  </span>
                </div>
                <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (field.fontSizeMm / Math.max(field.fontRequiredMm * 1.5, 6)) * 100)}%`,
                    background: field.fontSizeMm >= field.fontRequiredMm ? 'var(--india-green)' : 'var(--crimson)',
                    borderRadius: 3,
                  }} />
                </div>
              </div>
            )}

            {/* Auditor Analysis Notes */}
            <div style={{ fontSize: '0.8125rem', color: 'var(--navy-dark)', lineHeight: 1.5, fontWeight: 500 }}>
              <strong style={{ color: statusColor }}>Auditor Note: </strong>
              {field.notes}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
