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
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
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

const PricingCard: React.FC<{ title: string, subtitle: string, price: string, per: string, description: string }> = ({ title, subtitle, price, per, description }) => (
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

const TechConsultingPanel: React.FC<ConsultingPanelProps> = ({ setActivePanel }) => {
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
                {/* Visual Hero Overview */}
                <div className="relative mb-8">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-slate-100 tracking-tight mb-3">Consulting & Advisory</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Decades of experience across technology, finance, real estate, and operations—delivered with hands-on precision.
                        </p>
                    </div>

                    {/* Service Category Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                        {/* Technology */}
                        <div className="group glass-panel p-4 text-center hover:border-blue-500/50 transition-all cursor-pointer hover:scale-105">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-3 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-slate-200 text-sm mb-1">Technology</h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">AI • Software • Web</p>
                        </div>

                        {/* Finance */}
                        <div className="group glass-panel p-4 text-center hover:border-cyan-500/50 transition-all cursor-pointer hover:scale-105">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 flex items-center justify-center mb-3 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-slate-200 text-sm mb-1">Finance</h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">CFO • Controller</p>
                        </div>

                        {/* Real Estate */}
                        <div className="group glass-panel p-4 text-center hover:border-teal-500/50 transition-all cursor-pointer hover:scale-105">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-teal-500/20 to-teal-600/10 border border-teal-500/30 flex items-center justify-center mb-3 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-slate-200 text-sm mb-1">Real Estate</h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Commercial • Investment</p>
                        </div>

                        {/* Construction */}
                        <div className="group glass-panel p-4 text-center hover:border-orange-500/50 transition-all cursor-pointer hover:scale-105">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center mb-3 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-slate-200 text-sm mb-1">Construction</h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">GC • Development</p>
                        </div>

                        {/* Operations */}
                        <div className="group glass-panel p-4 text-center hover:border-violet-500/50 transition-all cursor-pointer hover:scale-105">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/30 flex items-center justify-center mb-3 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-slate-200 text-sm mb-1">Operations</h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Automation • Process</p>
                        </div>

                        {/* Leadership */}
                        <div className="group glass-panel p-4 text-center hover:border-amber-500/50 transition-all cursor-pointer hover:scale-105">
                            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center mb-3 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h4 className="font-bold text-slate-200 text-sm mb-1">Leadership</h4>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Executive • Interim</p>
                        </div>
                    </div>

                    {/* Experience Highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-cyan-400 mb-1">20+</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">Years Experience</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-teal-400 mb-1">$500M+</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">Projects Delivered</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-blue-400 mb-1">Gen B</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">CA Contractor Lic</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-amber-400 mb-1">Global</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">US • Costa Rica</div>
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="text-center">
                            <button onClick={() => setIsAdding(!isAdding)} className="btn-secondary text-sm">
                                + Add Custom Service
                            </button>
                        </div>
                    )}
                </div>

                {isAdding && (
                    <div className="glass-panel p-6 mb-6">
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <input className="input-field w-full" placeholder="Title" value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })} required />
                            <input className="input-field w-full" placeholder="Target Audience" value={newService.forWho} onChange={e => setNewService({ ...newService, forWho: e.target.value })} required />
                            <input className="input-field w-full" placeholder="Engagement" value={newService.engagement} onChange={e => setNewService({ ...newService, engagement: e.target.value })} required />
                            <textarea className="input-field w-full" placeholder="Includes (semicolon separated)" value={includesInput} onChange={e => setIncludesInput(e.target.value)} />
                            <button type="submit" className="btn-primary">Save</button>
                        </form>
                    </div>
                )}

                {/* Custom Services (admin added) */}
                {services.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {services.map((service, index) => (
                            <ServiceCard key={index} service={service} isAdmin={isAdmin} onDelete={() => deleteService(index)} />
                        ))}
                    </div>
                )}

                {/* Fixed-Rate Service Packages */}
                <div className="mt-12 pt-10 border-t border-slate-700/50">
                    <div className="text-center mb-10">
                        <h3 className="text-2xl font-bold text-slate-100 mb-2">Fixed-Rate Service Packages</h3>
                        <p className="text-slate-400">Transparent, flat-rate pricing for common engagements</p>
                    </div>

                    {/* Technology & Automation */}
                    <div className="glass-panel p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-100">Technology & Automation</h4>
                                <p className="text-xs text-blue-400">Computer consulting, AI integration & custom development</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-blue-500/30 relative">
                                <div className="absolute -top-2 right-3 bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">FREE</div>
                                <div className="text-2xl font-bold text-slate-100 mb-1">Free Quote</div>
                                <div className="text-blue-400 font-medium text-sm mb-3">AI Integration</div>
                                <p className="text-sm text-slate-400">Custom AI solutions tailored to your business workflows and data.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-blue-500/30 relative">
                                <div className="absolute -top-2 right-3 bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">FREE</div>
                                <div className="text-2xl font-bold text-slate-100 mb-1">Free Quote</div>
                                <div className="text-blue-400 font-medium text-sm mb-3">Custom Software</div>
                                <p className="text-sm text-slate-400">Bespoke applications and business process automation tools.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                                <div className="text-2xl font-bold text-slate-100 mb-1">$500<span className="text-sm font-normal text-slate-500">+</span></div>
                                <div className="text-blue-400 font-medium text-sm mb-3">Simple Websites</div>
                                <p className="text-sm text-slate-400">Professional web presence with modern design and responsive layouts.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                                <div className="text-2xl font-bold text-slate-100 mb-1">$10<span className="text-sm font-normal text-slate-500">/mo</span></div>
                                <div className="text-blue-400 font-medium text-sm mb-3">Website Hosting</div>
                                <p className="text-sm text-slate-400">Reliable hosting with SSL, backups, and ongoing maintenance included.</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-slate-800/30 rounded-lg border-l-4 border-blue-500">
                            <p className="text-sm text-slate-400">
                                <span className="text-blue-400 font-medium">Our approach:</span> We start with a free consultation to understand your needs, then provide a detailed proposal. From simple landing pages to complex business automation—we scale to fit your requirements.
                            </p>
                        </div>
                    </div>

                    {/* Fractional CFO & Controller */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Fractional CFO */}
                        <div className="glass-panel p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-100">Fractional CFO</h4>
                                    <p className="text-xs text-cyan-400">All tiers include AI-powered insights dashboard</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <div>
                                        <div className="font-medium text-slate-100">Annual</div>
                                        <div className="text-xs text-slate-500">AI insights + 90 min annual review</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-slate-100">$5000<span className="text-sm font-normal text-slate-500">/year</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <div>
                                        <div className="font-medium text-slate-100">Monthly</div>
                                        <div className="text-xs text-slate-500">+ Monthly 90 min meetings</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-slate-100">$3000<span className="text-sm font-normal text-slate-500">/month</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-cyan-500/30">
                                    <div>
                                        <div className="font-medium text-cyan-400">Weekly</div>
                                        <div className="text-xs text-slate-500">+ Weekly strategic sessions</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-slate-100">$5000<span className="text-sm font-normal text-slate-500">/month</span></div>
                                        <div className="text-[10px] text-cyan-400">BEST VALUE</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controller Oversight */}
                        <div className="glass-panel p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-100">Controller Oversight</h4>
                                    <p className="text-xs text-amber-400">All tiers include AI-powered insights dashboard</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <div>
                                        <div className="font-medium text-slate-100">Annual</div>
                                        <div className="text-xs text-slate-500">AI insights + 90 min annual review</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-slate-100">$5000<span className="text-sm font-normal text-slate-500">/year</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <div>
                                        <div className="font-medium text-slate-100">Monthly</div>
                                        <div className="text-xs text-slate-500">+ Monthly 90 min meetings</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-slate-100">$3000<span className="text-sm font-normal text-slate-500">/month</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-amber-500/30">
                                    <div>
                                        <div className="font-medium text-amber-400">Weekly</div>
                                        <div className="text-xs text-slate-500">+ Weekly oversight sessions</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-slate-100">$5000<span className="text-sm font-normal text-slate-500">/month</span></div>
                                        <div className="text-[10px] text-amber-400">BEST VALUE</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Law Firm Trust Account Audit Prep */}
                    <div className="glass-panel p-6 mt-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                                <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-100">Law Firm Trust Account Audit Prep</h4>
                                <p className="text-xs text-rose-400">State Bar compliance & IOLTA reconciliation</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-rose-500/30 relative">
                                <div className="absolute -top-2 right-3 bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">POPULAR</div>
                                <div className="text-2xl font-bold text-slate-100 mb-1">$2,500</div>
                                <div className="text-rose-400 font-medium text-sm mb-3">Annual Audit Prep</div>
                                <p className="text-sm text-slate-400">Complete State Bar audit preparation including 3-way reconciliation, client ledger review, and compliance report.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                                <div className="text-2xl font-bold text-slate-100 mb-1">$500<span className="text-sm font-normal text-slate-500">/mo</span></div>
                                <div className="text-rose-400 font-medium text-sm mb-3">Monthly Oversight</div>
                                <p className="text-sm text-slate-400">Ongoing trust account monitoring with monthly reconciliation reports and proactive issue detection.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                                <div className="text-2xl font-bold text-slate-100 mb-1">$1,500</div>
                                <div className="text-rose-400 font-medium text-sm mb-3">Remediation Support</div>
                                <p className="text-sm text-slate-400">Address discrepancies and compliance gaps found during Bar audits or internal reviews.</p>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-800/30 rounded-lg border-l-4 border-rose-500">
                            <p className="text-sm text-slate-400">
                                <span className="text-rose-400 font-medium">Specialized for attorneys:</span> We understand IOLTA requirements, client trust accounting rules, and State Bar compliance standards. Our automated reconciliation tools catch discrepancies before they become problems, keeping your license secure.
                            </p>
                        </div>
                    </div>

                    {/* Real Estate & Construction Consulting */}
                    <div className="mt-10 pt-10 border-t border-slate-700/50">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-100 mb-2">Real Estate & Construction Consulting</h3>
                            <p className="text-slate-400">Decades of hands-on experience in commercial real estate, development, and construction operations</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Commercial & Investment Real Estate */}
                            <div className="glass-panel p-6 hover:border-teal-500/30 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-100">Commercial & Investment Real Estate</h4>
                                        <p className="text-xs text-teal-400">Acquisition, disposition & portfolio strategy</p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li className="flex items-start gap-2"><span className="text-teal-500 mt-1">›</span>Property valuation and market analysis</li>
                                    <li className="flex items-start gap-2"><span className="text-teal-500 mt-1">›</span>Transaction structuring and due diligence</li>
                                    <li className="flex items-start gap-2"><span className="text-teal-500 mt-1">›</span>1031 exchange strategy and execution</li>
                                    <li className="flex items-start gap-2"><span className="text-teal-500 mt-1">›</span>Multifamily, retail, and mixed-use advisory</li>
                                </ul>
                            </div>

                            {/* Construction Consulting */}
                            <div className="glass-panel p-6 hover:border-orange-500/30 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-100">Construction Consulting</h4>
                                        <p className="text-xs text-orange-400">General B Contractor (CA) with 20+ years experience</p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">›</span>Project feasibility and cost estimation</li>
                                    <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">›</span>GC selection and subcontractor management</li>
                                    <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">›</span>Sustainable building and green construction</li>
                                    <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">›</span>Timeline optimization and milestone tracking</li>
                                </ul>
                            </div>

                            {/* Materials Import/Export */}
                            <div className="glass-panel p-6 hover:border-indigo-500/30 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-100">Construction Materials Import/Export</h4>
                                        <p className="text-xs text-indigo-400">International logistics & supplier networks</p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li className="flex items-start gap-2"><span className="text-indigo-500 mt-1">›</span>Supplier sourcing in Latin America & Asia</li>
                                    <li className="flex items-start gap-2"><span className="text-indigo-500 mt-1">›</span>Import/export logistics and customs</li>
                                    <li className="flex items-start gap-2"><span className="text-indigo-500 mt-1">›</span>Quality control and specification verification</li>
                                    <li className="flex items-start gap-2"><span className="text-indigo-500 mt-1">›</span>Cost arbitrage and bulk purchasing strategy</li>
                                </ul>
                            </div>

                            {/* Property Development */}
                            <div className="glass-panel p-6 hover:border-pink-500/30 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-100">Investment & Property Development</h4>
                                        <p className="text-xs text-pink-400">From acquisition to exit strategy</p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li className="flex items-start gap-2"><span className="text-pink-500 mt-1">›</span>Investment thesis and capital stack design</li>
                                    <li className="flex items-start gap-2"><span className="text-pink-500 mt-1">›</span>Development pro-forma and returns modeling</li>
                                    <li className="flex items-start gap-2"><span className="text-pink-500 mt-1">›</span>Entitlement and permitting navigation</li>
                                    <li className="flex items-start gap-2"><span className="text-pink-500 mt-1">›</span>Partnership structuring and investor relations</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border-l-4 border-teal-500">
                            <p className="text-sm text-slate-400">
                                <span className="text-teal-400 font-medium">Experience includes:</span> Multifamily developments, commercial retail, resort hospitality, cross-border construction projects (US/Costa Rica), and sustainable building practices. Holding a California General B Contractor license with expertise spanning residential, commercial, and infrastructure projects.
                            </p>
                        </div>
                    </div>
                </div>
            </Panel>

            {/* Pricing Section */}
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">Engagement Rates</h3>
                    <p className="text-slate-400">Flexible pricing based on project complexity and engagement level</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {/* GTM - Global Team Members */}
                    <div className="glass-panel p-6 flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden border border-emerald-500/20">
                        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                        <h4 className="text-emerald-400 font-mono font-bold text-lg mb-1">GTM</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Global Team Members</p>

                        <div className="mb-4">
                            <span className="text-3xl font-bold text-slate-100">$15+</span>
                            <span className="text-slate-500 text-sm ml-1">/ hr</span>
                        </div>

                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                            Bilingual global staff for full-time or part-time assignments. Versatile task support.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            Country origin varies by language, timezone & budget needs.
                        </p>
                    </div>

                    <PricingCard
                        title="Implementation Team"
                        subtitle="Specialized Staff"
                        price="$50+"
                        per="/ hr"
                        description="Basic bookkeeping, data entry, UX/Web design, and operational support from our vetted network."
                    />
                    <PricingCard
                        title="Systems Architect"
                        subtitle="Technical Experts"
                        price="$100-250"
                        per="/ hr"
                        description="Senior-level systems design, automation development, database architecture, and integration specialists."
                    />
                    {/* Premium - Nick */}
                    <div className="glass-panel p-6 flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden border-2 border-amber-500/30">
                        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"></div>
                        <div className="absolute -top-1 right-4 bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-b">PREMIUM</div>
                        <h4 className="text-amber-400 font-mono font-bold text-lg mb-1">Nicholas Kraemer</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-4">Direct Engagement</p>

                        <div className="mb-4">
                            <span className="text-3xl font-bold text-slate-100">$400-1200</span>
                            <span className="text-slate-500 text-sm ml-1">/ hr</span>
                        </div>

                        <p className="text-sm text-slate-400 leading-relaxed">
                            Direct strategic partnership for high-stakes financial engineering, AI architecture, and executive advisory.
                        </p>
                    </div>
                </div>
                <p className="text-center text-xs text-slate-500 mt-4">
                    Project-based and retainer packages available • Custom quotes for enterprise engagements
                </p>
            </div>

            {/* Project Quote Approach */}
            <div className="glass-panel p-8 max-w-4xl mx-auto">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-100 mb-1">Project Quotes & Estimation</h3>
                        <p className="text-slate-400">How we build realistic budgets for your project</p>
                    </div>
                </div>

                <div className="space-y-4 text-slate-300 leading-relaxed">
                    <p>
                        We believe in <span className="text-cyan-400 font-medium">cost-effective resource allocation</span>.
                        Every project gets matched with the right mix of talent—from implementation staff to senior architects—ensuring
                        you're not overpaying for tasks that don't require premium expertise.
                    </p>

                    <p>
                        Our approach delivers <span className="text-cyan-400 font-medium">A-to-Z budgets with realistic ranges</span>.
                        We use a conservative estimation methodology, leveraging subcontractors and assignment-based work
                        to give you transparent, defensible cost projections.
                    </p>

                    <div className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-cyan-500">
                        <p className="text-sm">
                            <strong className="text-slate-100">Our Philosophy:</strong> Aggressive upfront planning minimizes unknowns.
                            We invest heavily in discovery and scoping phases to reduce surprises down the line.
                            That said, some unknowns are unavoidable depending on project scope—and we're transparent about that from day one.
                        </p>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700/50 flex flex-wrap gap-4 justify-center">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Fixed-price projects available
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Milestone-based billing
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Transparent change orders
                    </div>
                </div>
            </div>

            <div className="text-center pt-8 pb-12">
                <button
                    onClick={() => setActivePanel('communicate')}
                    className="inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white text-lg font-bold py-4 px-10 rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Book 15-Min Consultation
                </button>
                <p className="mt-4 text-xs text-slate-500 font-mono uppercase tracking-widest">No commitment required • Google Meet</p>
            </div>
        </div>
    );
};

export default TechConsultingPanel;