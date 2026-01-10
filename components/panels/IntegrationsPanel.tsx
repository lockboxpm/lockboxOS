import React from 'react';
import Panel from '../Panel';
import { useData } from '../../contexts/DataContext';

// Color-coded category configurations with gradient accents
const categoryColors: Record<string, { gradient: string, border: string, text: string, bg: string }> = {
  'erp': { gradient: 'from-orange-500 to-red-600', border: 'border-orange-500/30', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  'automation': { gradient: 'from-violet-500 to-purple-600', border: 'border-violet-500/30', text: 'text-violet-400', bg: 'bg-violet-500/10' },
  'financial': { gradient: 'from-emerald-500 to-green-600', border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  'property': { gradient: 'from-blue-500 to-cyan-600', border: 'border-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-500/10' },
  'service': { gradient: 'from-amber-500 to-yellow-600', border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  'ai': { gradient: 'from-pink-500 to-rose-600', border: 'border-pink-500/30', text: 'text-pink-400', bg: 'bg-pink-500/10' },
  'data': { gradient: 'from-cyan-500 to-teal-600', border: 'border-cyan-500/30', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  'crm': { gradient: 'from-indigo-500 to-blue-600', border: 'border-indigo-500/30', text: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  'devops': { gradient: 'from-slate-500 to-zinc-600', border: 'border-slate-400/30', text: 'text-slate-300', bg: 'bg-slate-500/10' },
  'legal': { gradient: 'from-fuchsia-500 to-purple-600', border: 'border-fuchsia-500/30', text: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
};

// Integration categories with tools and metadata
const integrationData = [
  {
    id: 'erp',
    title: 'ERP & Business Management',
    icon: '🏢',
    tools: [
      { name: 'ERPNext / Frappe', oss: true },
      { name: 'Odoo', oss: true },
      { name: 'SAP Business One' },
      { name: 'Oracle NetSuite' },
      { name: 'Microsoft Dynamics 365' },
      { name: 'Sage Intacct' },
      { name: 'Dolibarr', oss: true },
      { name: 'Tryton', oss: true },
    ]
  },
  {
    id: 'automation',
    title: 'Workflow Automation & Integration',
    icon: '⚡',
    tools: [
      { name: 'n8n', oss: true },
      { name: 'Retool', oss: true },
      { name: 'Make.com' },
      { name: 'Zapier' },
      { name: 'Activepieces', oss: true },
      { name: 'Windmill', oss: true },
      { name: 'Temporal', oss: true },
      { name: 'Apache Airflow', oss: true },
      { name: 'Prefect', oss: true },
      { name: 'Huginn', oss: true },
      { name: 'Node-RED', oss: true },
    ]
  },
  {
    id: 'ai',
    title: 'AI & Agentic Systems',
    icon: '🤖',
    tools: [
      { name: 'LangChain', oss: true },
      { name: 'Flowise', oss: true },
      { name: 'Dify', oss: true },
      { name: 'Ollama', oss: true },
      { name: 'OpenWebUI', oss: true },
      { name: 'LocalAI', oss: true },
      { name: 'Google Gemini' },
      { name: 'OpenAI GPT-4' },
      { name: 'Anthropic Claude' },
      { name: 'CrewAI', oss: true },
      { name: 'AutoGen', oss: true },
    ]
  },
  {
    id: 'data',
    title: 'Data & Database Systems',
    icon: '💾',
    tools: [
      { name: 'PostgreSQL', oss: true },
      { name: 'Supabase', oss: true },
      { name: 'NocoDB', oss: true },
      { name: 'Baserow', oss: true },
      { name: 'Metabase', oss: true },
      { name: 'Apache Superset', oss: true },
      { name: 'Grafana', oss: true },
      { name: 'Redash', oss: true },
      { name: 'dbt', oss: true },
      { name: 'Airbyte', oss: true },
      { name: 'Meltano', oss: true },
    ]
  },
  {
    id: 'financial',
    title: 'Accounting & Finance',
    icon: '💰',
    tools: [
      { name: 'QuickBooks Online' },
      { name: 'QuickBooks Desktop' },
      { name: 'Xero' },
      { name: 'FreshBooks' },
      { name: 'Wave', oss: true },
      { name: 'Akaunting', oss: true },
      { name: 'InvoiceNinja', oss: true },
      { name: 'Ledger', oss: true },
      { name: 'GnuCash', oss: true },
      { name: 'Firefly III', oss: true },
    ]
  },
  {
    id: 'property',
    title: 'Property & Real Estate',
    icon: '🏠',
    tools: [
      { name: 'AppFolio' },
      { name: 'Yardi Voyager' },
      { name: 'Buildium' },
      { name: 'RealPage' },
      { name: 'Rent Manager' },
      { name: 'DoorLoop' },
      { name: 'MRI Software' },
      { name: 'Cozy', oss: true },
      { name: 'Landlord Studio' },
    ]
  },
  {
    id: 'service',
    title: 'Service & Field Operations',
    icon: '🔧',
    tools: [
      { name: 'ServiceTitan' },
      { name: 'Jobber' },
      { name: 'Housecall Pro' },
      { name: 'Spectora' },
      { name: 'Buildertrend' },
      { name: 'FieldPulse' },
      { name: 'CoConstruct' },
      { name: 'InvoicePlane', oss: true },
      { name: 'Crater', oss: true },
    ]
  },
  {
    id: 'crm',
    title: 'CRM & Sales',
    icon: '📊',
    tools: [
      { name: 'Salesforce' },
      { name: 'HubSpot' },
      { name: 'Zoho CRM' },
      { name: 'Pipedrive' },
      { name: 'SuiteCRM', oss: true },
      { name: 'Vtiger', oss: true },
      { name: 'EspoCRM', oss: true },
      { name: 'Twenty', oss: true },
      { name: 'Monica', oss: true },
    ]
  },
  {
    id: 'devops',
    title: 'DevOps & Infrastructure',
    icon: '🖥️',
    tools: [
      { name: 'Docker', oss: true },
      { name: 'Kubernetes', oss: true },
      { name: 'Coolify', oss: true },
      { name: 'CapRover', oss: true },
      { name: 'Portainer', oss: true },
      { name: 'Traefik', oss: true },
      { name: 'Caddy', oss: true },
      { name: 'Nginx', oss: true },
      { name: 'Ansible', oss: true },
      { name: 'Terraform', oss: true },
      { name: 'Pulumi', oss: true },
    ]
  },
  {
    id: 'legal',
    title: 'Legal & Professional Services',
    icon: '⚖️',
    tools: [
      { name: 'Clio' },
      { name: 'Lawmatics' },
      { name: 'PracticePanther' },
      { name: 'Smokeball' },
      { name: 'Litify' },
      { name: 'MyCase' },
      { name: 'TimeSolv' },
    ]
  },
];

const capabilities = [
  { icon: '🔄', text: 'Unify multi-system workflows spanning property management, trust accounting, CRM, field services, and reporting' },
  { icon: '🤖', text: 'Build agentic AI systems for intake, triage, routing, document generation, and decision support' },
  { icon: '🎭', text: 'Create end-to-end browser automations using Playwright for legacy or closed-API environments' },
  { icon: '📋', text: 'Standardize cross-platform data structures for financial accuracy, audit readiness, and scale' },
  { icon: '🏗️', text: 'Deploy self-hosted AI/automation infrastructure with security-first, reliability-focused pipelines' },
  { icon: '🔌', text: 'Connect any system via REST, GraphQL, webhooks, or custom scraping when APIs don\'t exist' },
];

const ToolPill: React.FC<{ name: string, oss?: boolean, colorScheme: typeof categoryColors['erp'] }> = ({ name, oss, colorScheme }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${colorScheme.bg} ${colorScheme.text} border ${colorScheme.border} transition-all hover:scale-105 hover:shadow-md`}>
    {oss && <span className="text-[10px] px-1 py-0.5 rounded bg-green-500/20 text-green-400 font-bold">OSS</span>}
    {name}
  </span>
);

const CategoryCard: React.FC<{ category: typeof integrationData[0] }> = ({ category }) => {
  const colors = categoryColors[category.id] || categoryColors['devops'];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-800/40 border ${colors.border} p-5 hover:bg-slate-800/60 transition-all group`}>
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}></div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{category.icon}</span>
        <h4 className={`font-bold ${colors.text} text-lg`}>{category.title}</h4>
      </div>

      <div className="flex flex-wrap gap-2">
        {category.tools.map((tool, idx) => (
          <ToolPill
            key={idx}
            name={tool.name}
            oss={tool.oss}
            colorScheme={colors}
          />
        ))}
      </div>
    </div>
  );
};

const IntegrationsPanel: React.FC = () => {
  const { isAdmin } = useData();

  return (
    <Panel title="~/integrations_and_workflows">
      <div className="space-y-10">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Integrations & System Workflows</h2>
              <p className="text-slate-500 text-sm">Enterprise systems, automation tools, and open-source infrastructure</p>
            </div>
          </div>
          <p className="text-slate-400 max-w-4xl leading-relaxed">
            I design, integrate, and automate complex operational ecosystems across property management,
            financial operations, ERP systems, and enterprise workflows. Strong focus on <span className="text-green-400 font-medium">open-source tools</span> that
            provide flexibility, cost efficiency, and full control over your infrastructure.
          </p>
        </div>

        {/* OSS Legend */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/20">
          <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400 font-bold">OSS</span>
          <span className="text-sm text-green-300">= Open Source Software — self-hostable, auditable, and fully customizable</span>
        </div>

        {/* Integration Categories Grid */}
        <section>
          <h3 className="text-lg font-bold font-mono text-slate-400 mb-6 flex items-center gap-2">
            <span className="text-violet-400">//</span> Platform Integrations
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {integrationData.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section>
          <h3 className="text-lg font-bold font-mono text-slate-400 mb-6 flex items-center gap-2">
            <span className="text-cyan-400">//</span> Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capabilities.map((cap, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/30 transition-colors">
                <span className="text-xl mt-0.5">{cap.icon}</span>
                <p className="text-slate-300 text-sm leading-relaxed">{cap.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-center">
          <p className="text-slate-300 mb-3">Need help integrating your existing systems or building new automation workflows?</p>
          <p className="text-violet-400 font-medium">Let's discuss your requirements and design a solution.</p>
        </div>
      </div>
    </Panel>
  );
};

export default IntegrationsPanel;