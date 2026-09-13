import React, { useState } from 'react';
import type { PanelType } from '../types';
import { PANELS } from '../constants';
import { useData } from '../contexts/DataContext';
import { openCvInfographicPrintWindow } from '../services/cvPdfGenerator';
import type { AdminTabType } from './panels/AdminPanel';

interface SidebarProps {
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  onOpenAuth?: () => void;
  adminTab?: AdminTabType;
  setAdminTab?: (tab: AdminTabType) => void;
  adminPreviewMode?: boolean;
  setAdminPreviewMode?: (preview: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activePanel,
  setActivePanel,
  onOpenAuth,
  adminTab = 'overview',
  setAdminTab,
  adminPreviewMode = false,
  setAdminPreviewMode
}) => {
  const { user, logout, isAdmin } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Client portal items
  const clientPanelIds = ['profile', 'myprojects', 'mypurchases'];

  // When admin is logged in (and not previewing public mode), show streamlined admin-only navigation
  const showAdminNav = isAdmin && !adminPreviewMode;

  const filteredPanels = PANELS.filter((panel) => {
    if (panel.id === 'admin' && !isAdmin) return false;
    if (clientPanelIds.includes(panel.id) && !user) return false;
    return true;
  });

  // Reorder for regular logged in clients (non-admin)
  const orderedPanels = (user && !isAdmin)
    ? [
      ...filteredPanels.filter(p => clientPanelIds.includes(p.id)),
      ...filteredPanels.filter(p => !clientPanelIds.includes(p.id) && p.id !== 'admin')
    ]
    : filteredPanels.filter(p => p.id !== 'admin');

  const handlePanelClick = (panelId: PanelType) => {
    setActivePanel(panelId);
    setMobileMenuOpen(false);
  };

  const handleAdminTabClick = (tab: AdminTabType) => {
    setActivePanel('admin');
    if (setAdminTab) {
      setAdminTab(tab);
    }
    setMobileMenuOpen(false);
  };

  // Dedicated Admin Navigation Items
  const adminNavItems: {
    id: string;
    label: string;
    icon: JSX.Element;
    badge?: string;
    onClick: () => void;
    isActive: boolean;
  }[] = [
    {
      id: 'admin-overview',
      label: 'System Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      onClick: () => handleAdminTabClick('overview'),
      isActive: activePanel === 'admin' && adminTab === 'overview'
    },
    {
      id: 'admin-clients',
      label: 'Clients & Projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" strokeWidth="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" strokeWidth="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="2" />
          <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2" />
        </svg>
      ),
      onClick: () => handlePanelClick('clients'),
      isActive: activePanel === 'clients'
    },
    {
      id: 'admin-users',
      label: 'Client Logins & Users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      onClick: () => handleAdminTabClick('users'),
      isActive: activePanel === 'admin' && adminTab === 'users'
    },
    {
      id: 'admin-projects',
      label: 'Project Requests',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      onClick: () => handleAdminTabClick('projects'),
      isActive: activePanel === 'admin' && adminTab === 'projects'
    },
    {
      id: 'admin-orders',
      label: 'Store Orders & Sales',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      onClick: () => handleAdminTabClick('orders'),
      isActive: activePanel === 'admin' && adminTab === 'orders'
    },
    {
      id: 'admin-chats',
      label: 'Comms & Leads',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      onClick: () => handleAdminTabClick('chats'),
      isActive: activePanel === 'admin' && adminTab === 'chats'
    }
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Profile Header */}
      <div className="p-3 border-b border-slate-700/50 shrink-0">
        <img
          src="/headshot_nick.png"
          alt="Nicholas Kraemer"
          className="w-full h-28 rounded-xl object-cover object-top mb-2 shadow-md border border-slate-700/60"
        />
        <div className="text-center">
          <div className="font-bold text-white text-sm">Nicholas Kraemer</div>
          {showAdminNav ? (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 bg-emerald-950/60 border border-emerald-500/40 rounded-full text-[10px] font-mono text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ADMIN CONSOLE
            </div>
          ) : (
            <div className="text-[10px] text-slate-400">Business Engineer & Operator</div>
          )}
        </div>
      </div>

      {/* Navigation Links (Scrollable with bottom padding to never overlap user footer) */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        {showAdminNav ? (
          <>
            {/* Section: Admin Site Operations */}
            <div className="px-3 py-1 text-[10px] font-mono font-bold text-slate-500 tracking-wider uppercase">
              Management & Controls
            </div>

            {adminNavItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group relative ${
                  item.isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border-l-2 border-cyan-400 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white border-l-2 border-transparent'
                }`}
              >
                <div className={`shrink-0 transition-transform duration-200 ${item.isActive ? 'scale-110 text-cyan-400' : 'group-hover:scale-105'}`}>
                  {item.icon}
                </div>
                <span className="text-sm truncate">
                  {item.label}
                </span>
              </button>
            ))}

            {/* Section: Executive Actions */}
            <div className="pt-4 pb-1 px-3 text-[10px] font-mono font-bold text-slate-500 tracking-wider uppercase border-t border-slate-700/40 mt-3">
              Executive Tools
            </div>

            {/* Quick Action: Download CV PDF */}
            <button
              onClick={() => {
                openCvInfographicPrintWindow();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-emerald-900/30 hover:text-emerald-300 border-l-2 border-transparent hover:border-emerald-400 transition-all text-left group"
              title="Open printable executive infographic CV dossier"
            >
              <div className="shrink-0 text-emerald-400 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium block truncate">Download CV (PDF)</span>
                <span className="text-[9px] text-slate-500 font-mono block truncate">Executive Dossier</span>
              </div>
            </button>

            {/* Quick Action: Preview Public Site */}
            <button
              onClick={() => {
                if (setAdminPreviewMode) {
                  setAdminPreviewMode(true);
                  setActivePanel('home');
                }
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-cyan-900/30 hover:text-cyan-300 border-l-2 border-transparent hover:border-cyan-400 transition-all text-left group"
              title="Preview public visitor site without logging out"
            >
              <div className="shrink-0 text-cyan-400 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium block truncate">Preview Public Site</span>
                <span className="text-[9px] text-slate-500 font-mono block truncate">Visitor View</span>
              </div>
            </button>
          </>
        ) : (
          <>
            {/* If in admin preview mode, provide a button to exit back */}
            {adminPreviewMode && (
              <div className="mb-2 p-2 bg-amber-950/40 border border-amber-500/40 rounded-lg">
                <button
                  onClick={() => {
                    if (setAdminPreviewMode) setAdminPreviewMode(false);
                    setActivePanel('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs py-1.5 px-2 rounded font-bold transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <span>⚡</span>
                  <span>Exit Public Preview</span>
                </button>
              </div>
            )}

            {orderedPanels.map((panel) => {
              const isActive = activePanel === panel.id;
              return (
                <button
                  key={panel.id}
                  onClick={() => handlePanelClick(panel.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-left group relative ${
                    isActive
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
          </>
        )}
      </div>

      {/* User / Auth Button (Sticky Bottom) */}
      <div className="p-3 border-t border-slate-700/50 shrink-0 bg-slate-800/90 backdrop-blur-md">
        <button
          onClick={user ? logout : onOpenAuth}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative ${
            isAdmin
              ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40'
              : user
              ? 'text-blue-400 bg-blue-900/20 border border-blue-500/20 hover:bg-blue-900/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50 border border-transparent'
          }`}
          title={user ? 'Click to Sign Out' : 'Sign in to client portal'}
        >
          {user ? (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-sm shrink-0 border ${
              isAdmin
                ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-700 text-blue-300 border-blue-500/40'
            }`}>
              {user.username.charAt(0).toUpperCase()}
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          )}
          <div className="flex-1 min-w-0 text-left">
            <span className="text-sm font-medium truncate block">
              {user ? user.username : 'Client Login'}
            </span>
            {user && (
              <span className="text-[10px] text-slate-400 font-mono block truncate">
                {isAdmin ? 'Sign Out (Admin)' : 'Sign Out'}
              </span>
            )}
          </div>
          {user && (
            <span className={`w-2 h-2 rounded-full shrink-0 ${isAdmin ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-blue-500'}`}></span>
          )}
        </button>
      </div>
    </div>
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
            <div className="text-[10px] text-slate-400">
              {showAdminNav ? 'Admin Console' : 'Business Engineer'}
            </div>
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
      <nav className="hidden lg:flex flex-col bg-slate-800/90 backdrop-blur-xl border-r border-slate-700/50 h-full shadow-xl z-50 w-60">
        <NavContent />
      </nav>
    </>
  );
};

export default Sidebar;
