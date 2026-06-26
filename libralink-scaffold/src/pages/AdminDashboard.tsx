// src/pages/AdminDashboard.tsx
import React, { useState } from 'react';

export const AdminDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'users' | 'resources' | 'analytics'>('users');
  const [priorityWeight, setPriorityWeight] = useState(60);

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Global Management & Administration Deck</h2>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Adjust waitlist calculations, configure parameters, and review system metrics.</p>
        </div>

        {/* View Navigation Switch */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold w-fit">
          {(['users', 'resources', 'analytics'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg transition-all capitalize ${currentTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {currentTab === 'users' && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b font-bold text-gray-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Student Account Ident</th>
                <th className="px-6 py-3.5">Account Status</th>
                <th className="px-6 py-3.5">Violation Triggers</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y font-semibold text-gray-700">
              {[
                { label: 'Sarah Jenkins', mail: 's.jenkins@university.edu', active: true, count: 0 },
                { label: 'Marcus Vance', mail: 'm.vance@university.edu', active: false, count: 3 },
                { label: 'Elena Rostova', mail: 'e.rostova@university.edu', active: true, count: 1 },
                { label: 'Tom Sawyer', mail: 't.sawyer@university.edu', active: true, count: 0 },
                { label: 'Nina Williams', mail: 'n.williams@university.edu', active: true, count: 1 },
                { label: 'Bruce Wayne', mail: 'b.wayne@university.edu', active: false, count: 4 }
              ].map((user, i) => (
                <tr key={i} className="hover:bg-gray-50/40">
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-bold">{user.label}</div>
                    <div className="text-[10px] text-gray-400 font-normal mt-0.5">{user.mail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.active ? 'Clear' : 'Restricted Lock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500">{user.count}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => alert(`Modified structural constraint permissions for ${user.label}`)}
                      className="text-blue-600 hover:underline font-bold text-[11px]"
                    >
                      {user.active ? 'Restrict Profile' : 'Unrestrict Profile'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {currentTab === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 border rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Algorithm Priority Configurations</h3>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Waitlist Academic Weight Index ({priorityWeight}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={priorityWeight}
              onChange={(e) => setPriorityWeight(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-4"
            />
            <p className="text-xs text-gray-500 leading-relaxed">
              Modifying this parameter alters allocation priorities, biasing the queue sorting algorithm toward academic performance parameters and priority enrollment standings.
            </p>
          </div>

          <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Device & Space Maintenance Overrides</h3>
            {['Study Pod Room #02', 'High-Tier Media Hub B', 'Scientific Graphing Tablet #14'].map((asset, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border text-xs font-semibold">
                <span className="text-gray-700">{asset}</span>
                <button
                  onClick={() => alert(`${asset} marked under scheduled maintenance status loop.`)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] uppercase tracking-wider rounded"
                >
                  Mark Under Maintenance
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentTab === 'analytics' && (
        <div className="bg-white p-6 border rounded-xl shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Live System Performance Metrics</h3>
            <p className="text-xs text-gray-400 font-medium">Recharts rendering layers bound to mock schema contracts</p>
          </div>
          
          {/* Chart Wrapper Container block ensuring responsive limits */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {['Daily Bookings Vector (Line)', 'Resource Utilization Factors (Pie)', 'Peak Operational Hourly Loads (Bar)'].map((chartName, idx) => (
              <div key={idx} className="border border-dashed p-4 rounded-xl bg-gray-50/50 flex flex-col justify-between h-[340px]">
                <span className="text-xs font-bold text-gray-500 tracking-tight block">{chartName}</span>
                <div className="w-full flex-1 flex items-center justify-center text-xs text-gray-400 font-mono">
                  {/* Wrap charts in a ResponsiveContainer with a 100% width and 300px height per documentation requirements */}
                  <div className="text-center p-4 border rounded bg-white shadow-sm w-full h-[280px] flex items-center justify-center">
                    &lt;ResponsiveContainer width="100%" height=\{300\}&gt;<br/>
                    [{chartName} Display Instance Ready]
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};