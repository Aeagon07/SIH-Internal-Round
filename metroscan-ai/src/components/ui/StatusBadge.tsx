import React from 'react';
import { FieldStatus } from '@/types/compliance';

interface StatusBadgeProps {
  status: FieldStatus | 'pending';
  size?: 'sm' | 'md';
}

const CONFIG = {
  compliant: { cls: 'badge-compliant', text: 'COMPLIANT ✓' },
  violation:  { cls: 'badge-violation', text: 'VIOLATION ✗' },
  warning:    { cls: 'badge-warning',   text: 'WARNING ⚠' },
  pending:    { cls: 'badge-pending',   text: 'PENDING' },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const { cls, text } = CONFIG[status];
  return (
    <span
      className={cls}
      style={size === 'md' ? { fontSize: '0.8125rem', padding: '5px 14px' } : undefined}
    >
      {text}
    </span>
  );
}
