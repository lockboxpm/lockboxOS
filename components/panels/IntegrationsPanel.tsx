import React from 'react';
import Panel from '../Panel';
import { useData } from '../../contexts/DataContext';

const capabilities = [
  "Unify multi-system workflows that span property management, trust accounting, CRM, field services, and reporting.",
  "Build custom automations for reconciliation, compliance, scheduling, inspections, and financial reviews.",
  "Implement agentic AI systems for intake, triage, routing, document generation, and internal decision support.",
  "Create full end-to-end browser workflows using Playwright to automate legacy or closed-API environments.",
  "Standardize cross-platform data structures for financial accuracy, audit readiness, and operational scale.",
  "Deploy self-hosted AI/automation infrastructure and secure, reliability-focused operational pipelines."
];

const PlatformCategory: React.FC<{ title: string, tools: string[], isAdmin: boolean, onDelete: () => void }> = ({ title, tools, isAdmin, onDelete }) => (
  <div className="relative group">
     {isAdmin && (
        <button 
            onClick={onDelete}
            className="absolute -top-2 -right-2 bg-red-900/50 text-red-200 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-800 text-xs w-6 h-6 flex items-center justify-center"
        >
            ×
        </button>
    )}
    <h4 className="font-semibold text-slate-300 mb-3">{title}</h4>
    <div className="flex flex-wrap gap-2">
      {tools.map((tool, idx) => (
        <span key={idx} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-600">{tool}</span>
      ))}
    </div>
  </div>
);

const IntegrationsPanel: React.FC = () => {
  const { integrationCategories, isAdmin, addIntegrationCategory, deleteIntegrationCategory } = useData();

  const handleAddCategory = () => {
      const title = prompt("Integration Category Title:");
      if (!title) return;
      const toolsStr = prompt("Tools (comma separated):");
      
      addIntegrationCategory({
          id: `int_${Date.now()}`,
          title,
          tools: toolsStr ? toolsStr.split(',').map(s => s.trim()) : []
      });
  };

  return (
    <Panel title="~/integrations_and_workflows">
      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-slate-100">Integrations & System Workflow Capability</h2>
             {isAdmin && (
                <button 
                    onClick={handleAddCategory}
                    className="bg-slate-800 text-cyan-400 px-3 py-1 rounded text-sm border border-slate-600 hover:bg-cyan-900/20"
                >
                    + Add Category
                </button>
             )}
          </div>
          <p className="mt-2 text-slate-400 max-w-4xl">
            I design, integrate, and automate complex operational ecosystems across property management, financial operations, service businesses, field inspection platforms, and enterprise workflow systems.
          </p>
        </div>
        
        <section>
          <h3 className="text-lg font-bold font-mono text-slate-400 mb-4 border-b border-slate-700 pb-2">// Core Platform Domains</h3>
          <div className="space-y-8">
            {integrationCategories.map((cat) => (
              <PlatformCategory 
                key={cat.id} 
                title={cat.title} 
                tools={cat.tools} 
                isAdmin={isAdmin}
                onDelete={() => deleteIntegrationCategory(cat.id)}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold font-mono text-slate-400 mb-4 border-b border-slate-700 pb-2">// Capabilities</h3>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            {capabilities.map((cap, index) => (
              <li key={index}>{cap}</li>
            ))}
          </ul>
        </section>
      </div>
    </Panel>
  );
};

export default IntegrationsPanel;