// src/components/staff/StaffCommandPalette.tsx
import React, { useState, useEffect } from 'react';

interface PaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffCommandPalette: React.FC<PaletteProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const entries = [
    { label: 'Collaborative Pod #04 (Occupied)', cat: 'rooms' },
    { label: 'Scientific Calculator Casio #12 (Overdue)', cat: 'devices' },
    { label: 'Student Account Dave Miller (Clearance Hold)', cat: 'users' },
    { label: 'Main Hall Auditorium A (Maintenance)', cat: 'rooms' },
  ];

  const matched = entries.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    if (!isOpen) return;
    setSelectedIndex(0);

    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, matched.length));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + matched.length) % Math.max(1, matched.length));
      }
      if (e.key === 'Enter' && matched[selectedIndex]) {
        e.preventDefault();
        alert(`Dispatched control workflow for: ${matched[selectedIndex].label}`);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isOpen, matched, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 pt-[15vh] flex justify-center">
      <div className="bg-white max-w-lg w-full h-fit rounded-xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        <input
          autoFocus
          type="text"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setSelectedIndex(0); }}
          placeholder="Fuzzy search rooms, bookings, students..."
          className="w-full px-4 py-3.5 border-b text-gray-800 font-medium outline-none text-sm placeholder-gray-400"
        />
        <div className="p-2 max-h-60 overflow-y-auto space-y-0.5">
          {matched.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-xs">No administrative records match query.</div>
          ) : (
            matched.map((item, i) => (
              <div
                key={i}
                className={`px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors
                  ${i === selectedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                <span>{item.label}</span>
                <span className="text-[10px] uppercase font-mono bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{item.cat}</span>
              </div>
            ))
          )}
        </div>
        <div className="bg-gray-50 border-t px-4 py-2 text-[10px] font-bold text-gray-400 flex justify-between uppercase tracking-wider">
          <span>Navigate: ↑↓ | Select: Enter</span>
          <span>Dismiss: Esc</span>
        </div>
      </div>
    </div>
  );
};