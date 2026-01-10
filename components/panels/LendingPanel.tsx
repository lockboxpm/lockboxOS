import React from 'react';
import Panel from '../Panel';
import { PanelType } from '../../types';

interface LendingPanelProps {
    setActivePanel: (panel: PanelType) => void;
}

const LendingPanel: React.FC<LendingPanelProps> = ({ setActivePanel }) => {
    const partners = [
        {
            name: 'Searchlight Lending',
            region: 'United States',
            flag: '🇺🇸',
            description: 'Premier US-based private lending partner for real estate investors and developers.',
            features: [
                'Fix & Flip Loans',
                'Bridge Financing',
                'New Construction',
                'Rental Portfolio Loans',
                'Commercial Real Estate'
            ],
            terms: {
                rates: '5-12% APR',
                ltv: 'Up to 95% LTV',
                terms: '6 months - 30 years',
                fees: 'Competitive origination'
            },
            color: 'blue',
            url: 'https://searchlightlending.com'
        },
        {
            name: 'Costa Rica Private Loans',
            region: 'Costa Rica',
            flag: '🇨🇷',
            description: 'Private equity lending for Costa Rica real estate. Collateralized loans backed by property.',
            features: [
                'Property-Backed Loans',
                'Development Financing',
                'Land Acquisition',
                'Construction Loans',
                'Refinancing'
            ],
            terms: {
                rates: '12% Annual Interest',
                ltv: '50% LTV Maximum',
                terms: '6 months - 5 years',
                fees: '7% Total Fees'
            },
            color: 'emerald',
            highlight: true
        }
    ];

    return (
        <Panel title="~/lending_partners">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center pb-6 border-b border-slate-700/50">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-400 text-sm font-medium mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        Private Capital Access
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Lending Partners
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Access private capital for real estate investments in the US and Costa Rica through our trusted lending partners.
                    </p>
                </div>

                {/* Partners Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {partners.map((partner, idx) => (
                        <div
                            key={idx}
                            className={`relative overflow-hidden rounded-2xl bg-slate-800/50 border ${partner.highlight ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/10' : 'border-slate-700/50'} hover:border-${partner.color}-400/50 transition-all duration-300`}
                        >
                            {/* Accent Bar */}
                            <div className={`h-1.5 bg-gradient-to-r ${partner.color === 'blue' ? 'from-blue-500 to-indigo-500' : 'from-emerald-500 to-teal-500'}`} />

                            <div className="p-6">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl">{partner.flag}</span>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${partner.color === 'blue' ? 'bg-blue-500/15 text-blue-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
                                                {partner.region}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{partner.name}</h3>
                                    </div>
                                    {partner.highlight && (
                                        <span className="px-2 py-1 bg-amber-500/15 text-amber-400 text-[10px] font-bold rounded uppercase tracking-wide">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    {partner.description}
                                </p>

                                {/* Terms Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                                        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Interest Rates</div>
                                        <div className={`font-bold ${partner.color === 'blue' ? 'text-blue-400' : 'text-emerald-400'}`}>{partner.terms.rates}</div>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                                        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Loan-to-Value</div>
                                        <div className="text-white font-bold">{partner.terms.ltv}</div>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                                        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Term Length</div>
                                        <div className="text-white font-bold">{partner.terms.terms}</div>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                                        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Fees</div>
                                        <div className="text-white font-bold">{partner.terms.fees}</div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-6">
                                    <div className="text-xs uppercase tracking-wide text-slate-500 mb-3">Loan Products</div>
                                    <div className="flex flex-wrap gap-2">
                                        {partner.features.map((feature, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md border border-slate-600/30">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={() => setActivePanel('communicate')}
                                    className={`w-full py-3 rounded-xl font-medium transition-all ${partner.color === 'blue'
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                        }`}
                                >
                                    Inquire About {partner.name}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                    <p className="text-xs text-slate-500 text-center">
                        <strong className="text-slate-400">Disclosure:</strong> Nicholas Kraemer acts as a referral partner for the lending institutions listed above.
                        All loan terms, rates, and conditions are subject to lender approval and may vary based on borrower qualifications and property characteristics.
                        Contact us for current rates and detailed terms.
                    </p>
                </div>

                {/* Contact CTA */}
                <div className="text-center pt-4">
                    <p className="text-slate-400 mb-4">Ready to discuss financing options?</p>
                    <button
                        onClick={() => setActivePanel('communicate')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 font-medium transition-all hover:border-cyan-500/30"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Schedule a Lending Consultation
                    </button>
                </div>
            </div>
        </Panel>
    );
};

export default LendingPanel;
