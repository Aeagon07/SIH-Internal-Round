import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface ComplianceScoreProps {
  score: number;
  size?: number;
}

function getColor(score: number) {
  if (score >= 80) return '#15803D';
  if (score >= 50) return '#D97706';
  return '#DC2626';
}

export default function ComplianceScore({ score, size = 120 }: ComplianceScoreProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 8;
  const center = size / 2;
  const color = getColor(score);

  const progressValue = useMotionValue(circumference);
  const strokeDashoffset = useTransform(progressValue, v => v);

  useEffect(() => {
    const targetOffset = circumference * (1 - score / 100);
    const controls = animate(progressValue, targetOffset, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [score, circumference]);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          filter={`drop-shadow(0 2px 4px ${color}40)`}
        />
      </svg>
      {/* Score number */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: size < 100 ? '1.25rem' : '1.75rem',
          fontWeight: 700, color,
          lineHeight: 1,
        }}>
          {score}
        </span>
        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}
