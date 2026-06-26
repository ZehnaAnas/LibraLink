// src/components/staff/QuickActionBar.tsx
import React, { useEffect, useRef, useState } from 'react';
import { returnToScanner, announceAction } from '../../lib/focus-manager';

export interface ScanResult {
  type: 'booking' | 'student' | 'resource' | 'unknown';
  bookingId?: string;
  userId?: string;
  resourceId?: string;
  timestamp?: string;
  raw?: string;
}

export function parseScan(input: string): ScanResult {
  const trimmed = input.trim();
  
  if (trimmed.startsWith('LBK:')) {
    const parts = trimmed.split(':');
    return {
      type: 'booking',
      bookingId: parts[1] || undefined,
      userId: parts[2] || undefined,
      resourceId: parts[3] || undefined,
      timestamp: parts[4] || undefined,
      raw: trimmed
    };
  }
  
  if (trimmed.startsWith('SID:')) {
    return { type: 'student', userId: trimmed.replace('SID:', ''), raw: trimmed };
  }
  
  if (trimmed.startsWith('RES:')) {
    return { type: 'resource', resourceId: trimmed.replace('RES:', ''), raw: trimmed };
  }
  
  return { type: 'unknown', raw: trimmed };
}

interface QuickActionBarProps {
  onScanSuccess: (result: ScanResult) => void;
  onScanError: (rawInput: string) => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ onScanSuccess, onScanError }) => {
  const [inputValue, setInputValue] = useState('');
  const [flashClass, setFlashClass] = useState<'none' | 'green' | 'red'>('none');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleGlobalEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalEsc);
    return () => window.removeEventListener('keydown', handleGlobalEsc);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!inputValue.trim()) return;

      const result = parseScan(inputValue);

      if (result.type !== 'unknown') {
        setFlashClass('green');
        announceAction(`Scan successful. Loaded ${result.type} profile data.`);
        onScanSuccess(result);
      } else {
        setFlashClass('red');
        announceAction("Scan failed. Unrecognized structural sequence.");
        onScanError(inputValue);
      }

      setInputValue('');
      setTimeout(() => {
        setFlashClass('none');
        returnToScanner();
      }, 500);
    }
  };

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm">
      <label htmlFor="barcode-scanner-input" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
        Hardware Emulated Barcode Scanner Input <span className="text-gray-400 font-normal lowercase">(Press [Esc] to refocus)</span>
      </label>
      <input
        id="barcode-scanner-input"
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Awaiting physical laser scan sequence stream..."
        aria-keyshortcuts="Escape"
        className={`w-full px-4 py-3 border-2 rounded-lg font-mono text-base outline-none transition-all duration-200
          ${flashClass === 'green' ? 'border-green-500 bg-green-50/50 animate-pulse' : ''}
          ${flashClass === 'red' ? 'border-red-500 bg-red-50/50 animate-pulse' : ''}
          ${flashClass === 'none' ? 'border-gray-200 focus:border-blue-500' : ''}
        `}
      />
    </div>
  );
};