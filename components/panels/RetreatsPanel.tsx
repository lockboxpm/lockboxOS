import React from 'react';
import Panel from '../Panel';
import type { PanelType } from '../../types';

interface RetreatsPanelProps {
    setActivePanel: (panel: PanelType) => void;
}

const RetreatsPanel: React.FC<RetreatsPanelProps> = ({ setActivePanel }) => {
    return (
        <div className="space-y-10">
            <Panel title="~/corporate_retreats">
                <div className="space-y-10">
                    {/* Hero Section */}
                    <div className="relative rounded-2xl overflow-hidden border border-green-500/20">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-green-950/30"></div>

                        <div className="relative p-8 md:p-12">
                            <div className="max-w-3xl">
                                <p className="text-green-400 font-mono text-sm mb-3 uppercase tracking-widest">Curated by Puma Malas • Costa Rica</p>
                                <h2 className="text-3xl md:text-5xl font-bold text-slate-100 mb-4 leading-tight">
                                    High-Impact Corporate Retreats
                                </h2>
                                <p className="text-xl text-slate-300 leading-relaxed mb-6">
                                    Immersive business sessions designed to solve real company problems in a distraction-free environment.
                                    We identify your challenges, bring in specialized experts, and create custom experiences that drive results.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={() => setActivePanel('communicate')}
                                        className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-105"
                                    >
                                        Inquire About Booking
                                    </button>
                                    <a
                                        href="https://www.pumamala.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="border border-green-500/50 text-green-400 hover:bg-green-500/10 font-bold py-3 px-8 rounded-lg transition-all inline-flex items-center gap-2"
                                    >
                                        Visit Puma Malas
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="glass-panel p-8">
                        <h3 className="text-2xl font-bold text-slate-100 mb-6 text-center">How It Works</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="w-14 h-14 mx-auto rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-4">
                                    <span className="text-green-400 font-bold text-xl">1</span>
                                </div>
                                <h4 className="font-bold text-slate-200 mb-2">Discovery Call</h4>
                                <p className="text-sm text-slate-400">We identify your team's challenges, goals, and desired outcomes.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-14 h-14 mx-auto rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-4">
                                    <span className="text-green-400 font-bold text-xl">2</span>
                                </div>
                                <h4 className="font-bold text-slate-200 mb-2">Custom Design</h4>
                                <p className="text-sm text-slate-400">We curate specialists, workshops, and wellness experiences tailored to your needs.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-14 h-14 mx-auto rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-4">
                                    <span className="text-green-400 font-bold text-xl">3</span>
                                </div>
                                <h4 className="font-bold text-slate-200 mb-2">Immersive Retreat</h4>
                                <p className="text-sm text-slate-400">3-7 day intensive sessions at our Costa Rica facilities with world-class amenities.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-14 h-14 mx-auto rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-4">
                                    <span className="text-green-400 font-bold text-xl">4</span>
                                </div>
                                <h4 className="font-bold text-slate-200 mb-2">Actionable Results</h4>
                                <p className="text-sm text-slate-400">Leave with clear plans, documented solutions, and renewed team alignment.</p>
                            </div>
                        </div>
                    </div>

                    {/* What We Address */}
                    <div>
                        <h3 className="text-2xl font-bold text-slate-100 mb-6">Problems We Solve</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 hover:border-green-500/30 transition-colors">
                                <div className="text-green-400 font-mono text-xs mb-2 uppercase tracking-wider">Strategy</div>
                                <h4 className="font-bold text-slate-200 mb-2">Strategic Planning & Vision</h4>
                                <p className="text-sm text-slate-400">Annual planning, market pivots, new product strategy, and executive alignment sessions.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 hover:border-green-500/30 transition-colors">
                                <div className="text-cyan-400 font-mono text-xs mb-2 uppercase tracking-wider">Operations</div>
                                <h4 className="font-bold text-slate-200 mb-2">Process & Workflow Repair</h4>
                                <p className="text-sm text-slate-400">Fix broken processes, implement automation, and design scalable operational systems.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 hover:border-green-500/30 transition-colors">
                                <div className="text-violet-400 font-mono text-xs mb-2 uppercase tracking-wider">Technology</div>
                                <h4 className="font-bold text-slate-200 mb-2">Tech Stack Architecture</h4>
                                <p className="text-sm text-slate-400">System integration planning, AI adoption strategy, and digital transformation roadmaps.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 hover:border-green-500/30 transition-colors">
                                <div className="text-amber-400 font-mono text-xs mb-2 uppercase tracking-wider">Finance</div>
                                <h4 className="font-bold text-slate-200 mb-2">Financial Restructuring</h4>
                                <p className="text-sm text-slate-400">P&L optimization, fundraising preparation, and financial modeling workshops.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 hover:border-green-500/30 transition-colors">
                                <div className="text-rose-400 font-mono text-xs mb-2 uppercase tracking-wider">Culture</div>
                                <h4 className="font-bold text-slate-200 mb-2">Team Alignment & Culture</h4>
                                <p className="text-sm text-slate-400">Leadership development, team building, conflict resolution, and culture redesign.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50 hover:border-green-500/30 transition-colors">
                                <div className="text-blue-400 font-mono text-xs mb-2 uppercase tracking-wider">Growth</div>
                                <h4 className="font-bold text-slate-200 mb-2">Sales & Go-to-Market</h4>
                                <p className="text-sm text-slate-400">Sales process optimization, channel strategy, and market expansion planning.</p>
                            </div>
                        </div>
                    </div>

                    {/* The Experience */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="glass-panel p-6 border-l-4 border-l-green-500">
                            <h4 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                Wellness Integration
                            </h4>
                            <ul className="space-y-3 text-slate-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">›</span>
                                    <span>Jungle and ocean environments for mental clarity</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">›</span>
                                    <span>Sauna and cold plunge recovery sessions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">›</span>
                                    <span>Farm-to-table nutrition and private chef</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">›</span>
                                    <span>Sunrise yoga and guided meditation</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-1">›</span>
                                    <span>Adventure activities: surfing, hiking, waterfall tours</span>
                                </li>
                            </ul>
                        </div>

                        <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
                            <h4 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-3">
                                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Work Facilities
                            </h4>
                            <ul className="space-y-3 text-slate-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-500 mt-1">›</span>
                                    <span>High-speed Starlink connectivity</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-500 mt-1">›</span>
                                    <span>Private executive boardroom and presentation facilities</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-500 mt-1">›</span>
                                    <span>Breakout spaces for small group work</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-500 mt-1">›</span>
                                    <span>Whiteboards, projectors, and collaboration tools</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-500 mt-1">›</span>
                                    <span>On-site technical support and facilitation</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="glass-panel p-8">
                        <h3 className="text-2xl font-bold text-slate-100 mb-2 text-center">Investment</h3>
                        <p className="text-slate-400 text-center mb-8">All-inclusive packages customized to your team size and objectives</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 text-center">
                                <div className="text-3xl font-bold text-slate-100 mb-1">$15,000</div>
                                <div className="text-green-400 font-medium mb-4">3-Day Intensive</div>
                                <p className="text-sm text-slate-400">Up to 8 participants. Focused problem-solving sprint with one specialist track.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-6 border border-green-500/30 text-center relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded">MOST POPULAR</div>
                                <div className="text-3xl font-bold text-slate-100 mb-1">$35,000</div>
                                <div className="text-green-400 font-medium mb-4">5-Day Deep Dive</div>
                                <p className="text-sm text-slate-400">Up to 12 participants. Comprehensive sessions with multiple specialist tracks and full wellness program.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 text-center">
                                <div className="text-3xl font-bold text-slate-100 mb-1">Custom</div>
                                <div className="text-green-400 font-medium mb-4">7+ Day Immersion</div>
                                <p className="text-sm text-slate-400">Larger teams or extended engagements. Full customization including external speakers and adventure expeditions.</p>
                            </div>
                        </div>

                        <p className="text-center text-xs text-slate-500 mt-6">
                            Pricing includes accommodations, meals, facilitators, and all scheduled activities. Airfare not included.
                        </p>
                    </div>
                </div>

                {/* Available Rentals */}
                <div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-6">🏡 Available Rentals</h3>
                    <p className="text-slate-400 mb-6">Book directly for personal retreats or explore our properties before planning a corporate event.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <a
                            href="https://airbnb.com/h/costatortuga"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10"
                        >
                            <div className="relative h-40 bg-gradient-to-br from-green-900/30 to-blue-900/30">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-5xl">🐢</span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h4 className="font-bold text-lg text-slate-100 group-hover:text-green-400 transition-colors">Costa Tortuga</h4>
                                <p className="text-sm text-slate-400 mt-1">Oceanfront villa with stunning Pacific views. Perfect for families or executive retreats.</p>
                                <div className="mt-3 flex items-center gap-2 text-green-400 text-sm font-medium">
                                    View on Airbnb
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </a>

                        <a
                            href="https://airbnb.com/h/pumamala"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10"
                        >
                            <div className="relative h-40 bg-gradient-to-br from-amber-900/30 to-green-900/30">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-5xl">🐆</span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h4 className="font-bold text-lg text-slate-100 group-hover:text-green-400 transition-colors">Puma Mala</h4>
                                <p className="text-sm text-slate-400 mt-1">Jungle retreat with private pool and wildlife sanctuary access. Ideal for immersive experiences.</p>
                                <div className="mt-3 flex items-center gap-2 text-green-400 text-sm font-medium">
                                    View on Airbnb
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </Panel>

            {/* CTA */}
            <div className="text-center pt-4 pb-12">
                <button
                    onClick={() => setActivePanel('communicate')}
                    className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white text-lg font-bold py-4 px-10 rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Start Planning Your Retreat
                </button>
                <p className="mt-4 text-xs text-slate-500 font-mono uppercase tracking-widest">Minimum 90-day lead time recommended</p>
            </div>
        </div>
    );
};

export default RetreatsPanel;

