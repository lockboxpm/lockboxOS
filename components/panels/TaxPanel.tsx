import React from 'react';
import Panel from '../Panel';
import type { PanelType } from '../../types';

interface TaxPanelProps {
    setActivePanel: (panel: PanelType) => void;
}

const TaxPanel: React.FC<TaxPanelProps> = ({ setActivePanel }) => {
    return (
        <div className="space-y-10">
            <Panel title="~/accounting_services">
                <div className="space-y-10">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Accounting Services</h2>
                        <p className="mt-2 text-slate-400 max-w-2xl text-lg">
                            Tax preparation, bookkeeping repair, and regulatory compliance services for individuals and businesses.
                        </p>
                        <p className="mt-2 text-sm text-cyan-400">
                            Holding an active IRS Preparer Tax Identification Number (PTIN), I am equipped to prepare returns and offer informed strategic guidance.
                        </p>
                    </div>

                    {/* Tax Preparation */}
                    <div className="glass-panel p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-slate-100">Tax Preparation Services</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                                <div className="text-2xl font-bold text-slate-100 mb-1">$800</div>
                                <div className="text-violet-400 font-medium text-sm mb-3">Personal 1040 Filing</div>
                                <p className="text-sm text-slate-400">For US expats and US filers with <span className="text-slate-200">under $200k</span> in international assets.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                                <div className="text-2xl font-bold text-slate-100 mb-1">$2,000</div>
                                <div className="text-violet-400 font-medium text-sm mb-3">Complex Expat Filing</div>
                                <p className="text-sm text-slate-400">For US expats and US Filers with <span className="text-slate-200">over $200k</span> in international assets.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-violet-500/30 relative">
                                <div className="absolute -top-2 right-3 bg-violet-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">BUSINESS</div>
                                <div className="text-2xl font-bold text-slate-100 mb-1">$2,500<span className="text-sm font-normal text-slate-500">+</span></div>
                                <div className="text-violet-400 font-medium text-sm mb-3">US Corp / LLC Filing</div>
                                <p className="text-sm text-slate-400">Annual tax filing for US corporations and LLCs. <span className="text-slate-200">S-Corp, C-Corp, partnerships.</span></p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-emerald-500/30 relative">
                                <div className="absolute -top-2 right-3 bg-emerald-500 text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded">NO RISK</div>
                                <div className="text-2xl font-bold text-slate-100 mb-1">$250<span className="text-sm font-normal text-slate-500">/year</span></div>
                                <div className="text-emerald-400 font-medium text-sm mb-3">Prior Year Review</div>
                                <p className="text-sm text-slate-400">Review 3 prior years for missed credits & rebates. <span className="text-emerald-400">$0 if rebate is under $250.</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Bookkeeping Repairs */}
                    <div className="glass-panel p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                                <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-100">Bookkeeping Repairs</h4>
                                <p className="text-xs text-rose-400">Strategic review & cleanup of your financial records</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                                <div className="text-2xl font-bold text-slate-100 mb-1">$1,000</div>
                                <div className="text-rose-400 font-medium text-sm mb-3">Small Business</div>
                                <p className="text-sm text-slate-400">Strategic bookkeeping review for businesses with <span className="text-slate-200">under $1M</span> annual revenue.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                                <div className="text-2xl font-bold text-slate-100 mb-1">$2,500</div>
                                <div className="text-rose-400 font-medium text-sm mb-3">Growth Stage</div>
                                <p className="text-sm text-slate-400">Comprehensive review for businesses with <span className="text-slate-200">$1M – $10M</span> annual revenue.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-rose-500/30 relative">
                                <div className="absolute -top-2 right-3 bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">CUSTOM</div>
                                <div className="text-2xl font-bold text-slate-100 mb-1">By Quote</div>
                                <div className="text-rose-400 font-medium text-sm mb-3">Enterprise</div>
                                <p className="text-sm text-slate-400">Tailored engagement for businesses with <span className="text-slate-200">over $10M</span> annual revenue.</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-slate-800/30 rounded-lg border-l-4 border-rose-500">
                            <p className="text-sm text-slate-400">
                                <span className="text-rose-400 font-medium">What's included:</span> Full assessment of your current bookkeeping state, identification of discrepancies, chart of accounts review, reconciliation status, and a prioritized action plan for repairs.
                            </p>
                        </div>
                    </div>

                    {/* Regulatory Audit & Compliance */}
                    <div className="glass-panel p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-100">Regulatory Audit & Compliance</h4>
                                <p className="text-xs text-amber-400">Audit prep, regulatory compliance, and preventative reviews</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-amber-500/30 relative">
                                <div className="absolute -top-2 right-3 bg-amber-500 text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded">QUOTE</div>
                                <div className="text-2xl font-bold text-slate-100 mb-1">IRS Prep</div>
                                <div className="text-amber-400 font-medium text-sm mb-3">Audit Defense</div>
                                <p className="text-sm text-slate-400">Comprehensive preparation for IRS audits, notices, and correspondence.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-amber-500/30 relative">
                                <div className="absolute -top-2 right-3 bg-amber-500 text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded">QUOTE</div>
                                <div className="text-2xl font-bold text-slate-100 mb-1">DRE Prep</div>
                                <div className="text-amber-400 font-medium text-sm mb-3">Real Estate Audit</div>
                                <p className="text-sm text-slate-400">California DRE audit preparation for brokers and property managers.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                                <div className="text-2xl font-bold text-slate-100 mb-1">$2,500</div>
                                <div className="text-amber-400 font-medium text-sm mb-3">Preventative Audit</div>
                                <p className="text-sm text-slate-400">Proactive compliance review to identify and fix issues before they become problems.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                                <div className="text-2xl font-bold text-slate-100 mb-1">$5,000<span className="text-sm font-normal text-slate-500">/yr</span></div>
                                <div className="text-amber-400 font-medium text-sm mb-3">Ongoing Compliance</div>
                                <p className="text-sm text-slate-400">Annual compliance monitoring with quarterly reviews and documentation.</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-slate-800/30 rounded-lg border-l-4 border-amber-500">
                            <p className="text-sm text-slate-400">
                                <span className="text-amber-400 font-medium">Our approach:</span> We help you prepare for regulatory scrutiny by auditing your own records first. Whether you're facing an IRS inquiry, a California DRE review, or just want peace of mind, we ensure your documentation is complete and defensible.
                            </p>
                        </div>
                    </div>

                    {/* Credit Repair & Debt Relief */}
                    <div className="glass-panel p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-100">Credit Repair & Debt Relief</h4>
                                <p className="text-xs text-green-400">Dispute derogatories, improve credit, and build a debt-free path</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-green-500/30 relative">
                                <div className="absolute -top-2 right-3 bg-green-500 text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded">START HERE</div>
                                <div className="text-2xl font-bold text-slate-100 mb-1">$299</div>
                                <div className="text-green-400 font-medium text-sm mb-3">Credit & Debt Analysis</div>
                                <p className="text-sm text-slate-400">Upload your 3 free reports. We analyze credit, identify disputes, and assess your full debt picture.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                                <div className="text-2xl font-bold text-slate-100 mb-1">$50<span className="text-sm font-normal text-slate-500">/item</span></div>
                                <div className="text-green-400 font-medium text-sm mb-3">Derogatory Dispute</div>
                                <p className="text-sm text-slate-400">Per-item dispute with <span className="text-slate-200">certified letters to all 3 bureaus</span>. We handle the paperwork.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                                <div className="text-2xl font-bold text-slate-100 mb-1">$499</div>
                                <div className="text-green-400 font-medium text-sm mb-3">Credit Repair Strategy</div>
                                <p className="text-sm text-slate-400">Comprehensive credit improvement plan with score optimization and rebuilding roadmap.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
                                <div className="text-2xl font-bold text-slate-100 mb-1">$499</div>
                                <div className="text-green-400 font-medium text-sm mb-3">Debt Relief Strategy</div>
                                <p className="text-sm text-slate-400">Custom debt cleanup plan with budgeting, negotiation strategies, and prioritized payoff roadmap.</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-5 border border-amber-500/30 relative">
                                <div className="absolute -top-2 right-3 bg-amber-500 text-slate-900 text-[9px] font-bold px-2 py-0.5 rounded">IF NEEDED</div>
                                <div className="text-2xl font-bold text-slate-100 mb-1">$50<span className="text-sm font-normal text-slate-500">/each</span></div>
                                <div className="text-amber-400 font-medium text-sm mb-3">Report Request</div>
                                <p className="text-sm text-slate-400">If bureaus don't provide reports, we send certified letters to request them individually.</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-slate-800/30 rounded-lg border-l-4 border-green-500">
                            <p className="text-sm text-slate-400">
                                <span className="text-green-400 font-medium">How it works:</span> Pull your 3 free credit reports from <a href="https://www.annualcreditreport.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">AnnualCreditReport.com</a> and upload them to our secure portal. If a bureau isn't providing your report, we'll help you request it via certified mail. We'll analyze everything, then you choose which services you need—disputes, credit repair strategy, debt relief, or all of the above.
                            </p>
                        </div>
                    </div>

                    {/* Strategic Advisory */}
                    <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-cyan-400 font-mono mb-4">Strategic Focus Areas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-cyan-500 mt-1">›</span>
                                    <div>
                                        <strong className="text-slate-200">US Expat & FEIE Strategy</strong>
                                        <p className="text-sm text-slate-400">Navigating the complexities of the Foreign Earned Income Exclusion and other tax considerations for Americans abroad.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-cyan-500 mt-1">›</span>
                                    <div>
                                        <strong className="text-slate-200">Business Structuring</strong>
                                        <p className="text-sm text-slate-400">Guidance on S-corps, LLCs, and cross-border entity structures to optimize tax outcomes.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-cyan-500 mt-1">›</span>
                                    <div>
                                        <strong className="text-slate-200">Systemizing Documentation</strong>
                                        <p className="text-sm text-slate-400">Implementing automated workflows to ensure meticulous record-keeping and audit readiness.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-cyan-500 mt-1">›</span>
                                    <div>
                                        <strong className="text-slate-200">Compliance Frameworks</strong>
                                        <p className="text-sm text-slate-400">Designing and implementing systems to meet regulatory requirements in real estate and finance.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Panel>

            {/* CTA */}
            <div className="text-center pt-4 pb-12">
                <button
                    onClick={() => setActivePanel('communicate')}
                    className="inline-flex items-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white text-lg font-bold py-4 px-10 rounded-full transition-all hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Book 15-Min Consultation
                </button>
                <p className="mt-4 text-xs text-slate-500 font-mono uppercase tracking-widest">Free initial consultation • Google Meet</p>
            </div>
        </div>
    );
};

export default TaxPanel;
