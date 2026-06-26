import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface TopbarProps {
  onMobileMenuToggle: () => void;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  unreadNotificationsCount: number;
  userName: string;
}

export default function Topbar({ 
  onMobileMenuToggle, 
  connectionStatus, 
  unreadNotificationsCount, 
  userName 
}: TopbarProps) {
  
  // Status dot color mapping explicitly derived from Role 2/3 contracts
  const statusColors = {
    connected: 'bg-green-500',
    connecting: 'bg-amber-500',
    disconnected: 'bg-red-500'
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between shadow-sm">
      {/* Mobile Menu Action Trigger */}
      <button 
        onClick={onMobileMenuToggle} 
        className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        aria-label="Toggle view options menu"
      >
        <Menu size={20} />
      </button>

      {/* Core Omnipresent Search Bar */}
      <div className="relative max-w-md w-full hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Search items, physical study hubs, tech inventory..." 
          className="w-full bg-slate-50 dark:bg-slate-950 text-sm pl-10 pr-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-teal-500 text-slate-900 dark:text-slate-100"
        />
      </div>

      {/* Right Interaction Field (Infrastructure Status and Alerts) */}
      <div className="flex items-center gap-4 ml-auto sm:ml-0">
        {/* WebSocket Pipeline Indicator Tag */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className={`w-2 h-2 rounded-full ${statusColors[connectionStatus] || 'bg-slate-400'}`} />
          <span className="text-xs text-slate-500 font-medium capitalize hidden md:inline">{connectionStatus}</span>
        </div>

        {/* Global Hub Notification Trigger Badge */}
        <button className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <Bell size={20} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* User Workspace Profile Interface */}
        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-semibold text-sm flex items-center justify-center">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden lg:inline">{userName}</span>
        </div>
      </div>
    </header>
  );
}