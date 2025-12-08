import React from 'react';
import type { PanelType } from '../types';
import { PANELS } from '../constants';
import { useData } from '../contexts/DataContext';

interface SidebarProps {
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  onOpenAuth?: () => void;
}

const KaliDragonIcon = () => (
    <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
        <path d="M100 25C100 25 112.5 37.5 112.5 56.25C112.5 75 100 81.25 100 81.25" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M100 81.25C100 81.25 87.5 75 87.5 56.25C87.5 37.5 100 25 100 25" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M112.5 56.25C143.75 50 168.75 68.75 175 81.25C175 81.25 162.5 81.25 150 87.5C137.5 93.75 100 81.25 100 81.25" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M87.5 56.25C56.25 50 31.25 68.75 25 81.25C25 81.25 37.5 81.25 50 87.5C62.5 93.75 100 81.25 100 81.25" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M100 81.25V175" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M100 175C118.75 162.5 118.75 137.5 100 125" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M100 175C81.25 162.5 81.25 137.5 100 125" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M100 125C112.5 118.75 125 112.5 125 100" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M100 125C87.5 118.75 75 112.5 75 100" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const Sidebar: React.FC<SidebarProps> = ({ activePanel, setActivePanel, onOpenAuth }) => {
  const { user, logout, isAdmin } = useData();

  return (
    <nav className="hidden lg:flex flex-col items-center bg-slate-900/60 backdrop-blur-xl border-r border-white/5 p-3 space-y-4 h-full shadow-2xl z-50">
      <div className="p-2 mb-4 hover:scale-105 transition-transform cursor-default">
        <KaliDragonIcon />
      </div>
      
      <div className="flex-1 w-full space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        {PANELS.map((panel) => {
           const isActive = activePanel === panel.id;
           return (
            <button
              key={panel.id}
              onClick={() => setActivePanel(panel.id)}
              className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-300 group relative ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] border border-cyan-500/30'
                  : 'text-slate-500 hover:bg-slate-800/80 hover:text-slate-200 border border-transparent'
              }`}
              title={panel.title}
            >
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {panel.icon}
              </div>
              <span className={`text-[9px] font-bold mt-1.5 uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-1 ${isActive ? 'opacity-100' : ''}`}>
                  {panel.title.split(' ')[0]}
              </span>
              
              {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
              )}
            </button>
           );
        })}
      </div>
        
      {/* User / Auth Button */}
      <button 
          onClick={user ? logout : onOpenAuth}
          className={`mt-auto mb-4 p-3 rounded-xl transition-all duration-300 relative group border ${
              isAdmin ? 'border-green-500/30 text-green-400 bg-green-900/10 hover:bg-green-500/20' : 
              user ? 'border-cyan-500/30 text-cyan-400 bg-cyan-900/10 hover:bg-cyan-500/20' : 
              'border-slate-700 text-slate-500 hover:text-slate-200 hover:border-slate-500 hover:bg-slate-800'
          }`}
          title={user ? `Logged in as ${user.username}` : "Guest Login"}
      >
          {user ? (
              <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold font-mono text-sm border border-current shadow-lg">
                  {user.username.charAt(0).toUpperCase()}
              </div>
          ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          )}
          
          {/* Status Dot */}
          {user && (
                <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 shadow-lg ${isAdmin ? 'bg-green-500 animate-pulse' : 'bg-cyan-500'}`}></span>
          )}
      </button>

      <div className="text-[10px] text-slate-700 font-mono mb-2 select-none rotate-180" style={{writingMode: 'vertical-rl'}}>
          SYS.V2.0.4
      </div>
    </nav>
  );
};

export default Sidebar;