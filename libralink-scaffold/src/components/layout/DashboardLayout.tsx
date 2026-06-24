import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Desktop Persistent Sidebar System */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Context Navigation Slider View */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay Mask */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col animate-slide-in">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Structural Application Window */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar 
          onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          connectionStatus="connected" // Bound directly via selector during integration
          unreadNotificationsCount={4}  // Bound directly via selector during integration
          userName="Jane Doe"
        />
        
        {/* Scrollable Viewport Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}