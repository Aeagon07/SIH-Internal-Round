import React, { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
  onClear?: () => void;
  accept?: string;
  hint?: string;
}

export default function UploadZone({
  onFileSelect, selectedFile, onClear, accept = '.jpg,.jpeg,.png,.webp', hint = '.JPG, .PNG, .WEBP up to 10MB',
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleFile = (file: File) => {
    onFileSelect(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setScanning(true);
    setTimeout(() => setScanning(false), 3000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setPreviewUrl(null);
    setScanning(false);
    if (inputRef.current) inputRef.current.value = '';
    onClear?.();
  };

  if (previewUrl && selectedFile) {
    return (
      <div
        style={{
          position: 'relative', borderRadius: 16,
          overflow: 'hidden', background: '#FFFFFF',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <img
          src={previewUrl}
          alt="Label preview"
          style={{ width: '100%', maxHeight: 360, objectFit: 'contain', display: 'block', background: '#F8FAFC' }}
        />
        {/* Scan beam */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              className="scan-beam"
              initial={{ top: 0, opacity: 1 }}
              animate={{ top: '100%', opacity: [1,1,0] }}
              transition={{ duration: 2.5, ease: 'linear' }}
            />
          )}
        </AnimatePresence>

        {/* Info bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85), transparent)',
          padding: '32px 16px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '4px 12px',
            fontSize: '0.75rem', color: 'var(--navy-dark)', fontFamily: 'JetBrains Mono', fontWeight: 600,
          }}>
            {selectedFile.name} · {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
          </div>
          <button
            onClick={clearFile}
            style={{
              background: '#FEE2E2', border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: 8, padding: '6px 12px', color: '#DC2626',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700,
            }}
          >
            <X size={14} /> Clear
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 48, textAlign: 'center', minHeight: 280,
        cursor: 'pointer',
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" accept={accept} style={{ display: 'none' }} onChange={handleInput} />
      <motion.div
        animate={dragOver ? { scale: 1.1 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 400 }}
        style={{
          width: 64, height: 64, borderRadius: '50%', background: '#FFF7ED',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          boxShadow: '0 4px 12px rgba(234, 88, 12, 0.15)',
        }}
      >
        <UploadCloud size={32} color="var(--saffron)" />
      </motion.div>
      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-dark)', fontFamily: 'Space Grotesk', marginBottom: 6 }}>
        {dragOver ? 'Drop product image here' : 'Drop product label image here'}
      </div>
      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 20 }}>{hint}</div>
      <button className="btn-outline" style={{ padding: '8px 22px', fontSize: '0.875rem' }} type="button">
        Browse Files
      </button>
    </div>
  );
}
