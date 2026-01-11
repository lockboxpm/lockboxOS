import React, { useState, useEffect } from 'react';
import { PanelType } from './types';
import { PANELS } from './constants';
import Sidebar from './components/Sidebar';
import HomePanel from './components/panels/HomePanel';
import CvPanel from './components/panels/CvPanel';
import ProfilePanel from './components/panels/ProfilePanel';
import ClientProjectsPanel from './components/panels/ClientProjectsPanel';
import AdminPanel from './components/panels/AdminPanel';
import TechConsultingPanel from './components/panels/TechConsultingPanel';
import RealEstateConsultingPanel from './components/panels/RealEstateConsultingPanel';
import TaxPanel from './components/panels/TaxPanel';
import CommunicatePanel from './components/panels/CommunicatePanel';
import IntegrationsPanel from './components/panels/IntegrationsPanel';
import ClientsPanel from './components/panels/ClientsPanel';
import IntakePanel from './components/panels/IntakePanel';
import StorePanel from './components/panels/StorePanel';
import RetreatsPanel from './components/panels/RetreatsPanel';
import LendingPanel from './components/panels/LendingPanel';
import ChatWidget from './components/ChatWidget';
import AuthModal from './components/AuthModal';
import FloatingCart from './components/FloatingCart';
import { DataProvider } from './contexts/DataContext';
import { CartProvider } from './contexts/CartContext';

// URL slug to panel ID mapping (for short, shareable URLs)
const URL_TO_PANEL: Record<string, PanelType> = {
  '': 'home',
  'home': 'home',
  'intake': 'intake',
  'merch': 'store',
  'store': 'store',
  'cv': 'cv',
  'profile': 'cv',
  'clients': 'clients',
  'projects': 'clients',
  'tech': 'tech-consulting',
  'consulting': 'tech-consulting',
  'realestate': 'realestate-consulting',
  'real-estate': 'realestate-consulting',
  'tax': 'tax',
  'accounting': 'tax',
  'retreats': 'retreats',
  'lending': 'lending',
  'contact': 'communicate',
  'communicate': 'communicate',
  'admin': 'admin',
};

// Panel ID to preferred URL slug (for consistent URLs)
const PANEL_TO_URL: Record<PanelType, string> = {
  'home': '',
  'intake': 'intake',
  'store': 'merch',
  'cv': 'cv',
  'clients': 'clients',
  'tech-consulting': 'consulting',
  'realestate-consulting': 'real-estate',
  'tax': 'accounting',
  'retreats': 'retreats',
  'lending': 'lending',
  'communicate': 'contact',
  'integrations': 'integrations',
  'profile': 'my-profile',
  'myprojects': 'my-projects',
  'admin': 'admin',
};

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

// Get initial panel from URL
const getInitialPanel = (): PanelType => {
  const path = window.location.pathname.slice(1).toLowerCase();
  return URL_TO_PANEL[path] || 'home';
};

const AppContent: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>(getInitialPanel);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync URL when panel changes
  useEffect(() => {
    const urlSlug = PANEL_TO_URL[activePanel] || '';
    const newPath = urlSlug ? `/${urlSlug}` : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  }, [activePanel]);

  // Scroll to top on initial mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1).toLowerCase();
      const panel = URL_TO_PANEL[path] || 'home';
      setActivePanel(panel);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPanel = () => {
    switch (activePanel) {
      case 'home': return <HomePanel setActivePanel={setActivePanel} />;
      case 'cv': return <CvPanel />;
      case 'tech-consulting': return <TechConsultingPanel setActivePanel={setActivePanel} />;
      case 'realestate-consulting': return <RealEstateConsultingPanel setActivePanel={setActivePanel} />;
      case 'integrations': return <IntegrationsPanel />;
      case 'tax': return <TaxPanel setActivePanel={setActivePanel} />;
      case 'communicate': return <CommunicatePanel />;
      case 'clients': return <ClientsPanel />;
      case 'intake': return <IntakePanel setActivePanel={setActivePanel} />;
      case 'store': return <StorePanel />;
      case 'retreats': return <RetreatsPanel setActivePanel={setActivePanel} />;
      case 'lending': return <LendingPanel setActivePanel={setActivePanel} />;
      case 'profile': return <ProfilePanel />;
      case 'myprojects': return <ClientProjectsPanel />;
      case 'admin': return <AdminPanel />;
      default: return <HomePanel setActivePanel={setActivePanel} />;
    }
  };

  const activePanelData = PANELS.find(p => p.id === activePanel) || PANELS[0];

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-900 text-slate-200 selection:bg-blue-500/30 selection:text-blue-100">

      {/* --- SIMPLIFIED BACKGROUND --- */}

      {/* 1. Clean Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

      {/* 2. Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent z-0"></div>

      {/* 3. Soft radial glow */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08)_0%,transparent_50%)]"></div>

      {/* 4. Pi Watermark Branding */}
      <div className="absolute bottom-0 right-0 z-0 pointer-events-none opacity-[0.03]">
        <img src="/pi_alpha.png" alt="" className="w-[500px] h-[500px] object-contain" />
      </div>

      {/* --- CONTENT --- */}

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-slate-800 focus:text-blue-400">
        Skip to content
      </a>

      <div className="z-30 h-full shadow-2xl">
        <Sidebar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      </div>

      <main id="main-content" className="relative z-10 flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent pt-16 lg:pt-0">
        {/* Current Panel Header (mobile) */}
        <div className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md p-3 border-b border-slate-700/50 lg:hidden flex items-center gap-3">
          <div className="text-cyan-400">{activePanelData.icon}</div>
          <h1 className="text-sm font-bold text-slate-100 tracking-wide uppercase font-mono">
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

      <ChatWidget onNavigate={(panel) => setActivePanel(panel as PanelType)} />
      <FloatingCart onNavigate={(panel) => setActivePanel(panel as PanelType)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </CartProvider>
  );
};

export default App;