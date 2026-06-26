// src/components/staff/UrgencyFlagReview.tsx
import React from 'react';

export const UrgencyFlagReview: React.FC = () => {
  const flags = [
    { id: 'FLG-902', student: 'Ethan Vance', violation: 'Continuous booking hoarding via session renewal exploitation', tier: 'High' },
    { id: 'FLG-114', student: 'Clara Oswald', violation: 'Multiple slot lock ghosting no-shows discovered', tier: 'Medium' }
  ];

  return (
    <div className="bg-white border p-5 rounded-xl shadow-sm flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Anti-Gaming Monitoring Feed</h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5">Flagged anomalies by allocation algorithms</p>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-72 pr-1 flex-1">
        {flags.map((item) => (
          <div key={item.id} className="p-3 bg-red-50/40 rounded-lg border border-red-100 flex flex-col gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-gray-800">{item.student}</span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">{item.tier}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{item.violation}</p>
            </div>
            
            <button
              onClick={() => alert(`Enforced full allocation revocation + lock quota penalties on ${item.student}`)}
              className="w-full py-1.5 text-center bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded outline-none focus:ring-2 focus:ring-red-400 transition-colors uppercase tracking-wider"
            >
              Revoke Allocation + Penalty
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};