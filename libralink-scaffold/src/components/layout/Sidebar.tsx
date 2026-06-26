import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  BookOpen, 
  LayoutDashboard, 
  Layers, 
  Bell, 
  ShieldAlert, 
  Terminal, 
  Sliders, 
  Moon, 
  Sun, 
  ChevronLeft, 
  ChevronRight,
  UserCheck
} from 'lucide-react';

export default function Sidebar() {
  const { role, setRole, darkMode, toggleDark } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Define route hierarchies according to implementation plan
  const routes = [
    { path: '/student', label: 'Student Dashboard', icon: LayoutDashboard, access: ['student', 'staff', 'admin'] },
    { path: '/resources', label: 'Live Resources', icon: BookOpen, access: ['student', 'staff', 'admin'] },
    { path: '/waitlist', label: 'Smart Waitlist', icon: Layers, access: ['student', 'staff', 'admin'] },
    { path: '/notifications', label: 'Notification Center', icon: Bell, access: ['student', 'staff', 'admin'] },
    { path: '/overdue', label: 'Restrictions', icon: ShieldAlert, access: ['student'] },
    { path: '/staff', label: 'Staff Terminal', icon: Terminal, access: ['staff', 'admin'] },
    { path: '/admin', label: 'Admin Panel', icon: Sliders, access: ['admin'] },
    { path: '/workflow', label: 'System Workflow', icon: Layers, access: ['student', 'staff', 'admin'] },
  ];

  const filteredRoutes = routes.filter(route => route.access.includes(role));

  return (
    <aside className={`h-screen bg-slate-900 text-white flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} border-r border-slate-800`}>
      {/* Upper Module: Brand Identity & Nav Links */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          {!isCollapsed && <span className="font-bold text-lg tracking-wider text-teal-400">LIBRALINK</span>}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-slate-800 rounded transition-colors"
            aria-label="Toggle Navigation Sidebar"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="mt-4 px-2 space-y-1">
          {filteredRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-teal-600 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                {!isCollapsed && <span>{route.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Lower Module: Settings & Sandbox Role Switcher */}
      <div className="p-2 border-t border-slate-800 space-y-1">
        {/* Theme Controller */}
        <button
          onClick={toggleDark}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg text-sm transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {!isCollapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Dynamic Role Switcher for Hackathon Demonstrations */}
        {!isCollapsed && (
          <div className="p-2 bg-slate-950 rounded-lg mt-2">
            <div className="text-xs text-slate-500 font-semibold mb-1 flex items-center gap-1">
              <UserCheck size={12} /> Sandbox Role Switcher
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'student' | 'staff' | 'admin')}
              className="w-full text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded p-1 focus:outline-none focus:border-teal-500"
            >
              <option value="student">Student Account</option>
              <option value="staff">Library Staff</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>
        )}
      </div>
    </aside>
  );
}