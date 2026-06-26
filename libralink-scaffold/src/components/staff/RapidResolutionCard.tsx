// src/components/staff/RapidResolutionCard.tsx
import React, { useEffect } from 'react';
import { trapFocus } from '../../lib/focus-manager';
import { ScanResult } from './QuickActionBar';

interface RapidResolutionCardProps {
  scanResult: ScanResult;
  onDismiss: () => void;
  onAction: (type: string) => void;
}

export const RapidResolutionCard: React.FC<RapidResolutionCardProps> = ({ scanResult, onDismiss, onAction }) => {
  useEffect(() => {
    trapFocus('rapid-resolution-card-modal');
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  return (
    <div id="rapid-resolution-card-modal" className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
        <div className="mb-4">
          <span className="text-xs uppercase font-extrabold px-2 py-1 bg-blue-50 text-blue-700 rounded font-mono">
            Type: {scanResult.type}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mt-2">Verify Hardware Transaction Log</h3>
        </div>

        <div className="space-y-2 bg-gray-50 p-3 rounded-lg border text-xs font-mono text-gray-600 mb-6 break-all">
          <div><strong>Raw Data:</strong> {scanResult.raw}</div>
          {scanResult.bookingId && <div><strong>Booking:</strong> {scanResult.bookingId}</div>}
          {scanResult.userId && <div><strong>User Ref:</strong> {scanResult.userId}</div>}
          {scanResult.resourceId && <div><strong>Resource:</strong> {scanResult.resourceId}</div>}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onDismiss}
            className="px-4 py-2 text-sm border font-medium rounded-lg text-gray-700 hover:bg-gray-50 outline-none focus:ring-2 focus:ring-gray-200"
          >
            Dismiss [Esc]
          </button>
          <button
            onClick={() => onAction(scanResult.type)}
            className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 outline-none focus:ring-2 focus:ring-blue-400"
          >
            Execute Sync Action [Enter]
          </button>
        </div>
      </div>
    </div>
  );
};