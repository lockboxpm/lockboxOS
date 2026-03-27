import React from 'react';
import Panel from '../Panel';
import type { PanelType } from '../../types';

interface RealEstateConsultingPanelProps {
    setActivePanel: (panel: PanelType) => void;
}

const RealEstateConsultingPanel: React.FC<RealEstateConsultingPanelProps> = ({ setActivePanel }) => {
    return (
        <div className="space-y-10">
            <Panel title="~/real_estate_consulting">
                <div className="space-y-10">
                    {/* Hero */}
                    <div className="relative rounded-2xl overflow-hidden border border-teal-500/20">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-teal-950/30"></div>

                        <div className="relative p-8 md:p-12">
                            <div className="max-w-3xl">
                                <p className="text-teal-400 font-mono text-sm mb-3 uppercase tracking-widest">CA Licensed Broker & General Contractor</p>
                                <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-4 leading-tight">
                                    Real Estate & Construction Consulting
                                </h2>
                                <p className="text-xl text-slate-300 leading-relaxed mb-6">
                                    Decades of hands-on experience in commercial real estate, development, construction management, and international materials sourcing.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={() => setActivePanel('communicate')}
                                        className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:scale-105"
                                    >
                                        Schedule Consultation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Credentials */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 glass-panel">
                            <div className="text-2xl font-bold text-teal-400 mb-1">20+</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">Years Experience</div>
                        </div>
                        <div className="text-center p-4 glass-panel">
                            <div className="text-2xl font-bold text-orange-400 mb-1">Gen B</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">CA Contractor Lic</div>
                        </div>
                        <div className="text-center p-4 glass-panel">
                            <div className="text-2xl font-bold text-indigo-400 mb-1">Broker</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">CA RE License</div>
                        </div>
                        <div className="text-center p-4 glass-panel">
                            <div className="text-2xl font-bold text-pink-400 mb-1">US + CR</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider">International</div>
                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Commercial Real Estate */}
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
                                    <h4 className="text-lg font-bold text-slate-100">Materials Import/Export</h4>
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
                                    <h4 className="text-lg font-bold text-slate-100">Property Development</h4>
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

                    {/* Experience Note */}
                    <div className="p-4 bg-slate-800/30 rounded-lg border-l-4 border-teal-500">
                        <p className="text-sm text-slate-400">
                            <span className="text-teal-400 font-medium">Experience includes:</span> Multifamily developments, commercial retail, resort hospitality, cross-border construction projects (US/Costa Rica), and sustainable building practices. Holding a California General B Contractor license with expertise spanning residential, commercial, and infrastructure projects.
                        </p>
                    </div>
                </div>
            </Panel>

            {/* CTA */}
            <div className="text-center pt-4 pb-12">
                <button
                    onClick={() => setActivePanel('communicate')}
                    className="inline-flex items-center gap-3 bg-teal-600 hover:bg-teal-500 text-white text-lg font-bold py-4 px-10 rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(20,184,166,0.4)]"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Book Real Estate Consultation
                </button>
                <p className="mt-4 text-xs text-slate-500 font-mono uppercase tracking-widest">No commitment required • Google Meet</p>
            </div>
        </div>
    );
};

export default RealEstateConsultingPanel;
