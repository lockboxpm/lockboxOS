import React from 'react';

interface PanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const Panel: React.FC<PanelProps> = ({ title, children, className = '', noPadding = false }) => {
  return (
    <div className={`glass-panel rounded-xl overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/5 ${className}`}>
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-white/5 bg-slate-900/40 flex items-center gap-2">
        <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-700/50 border border-slate-600"></div>
            <div className="w-3 h-3 rounded-full bg-slate-700/50 border border-slate-600"></div>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-slate-200 font-mono ml-4 tracking-tight">{title}</h2>
      </div>
      
      {/* Content Area */}
      <div className={noPadding ? '' : 'p-6 md:p-8'}>
        {children}
      </div>
    </div>
  );
};

export default Panel;