import React, { useState } from 'react';
import Panel from '../Panel';

interface LendingInquiryData {
    name: string;
    email: string;
    phone: string;
    region: 'United States' | 'Costa Rica';
    assetType: string;
    financingType: string;
    amount: string;
    details: string;
}

const LendingPanel: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState<LendingInquiryData>({
        name: '',
        email: '',
        phone: '',
        region: 'United States',
        assetType: '',
        financingType: 'Bridge Financing',
        amount: '',
        details: ''
    });

    const openInquiry = (region: 'United States' | 'Costa Rica') => {
        setFormData(prev => ({ ...prev, region }));
        setSubmitted(false);
        setErrorMessage(null);
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmitInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.email.includes('@')) {
            setErrorMessage('Please provide your name and a valid email address.');
            return;
        }

        setSubmitting(true);
        setErrorMessage(null);

        try {
            const response = await fetch('/api/send-lending-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to submit financing inquiry');
            }

            setSubmitted(true);
        } catch (err: any) {
            console.error('Inquiry submission error:', err);
            setErrorMessage(err.message || 'There was an issue sending your inquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Panel title="~/private_lending_advisory">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center pb-6 border-b border-slate-700/50">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-400 text-sm font-medium mb-4 border border-amber-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        Private Capital & Advisory
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Private Lending & Capital Access
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        If you are interested in private lending or debt financing in either region, please submit an inquiry below. We work with established private capital partners to help structure solutions for qualified assets.
                    </p>
                </div>

                {/* Regional Options Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* US Private Lending */}
                    <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 shadow-xl flex flex-col justify-between">
                        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl">🇺🇸</span>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                                United States
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">US Private Lending</h3>
                                    </div>
                                </div>

                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    Private capital advisory for real estate investors, developers, and commercial operators seeking flexible, non-bank debt structuring.
                                </p>

                                {/* Terms Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                                        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Indicative Rates</div>
                                        <div className="font-bold text-blue-400">7.5% – 12% APR</div>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                                        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Target LTV</div>
                                        <div className="text-white font-bold">Up to 75% – 85%</div>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                                        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Term Length</div>
                                        <div className="text-white font-bold">6 – 36 Months</div>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                                        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Typical Origination</div>
                                        <div className="text-white font-bold">1% – 2% Points</div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-6">
                                    <div className="text-xs uppercase tracking-wide text-slate-500 mb-3">Asset & Project Types</div>
                                    <div className="flex flex-wrap gap-2">
                                        {['Commercial Real Estate', 'Bridge Financing', 'Multifamily Acquisition', 'Fix & Flip', 'Ground-Up Construction', 'Refinancing'].map((feature, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md border border-slate-600/30">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => openInquiry('United States')}
                                className="w-full py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                            >
                                Inquire About US Financing &rarr;
                            </button>
                        </div>
                    </div>

                    {/* Costa Rica Private Capital */}
                    <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 border border-emerald-500/40 hover:border-emerald-400/60 transition-all duration-300 shadow-xl shadow-emerald-500/5 flex flex-col justify-between">
                        <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
                        <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl">🇨🇷</span>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                Costa Rica
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Costa Rica Private Capital</h3>
                                    </div>
                                    <span className="px-2 py-1 bg-emerald-500/15 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wide border border-emerald-500/30">
                                        Direct Assets
                                    </span>
                                </div>

                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    Asset-backed debt financing and private capital for Costa Rica real estate, hospitality resorts, titled land development, and construction.
                                </p>

                                {/* Terms Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                                        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Indicative Rates</div>
                                        <div className="font-bold text-emerald-400">10% – 14% Annual</div>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                                        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Target LTV</div>
                                        <div className="text-white font-bold">50% LTV Maximum</div>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                                        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Term Length</div>
                                        <div className="text-white font-bold">12 – 60 Months</div>
                                    </div>
                                    <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                                        <div className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">Collateral Security</div>
                                        <div className="text-white font-bold">1st Lien Mortgage</div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-6">
                                    <div className="text-xs uppercase tracking-wide text-slate-500 mb-3">Asset & Project Types</div>
                                    <div className="flex flex-wrap gap-2">
                                        {['Titled Land & Parcels', 'Eco-Resorts & Hospitality', 'Residential Development', 'Commercial Infrastructure', 'Bridge Capital', 'Refinancing'].map((feature, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md border border-slate-600/30">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => openInquiry('Costa Rica')}
                                className="w-full py-3 rounded-xl font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                            >
                                Inquire About Costa Rica Financing &rarr;
                            </button>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                    <p className="text-xs text-slate-500 text-center leading-relaxed">
                        <strong className="text-slate-400">Disclosure:</strong> Lockbox Portfolio Management operates as an independent financial and systems advisory consultant assisting in deal packaging and financial structuring. We do not act as direct banking institutions. All loan terms, interest rates, and commitments are subject to formal underwriting and approval by independent private capital sources.
                    </p>
                </div>

                {/* Interactive Financing Inquiry Modal */}
                {isModalOpen && (
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
                    >
                        <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in relative max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>

                            {submitted ? (
                                <div className="text-center py-8 space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-3xl font-bold">
                                        ✓
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Inquiry Submitted</h3>
                                    <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                                        Thank you, <strong>{formData.name}</strong>. Your financing inquiry for <strong>{formData.region}</strong> has been transmitted directly to our advisory desk. A confirmation has been sent to <code>{formData.email}</code>.
                                    </p>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-6 rounded-lg transition-colors text-sm"
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                                    <div className="border-b border-slate-800 pb-3">
                                        <h3 className="text-xl font-bold text-white">Private Financing Inquiry</h3>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Provide your asset details and target capital requirements.
                                        </p>
                                    </div>

                                    {/* Region Selector */}
                                    <div>
                                        <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Target Region</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, region: 'United States' })}
                                                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${formData.region === 'United States' ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                                            >
                                                🇺🇸 United States
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, region: 'Costa Rica' })}
                                                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${formData.region === 'Costa Rica' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                                            >
                                                🇨🇷 Costa Rica
                                            </button>
                                        </div>
                                    </div>

                                    {/* Asset or Business */}
                                    <div>
                                        <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Asset or Business to Finance *</label>
                                        <input
                                            type="text"
                                            name="assetType"
                                            required
                                            value={formData.assetType}
                                            onChange={handleInputChange}
                                            placeholder="e.g. 16-unit multifamily, eco-resort in Uvita, contracting firm"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Financing Structure */}
                                        <div>
                                            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Financing Type</label>
                                            <select
                                                name="financingType"
                                                value={formData.financingType}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                                            >
                                                <option value="Bridge Financing">Bridge Loan</option>
                                                <option value="Acquisition / Purchase">Acquisition / Purchase</option>
                                                <option value="Ground-Up Construction">Ground-Up Construction</option>
                                                <option value="Refinance / Equity Cash-Out">Refinance / Cash-Out</option>
                                                <option value="Working Capital / Business Debt">Business Working Capital</option>
                                            </select>
                                        </div>

                                        {/* Capital Amount */}
                                        <div>
                                            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Target Amount ($)</label>
                                            <input
                                                type="text"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleInputChange}
                                                placeholder="e.g. $500,000 or $2.5M"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Project Overview Details */}
                                    <div>
                                        <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Project Details / Current Status</label>
                                        <textarea
                                            name="details"
                                            rows={3}
                                            value={formData.details}
                                            onChange={handleInputChange}
                                            placeholder="Briefly describe property value, current debt/equity, timeline, or key objectives..."
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>

                                    {/* Contact Information */}
                                    <div className="border-t border-slate-800 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Your Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Email Address *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="john@example.com"
                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">Phone Number (Optional)</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>

                                    {errorMessage && (
                                        <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-xs">
                                            {errorMessage}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 mt-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Submitting Inquiry...</span>
                                            </>
                                        ) : (
                                            <span>Send Financing Inquiry</span>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Panel>
    );
};

export default LendingPanel;
