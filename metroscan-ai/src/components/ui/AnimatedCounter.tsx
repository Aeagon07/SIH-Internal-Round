import React from 'react';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  style?: React.CSSProperties;
}

export default function AnimatedCounter({ target, suffix = '', prefix = '', duration = 1500, style }: AnimatedCounterProps) {
  const value = useAnimatedCounter(target, duration);
  return (
    <span className="text-mono" style={{ fontFamily: 'JetBrains Mono', ...style }}>
      {prefix}{value.toLocaleString('en-IN')}{suffix}
    </span>
  );
}
