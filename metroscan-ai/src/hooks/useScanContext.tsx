import React, { createContext, useContext, useState } from 'react';
import { ScanInput, ScanResult } from '@/types/compliance';
import { MOCK_SCAN_RESULT } from '@/data/mockData';

interface ScanContextType {
  scanInput: ScanInput | null;
  setScanInput: (input: ScanInput | null) => void;
  scanResult: ScanResult | null;
  setScanResult: (result: ScanResult | null) => void;
  selectedDemoId: string;
  setSelectedDemoId: (id: string) => void;
  resetScan: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [scanInput, setScanInput] = useState<ScanInput | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(MOCK_SCAN_RESULT);
  const [selectedDemoId, setSelectedDemoId] = useState<string>('parle-g');

  const resetScan = () => {
    setScanInput(null);
    setScanResult(null);
    setSelectedDemoId('parle-g');
  };

  return (
    <ScanContext.Provider value={{
      scanInput, setScanInput,
      scanResult, setScanResult,
      selectedDemoId, setSelectedDemoId,
      resetScan,
    }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScanContext() {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error('useScanContext must be used within ScanProvider');
  return ctx;
}
