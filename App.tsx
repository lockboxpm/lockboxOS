import React, { useState } from 'react';
import { PanelType } from './types';
import { PANELS } from './constants';
import Sidebar from './components/Sidebar';
import HomePanel from './components/panels/HomePanel';
import CvPanel from './components/panels/CvPanel';
import ProjectsPanel from './components/panels/ProjectsPanel';
import ConsultingPanel from './components/panels/ConsultingPanel';
import TaxPanel from './components/panels/TaxPanel';
import SchedulePanel from './components/panels/SchedulePanel';
import ContactPanel from './components/panels/ContactPanel';
import ConsolePanel from './components/panels/ConsolePanel';
import IntegrationsPanel from './components/panels/IntegrationsPanel';
import ClientsPanel from './components/panels/ClientsPanel';
import IntakePanel from './components/panels/IntakePanel';
import StorePanel from './components/panels/StorePanel';
import ChatWidget from './components/ChatWidget';
import AuthModal from './components/AuthModal'; 
import { DataProvider } from './contexts/DataContext';

const GlobalKaliWatermark = () => (
  <svg
    viewBox="0 0 245 275"
    fill="currentColor"
    className="w-full h-full opacity-[0.04] text-cyan-500/50"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M122.5 275c-31-3-54-15.8-64.4-48.4-3.4-10.7-3.4-22.3-3.4-33.3V109H29.4c-11.4 0-20.5-9.2-20.5-20.5S18 68.1 29.4 68.1h25.3V29.4C54.7 18 63.8 9 75.2 9c8.6 0 15.8 4.7 19.2 11.4l11.4 22.8c1.3 2.6 3.9 4.3 6.8 4.3h34.8c3 0 5.6-1.8 6.8-4.3l11.4-22.8c3.4-6.8 10.6-11.4 19.2-11.4 11.4 0 20.5 9 20.5 20.4v38.7h25.3c11.4 0 20.5 9.2 20.5 20.5s-9.2 20.5-20.5 20.5h-25.3v84.3c0 11-0.1 22.6-3.4 33.3-10.4 32.6-33.4 45.5-64.4 48.4-5.3 0.5-10.6 0.5-15.9 0h-0.1zM83.4 172.9c1-9.7 11.4-14 20.8-8.7l18.3 10.4c4.8 2.7 10.7 2.7 15.5 0l18.3-10.4c9.4-5.3 19.8-1 20.8 8.7 1.4 13.8-6.8 26.3-19.5 30.6-10.1 3.5-21 3.5-31.1 0-12.7-4.3-20.9-16.8-19.5-30.6z" />
  </svg>
);

const AppContent: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const renderPanel = () => {
    switch (activePanel) {
      case 'home': return <HomePanel setActivePanel={setActivePanel} />;
      case 'cv': return <CvPanel />;
      case 'projects': return <ProjectsPanel />;
      case 'consulting': return <ConsultingPanel setActivePanel={setActivePanel} />;
      case 'integrations': return <IntegrationsPanel />;
      case 'tax': return <TaxPanel />;
      case 'console': return <ConsolePanel />;
      case 'schedule': return <SchedulePanel />;
      case 'contact': return <ContactPanel />;
      case 'clients': return <ClientsPanel />;
      case 'intake': return <IntakePanel setActivePanel={setActivePanel} />;
      case 'store': return <StorePanel />;
      default: return <HomePanel setActivePanel={setActivePanel} />;
    }
  };

  const activePanelData = PANELS.find(p => p.id === activePanel) || PANELS[0];

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-950 text-slate-300 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* --- GLOBAL BACKGROUND LAYERS --- */}
      
      {/* 1. Base Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black"></div>

      {/* 2. Tech Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{
               backgroundImage: `linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(to right, #06b6d4 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
           }}>
      </div>

      {/* 3. Watermark */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="w-[140vh] h-[140vh] transform rotate-12">
             <GlobalKaliWatermark />
          </div>
      </div>

      {/* 4. Vignette for focus */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,6,23,0.9)_100%)]"></div>

      {/* 5. Scanlines (CSS class in index.html) */}
      <div className="scanlines"></div>

      {/* --- CONTENT --- */}

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-slate-800 focus:text-cyan-400">
        Skip to content
      </a>
      
      <div className="z-30 h-full shadow-2xl">
        <Sidebar 
            activePanel={activePanel} 
            setActivePanel={setActivePanel} 
            onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      </div>

      <main id="main-content" className="relative z-10 flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {/* Mobile Header */}
        <div className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md p-4 border-b border-slate-700/50 lg:hidden flex items-center gap-3 shadow-lg">
             <div className="text-cyan-400">{activePanelData.icon}</div>
            <h1 className="text-lg font-bold text-slate-100 tracking-wide uppercase font-mono">
                {activePanelData.title}
            </h1>
        </div>

        {/* Panel Container */}
        <div className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full animate-fade-in">
            {renderPanel()}
        </div>

        {/* Footer info */}
        <div className="p-4 text-center text-[10px] text-slate-600 font-mono opacity-50 pointer-events-none">
            LOCKBOXPM OS v2.0 | ENCRYPTED CONNECTION | <span className="text-green-500">SYSTEM ONLINE</span>
        </div>
      </main>
      
      <ChatWidget />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;