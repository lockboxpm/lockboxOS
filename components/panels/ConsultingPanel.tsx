import React, { useState } from 'react';
import Panel from '../Panel';
import type { Service, PanelType } from '../../types';
import { useData } from '../../contexts/DataContext';

interface ConsultingPanelProps {
    setActivePanel: (panel: PanelType) => void;
}

const ServiceCard: React.FC<{ service: Service, isAdmin: boolean, onDelete: () => void }> = ({ service, isAdmin, onDelete }) => (
    <div className="glass-panel p-6 flex flex-col h-full relative group hover:border-cyan-500/30 transition-all">
        {isAdmin && (
             <button onClick={(e) => { e.preventDefault(); onDelete(); }} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
        )}
        <h3 className="text-lg font-bold text-slate-100 font-mono mb-1">{service.title}</h3>
        <p className="text-xs text-cyan-400 font-mono mb-4">{service.engagement}</p>
        
        <div className="space-y-4 flex-grow text-sm">
            <div>
                <strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Target</strong>
                <p className="text-slate-300">{service.forWho}</p>
            </div>
            <div>
                <strong className="text-slate-400 uppercase text-[10px] tracking-wider block mb-1">Deliverables</strong>
                <ul className="space-y-1">
                    {service.includes.map(item => (
                        <li key={item} className="flex items-start gap-2 text-slate-400">
                            <span className="text-cyan-500 mt-1">›</span> {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

const PricingCard: React.FC<{title: string, subtitle: string, price: string, per: string, description: string}> = ({title, subtitle, price, per, description}) => (
    <div className="glass-panel p-8 flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        <h4 className="text-cyan-400 font-mono font-bold text-lg mb-1">{title}</h4>
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-6">{subtitle}</p>
        
        <div className="mb-6">
            <span className="text-4xl font-bold text-slate-100">{price}</span>
            <span className="text-slate-500 text-sm ml-1">{per}</span>
        </div>
        
        <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">
            {description}
        </p>
    </div>
);

const ConsultingPanel: React.FC<ConsultingPanelProps> = ({ setActivePanel }) => {
    const { services, isAdmin, addService, deleteService } = useData();
    const [isAdding, setIsAdding] = useState(false);
    const [newService, setNewService] = useState<Service>({ title: '', forWho: '', problems: [], includes: [], engagement: '' });
    const [includesInput, setIncludesInput] = useState('');

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addService({
            ...newService,
            problems: [],
            includes: includesInput.split(';').map(s => s.trim()).filter(s => s)
        });
        setIsAdding(false);
    };

  return (
    <div className="space-y-10">
        <Panel title="~/consulting_services">
            <div className="space-y-10">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Consulting & Advisory</h2>
                        <p className="mt-2 text-slate-400 max-w-2xl text-lg">
                            Strategic guidance and hands-on implementation for financial systems, automation, and tax efficiency.
                        </p>
                    </div>
                     {isAdmin && (
                        <button onClick={() => setIsAdding(!isAdding)} className="btn-secondary text-sm">
                            + Add Service
                        </button>
                    )}
                </div>

                {isAdding && (
                    <div className="glass-panel p-6 mb-6">
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <input className="input-field w-full" placeholder="Title" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
                            <input className="input-field w-full" placeholder="Target Audience" value={newService.forWho} onChange={e => setNewService({...newService, forWho: e.target.value})} required />
                            <input className="input-field w-full" placeholder="Engagement" value={newService.engagement} onChange={e => setNewService({...newService, engagement: e.target.value})} required />
                            <textarea className="input-field w-full" placeholder="Includes (semicolon separated)" value={includesInput} onChange={e => setIncludesInput(e.target.value)} />
                            <button type="submit" className="btn-primary">Save</button>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} isAdmin={isAdmin} onDelete={() => deleteService(index)} />
                    ))}
                </div>
            </div>
        </Panel>

        {/* Pricing Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <PricingCard 
                title="Principal Architect" 
                subtitle="High-Level Strategy" 
                price="$300" 
                per="/ hr"
                description="Direct engagement with Nicholas Kraemer for financial engineering, automation architecture, and complex problem solving."
            />
            <PricingCard 
                title="Implementation Team" 
                subtitle="Specialized Staff" 
                price="$50+" 
                per="/ hr"
                description="Access to our network of specialists for tasks including basic bookkeeping, UX/Web design, and data entry operations."
            />
        </div>

        {/* Retreats */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-700"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
             
             <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                 <div className="flex-1">
                     <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2">Executive Retreats</h3>
                     <p className="text-green-400 font-mono text-sm mb-6 uppercase tracking-wider">The Muse Workshops @ Puma Malas</p>
                     <p className="text-slate-300 leading-relaxed mb-6">
                        Unlock efficiency and repair operational workflows in a distraction-free environment. 
                        We facilitate immersive business design retreats at our proprietary wellness facilities in Costa Rica.
                     </p>
                     <button onClick={() => setActivePanel('contact')} className="bg-green-600/90 hover:bg-green-500 text-white font-bold py-3 px-6 rounded backdrop-blur-sm transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                        Inquire About Booking
                     </button>
                 </div>
                 <div className="w-full md:w-auto flex flex-col gap-3">
                     <div className="glass-panel p-4 min-w-[200px] border-l-4 border-l-green-500">
                         <strong className="block text-slate-200">Wellness</strong>
                         <span className="text-xs text-slate-400">Jungles, Oceans, Saunas</span>
                     </div>
                     <div className="glass-panel p-4 min-w-[200px] border-l-4 border-l-cyan-500">
                         <strong className="block text-slate-200">Work</strong>
                         <span className="text-xs text-slate-400">Automation & Architecture</span>
                     </div>
                 </div>
             </div>
        </div>

        <div className="text-center pt-8 pb-12">
            <button 
                onClick={() => setActivePanel('schedule')} 
                className="inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white text-lg font-bold py-4 px-10 rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Book 30-Min Consultation
            </button>
            <p className="mt-4 text-xs text-slate-500 font-mono uppercase tracking-widest">No commitment required • Google Meet</p>
        </div>
    </div>
  );
};

export default ConsultingPanel;