import React, { useState } from 'react';
import type { PanelType } from '../types';
import { PANELS } from '../constants';
import { useData } from '../contexts/DataContext';

interface SidebarProps {
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  onOpenAuth?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePanel, setActivePanel, onOpenAuth }) => {
  const { user, logout, isAdmin } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter panels and reorder: client portal items at top when logged in
  const clientPanelIds = ['profile', 'myprojects', 'mypurchases'];

  const filteredPanels = PANELS.filter((panel) => {
    if (panel.id === 'admin' && !isAdmin) return false;
    if (clientPanelIds.includes(panel.id) && !user) return false;
    return true;
  });

  // Reorder: if logged in, put client panels at top
  const orderedPanels = user
    ? [
      ...filteredPanels.filter(p => clientPanelIds.includes(p.id)),
      ...filteredPanels.filter(p => !clientPanelIds.includes(p.id) && p.id !== 'admin'),
      ...filteredPanels.filter(p => p.id === 'admin')
    ]
    : filteredPanels;

  const handlePanelClick = (panelId: PanelType) => {
    setActivePanel(panelId);
    setMobileMenuOpen(false);
  };

  const NavContent = () => (
    <>
      {/* Profile Header */}
      <div className="p-3 border-b border-slate-700/50">
        <img
          src="/headshot_nick.png"
          alt="Nicholas Kraemer"
          className="w-full h-32 rounded-xl object-cover object-top mb-3"
        />
        <div className="text-center">
          <div className="font-bold text-white text-sm">Nicholas Kraemer</div>
          <div className="text-[10px] text-slate-400">Business Engineer & Operator</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        {orderedPanels.map((panel) => {
          const isActive = activePanel === panel.id;
          return (
            <button
              key={panel.id}
              onClick={() => handlePanelClick(panel.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group relative ${isActive
                ? 'bg-blue-500/15 text-blue-400 border-l-2 border-blue-400'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border-l-2 border-transparent'
                }`}
            >
              <div className={`shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                {panel.icon}
              </div>
              <span className={`text-sm font-medium truncate ${isActive ? 'text-blue-300' : ''}`}>
                {panel.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* User / Auth Button */}
      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={user ? logout : onOpenAuth}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${isAdmin ? 'text-green-400 bg-green-900/20 hover:bg-green-900/30' :
            user ? 'text-blue-400 bg-blue-900/20 hover:bg-blue-900/30' :
              'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
        >
          {user ? (
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center font-bold font-mono text-sm border border-current shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
          )}
          <span className="text-sm font-medium truncate">
            {user ? user.username : 'Client Login'}
          </span>
          {user && (
            <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isAdmin ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></span>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/headshot_nick.png"
            alt="Nicholas Kraemer"
            className="w-9 h-9 rounded-lg object-cover object-top border border-blue-500/50"
          />
          <div>
            <div className="font-bold text-white text-sm">Nicholas Kraemer</div>
            <div className="text-[10px] text-slate-400">Business Engineer</div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-out Menu */}
      <nav className={`lg:hidden fixed top-0 left-0 h-full w-64 z-50 bg-slate-800/95 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent />
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col bg-slate-800/90 backdrop-blur-xl border-r border-slate-700/50 h-full shadow-xl z-50 w-56">
        <NavContent />
      </nav>
    </>
  );
};

export default Sidebar;