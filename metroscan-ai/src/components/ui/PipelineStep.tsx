import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

type StepState = 'pending' | 'active' | 'done';

interface PipelineStepProps {
  stepNumber: number;
  title: string;
  description: string;
  state: StepState;
  icon: React.ElementType;
  isLast?: boolean;
}

export default function PipelineStep({
  stepNumber, title, description, state, icon: Icon, isLast = false,
}: PipelineStepProps) {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      {/* Left: icon + connector line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        {/* Icon circle */}
        <div style={{ position: 'relative' }}>
          <motion.div
            animate={state === 'active' ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: 42, height: 42, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: state === 'pending'
                ? '2px dashed var(--border-strong)'
                : state === 'active'
                ? '2px solid var(--saffron)'
                : '2px solid var(--india-green)',
              background: state === 'pending'
                ? '#FFFFFF'
                : state === 'active'
                ? '#FFF7ED'
                : 'var(--india-green-bg)',
              transition: 'all 0.4s ease',
              zIndex: 1,
              position: 'relative',
              boxShadow: state === 'active' ? '0 0 16px rgba(234, 88, 12, 0.25)' : 'none',
            }}
          >
            {state === 'done' ? (
              <Check size={18} color="var(--india-green)" strokeWidth={2.5} />
            ) : (
              <Icon
                size={18}
                color={state === 'active' ? 'var(--saffron)' : 'var(--text-muted)'}
              />
            )}
          </motion.div>

          {/* Active pulse ring */}
          {state === 'active' && (
            <motion.div
              style={{
                position: 'absolute', inset: -6, borderRadius: '50%',
                border: '2px solid rgba(234, 88, 12, 0.4)',
              }}
              animate={{ scale: [1, 1.4, 1.4], opacity: [0.8, 0, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </div>

        {/* Connector line */}
        {!isLast && (
          <div style={{
            width: 2, flex: 1, marginTop: 6, marginBottom: 6, minHeight: 28,
            background: state === 'done'
              ? 'var(--india-green)'
              : '#CBD5E1',
            transition: 'background 0.6s ease',
            borderRadius: 1,
          }} />
        )}
      </div>

      {/* Right: content */}
      <div style={{ paddingBottom: isLast ? 0 : 28, flex: 1, paddingTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{
            fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem',
            color: state === 'pending' ? 'var(--text-muted)' : 'var(--navy-dark)',
            transition: 'color 0.3s ease',
          }}>
            {title}
          </span>
          {state === 'active' && (
            <motion.div
              style={{ display: 'flex', gap: 3 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0,1,2].map(i => (
                <motion.span
                  key={i}
                  style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: 'var(--saffron)', display: 'inline-block',
                  }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
            </motion.div>
          )}
        </div>
        <p style={{
          fontSize: '0.8125rem', color: 'var(--text-secondary)',
          lineHeight: 1.5,
          fontFamily: state === 'active' ? 'JetBrains Mono' : 'DM Sans',
          fontWeight: state === 'active' ? 500 : 400,
          transition: 'color 0.3s ease',
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}
