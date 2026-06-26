// src/pages/StaffDashboard.tsx
import React, { useState, useEffect } from 'react';
import { QuickActionBar } from '../components/staff/QuickActionBar';
import type { ScanResult } from '../components/staff/QuickActionBar';
import { RapidResolutionCard } from '../components/staff/RapidResolutionCard';
import { StaffCommandPalette } from '../components/staff/StaffCommandPalette';
import { UrgencyFlagReview } from '../components/staff/UrgencyFlagReview';

export const StaffDashboard: React.FC = () => {
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isPeakActive, setIsPeakActive] = useState(false);

  useEffect(() => {
    const handleGlobalKeybinds = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K for Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
      // Ctrl+M for simulating maintenance toggle shortcut
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        alert('Shortcut [Ctrl+M]: Marked primary focused resource under maintenance loop.');
      }
      // Ctrl+O for waitlist override shortcut
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        alert('Shortcut [Ctrl+O]: Dispatched priority waitlist manual override module.');
      }
    };

    window.addEventListener('keydown', handleGlobalKeybinds);
    return () => window.removeEventListener('keydown', handleGlobalKeybinds);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">
      {/* Metrics Bento Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Available Rooms', val: '18 / 24', style: 'text-green-600' },
          { label: 'Active Asset Loans', val: '142 Items', style: 'text-blue-600' },
          { label: 'Overdue Safe Holds', val: '9 Blocks', style: 'text-amber-600' },
          { label: 'Flagged Violations', val: '2 Pending', style: 'text-red-600' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 border rounded-xl shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{stat.label}</span>
            <p className={`text-xl font-black mt-1 ${stat.style}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <QuickActionBar 
            onScanSuccess={(res) => setCurrentScan(res)}
            onScanError={(raw) => alert(`Error parsing transaction barcode string: ${raw}`)}
          />

          <div className="bg-white p-5 border rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Live System Audit Streams</h3>
                <p className="text-xs text-gray-400 mt-0.5">Real-time room allocation status triggers</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border">
                <span className="text-xs font-bold text-gray-500">Peak Exam Mode Throttling</span>
                <button
                  onClick={() => setIsPeakActive(!isPeakActive)}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 outline-none ${isPeakActive ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow transform duration-200 ${isPeakActive ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {isPeakActive && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg text-xs font-bold animate-pulse">
                ⚠️ WARNING: AUTOMATED CONSTRAINTS ACTIVE — ALL RESERVATION RE-LOOPS SUSPENDED
              </div>
            )}

            <div className="divide-y text-xs text-gray-700 font-medium">
              <div className="py-3 flex justify-between"><span>Check-In: Room #104 Completed</span><span className="text-gray-400 font-normal">Just now</span></div>
              <div className="py-3 flex justify-between"><span>Check-Out Issued: Advanced Graphing Unit #09</span><span className="text-gray-400 font-normal">11 mins ago</span></div>
              <div className="py-3 flex justify-between"><span>Audit: Fine penalty applied to account user #2210</span><span className="text-gray-400 font-normal">34 mins ago</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <UrgencyFlagReview />
          
          <div className="bg-white border p-4 rounded-xl shadow-sm text-[11px] font-mono text-gray-400 space-y-1">
            <span className="block font-bold text-gray-600 uppercase tracking-wide mb-1.5">Terminal Keybinds Configuration</span>
            <div>[Ctrl+K] - Global Command Panel Search</div>
            <div>[Escape] - Refocus Barcode Laser Input</div>
            <div>[Ctrl+M] - Force Maintenance Flag State</div>
            <div>[Ctrl+O] - Priority Queue Manual Override</div>
          </div>
        </div>
      </div>

      {currentScan && (
        <RapidResolutionCard
          scanResult={currentScan}
          onDismiss={() => setCurrentScan(null)}
          onAction={(type) => {
            alert(`Successfully processed pipeline sync action for: ${type}`);
            setCurrentScan(null);
          }}
        />
      )}

      <StaffCommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </div>
  );
};