import React, { useState } from 'react';
import Panel from '../Panel';
import { useData } from '../../contexts/DataContext';
import { CvExperience, CvEducation, CvSkillCategory } from '../../types';

// Modified Accordion to be always open or toggleable, but default is everything open.
const Section: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onClick: () => void; isAdmin?: boolean; onAdd?: () => void; }> = ({ title, children, isOpen, onClick, isAdmin, onAdd }) => (
    <div className="border-b border-slate-700 last:border-0">
        <h3>
            <div className="flex justify-between items-center w-full p-4 bg-slate-800/30 hover:bg-slate-700/50 transition-colors">
                <button
                    type="button"
                    className="flex-1 text-left font-medium text-slate-300 flex items-center justify-between"
                    onClick={onClick}
                    aria-expanded={isOpen}
                >
                    <span className="text-lg font-semibold">{title}</span>
                    <svg className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" /></svg>
                </button>
                {isAdmin && onAdd && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onAdd(); }}
                        className="ml-4 bg-slate-700 text-cyan-400 px-2 py-1 rounded text-xs hover:bg-slate-600 flex items-center gap-1"
                    >
                        + Add
                    </button>
                )}
            </div>
        </h3>
        <div className={`p-4 bg-slate-800/20 transition-all duration-300 ease-in-out ${isOpen ? 'block opacity-100' : 'hidden opacity-0'}`}>
            {children}
        </div>
    </div>
);

const CvPanel: React.FC = () => {
    const {
        cvExperiences, addCvExperience, deleteCvExperience,
        cvEducation, addCvEducation, deleteCvEducation,
        cvSkills, addCvSkillCategory, deleteCvSkillCategory,
        integrationCategories,
        isAdmin
    } = useData();

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        'bio': true,
        'experience': true,
        'skills': true,
        'licenses': true,
        'education': true
    });

    // Email forward modal state
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    // Simple state for adding items (just using prompts for MVP to save code space)
    // In a full app, these would be modal forms.

    const toggleSection = (id: string) => {
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDownloadPdf = () => {
        // Open print dialog for PDF generation
        // This will print the CV section styled for PDF
        window.print();
    };

    const handleEmailForward = async () => {
        if (!emailInput.trim() || !emailInput.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }

        setEmailStatus('sending');

        try {
            const response = await fetch('/api/send-cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput })
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            setEmailStatus('sent');
            setTimeout(() => {
                setShowEmailModal(false);
                setEmailInput('');
                setEmailStatus('idle');
            }, 2000);
        } catch (err) {
            console.error('Email error:', err);
            setEmailStatus('error');
        }
    };

    const handleAddExperience = () => {
        const role = prompt("Role Title:");
        if (!role) return;
        const company = prompt("Company Name:");
        const period = prompt("Period (e.g., 2020-Present):");
        const respString = prompt("Responsibilities (semicolon separated):");

        addCvExperience({
            id: `exp_${Date.now()}`,
            role,
            company: company || '',
            period: period || '',
            responsibilities: respString ? respString.split(';').map(s => s.trim()) : []
        });
    };

    const handleAddSkillCat = () => {
        const title = prompt("Category Title:");
        if (!title) return;
        const skillsStr = prompt("Skills (comma separated):");
        addCvSkillCategory({
            id: `sk_${Date.now()}`,
            title,
            skills: skillsStr ? skillsStr.split(',').map(s => s.trim()) : []
        });
    };

    const handleAddEducation = () => {
        const degree = prompt("Degree:");
        if (!degree) return;
        const school = prompt("School:");
        const year = prompt("Year:");
        const details = prompt("Details:");
        addCvEducation({
            id: `edu_${Date.now()}`,
            degree,
            school: school || '',
            year: year || '',
            details: details || ''
        });
    };

    return (
        <Panel title="~/home/nicholas_kraemer/CV">
            <div className="space-y-6">
                <div className="flex flex-wrap gap-3 justify-end print:hidden">
                    <button
                        onClick={handleDownloadPdf}
                        className="inline-flex items-center gap-2 bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                        Download CV (PDF)
                    </button>
                    <button
                        onClick={() => setShowEmailModal(true)}
                        className="inline-flex items-center gap-2 bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-md hover:bg-slate-600 transition-colors border border-slate-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                        Forward to Email
                    </button>
                </div>

                {/* Email Modal - Compact Design */}
                {showEmailModal && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 print:hidden"
                        onClick={(e) => { if (e.target === e.currentTarget) { setShowEmailModal(false); setEmailInput(''); setEmailStatus('idle'); } }}
                    >
                        <div className="bg-slate-800 border border-slate-600 rounded-xl p-5 w-full max-w-sm mx-4 shadow-2xl animate-fade-in">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/15 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-100">Send CV to Email</h3>
                                    <p className="text-xs text-slate-400">PDF with cover letter attached</p>
                                </div>
                                <button
                                    onClick={() => { setShowEmailModal(false); setEmailInput(''); setEmailStatus('idle'); }}
                                    className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    placeholder="your@email.com"
                                    className="flex-1 bg-slate-900/70 border border-slate-600 rounded-lg py-2.5 px-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                                    disabled={emailStatus === 'sending' || emailStatus === 'sent'}
                                    autoFocus
                                />
                                <button
                                    onClick={handleEmailForward}
                                    disabled={emailStatus === 'sending' || emailStatus === 'sent' || !emailInput.trim()}
                                    className="px-4 py-2.5 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[90px] justify-center"
                                >
                                    {emailStatus === 'sending' && (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    {emailStatus === 'sent' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                    {emailStatus === 'idle' && 'Send'}
                                    {emailStatus === 'sending' && ''}
                                    {emailStatus === 'sent' && 'Sent!'}
                                    {emailStatus === 'error' && 'Retry'}
                                </button>
                            </div>

                            {emailStatus === 'error' && (
                                <p className="mt-2 text-xs text-red-400">Failed to send. Please try again.</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/20">

                    {/* EXECUTIVE SUMMARY - ENHANCED */}
                    <Section title="Executive Summary" isOpen={openSections['bio']} onClick={() => toggleSection('bio')}>
                        <div className="space-y-4">
                            {/* Key Highlights */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-cyan-500/15 text-cyan-400 rounded-full text-xs font-medium border border-cyan-500/30">🌎 Bilingual (English/Spanish)</span>
                                <span className="px-3 py-1 bg-blue-500/15 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">📊 25+ Years Experience</span>
                                <span className="px-3 py-1 bg-violet-500/15 text-violet-400 rounded-full text-xs font-medium border border-violet-500/30">🏗️ CA Gen B Contractor</span>
                                <span className="px-3 py-1 bg-emerald-500/15 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/30">🏠 CA Real Estate Broker</span>
                                <span className="px-3 py-1 bg-amber-500/15 text-amber-400 rounded-full text-xs font-medium border border-amber-500/30">🤿 SSI Scuba Instructor</span>
                                <span className="px-3 py-1 bg-red-500/15 text-red-400 rounded-full text-xs font-medium border border-red-500/30">🚑 EMT & First Responder</span>
                            </div>
                            <p className="text-slate-400 leading-relaxed">
                                Results-driven and innovative <strong className="text-cyan-400">bilingual (English/Spanish)</strong> financial executive with a strong technical background, extensive experience in financial management, strategic planning, & business development. Proven track record in driving financial performance, optimizing operations, and facilitating organizational growth across <strong className="text-slate-300">US, Costa Rica</strong>, and international markets.
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                Proficient in utilizing software such as SAP, Oracle Financials, Adaptive Insights, Tableau, & Kyriba. Skilled in leveraging advanced mathematical modeling, optimization techniques, & risk analysis to drive data-driven decision-making. Over <strong className="text-slate-300">1000+ dives</strong> as a certified SSI instructor with commercial diving experience.
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                A reliable business leader & field operations manager with decades of technical, business and operational building experience. First responder and EMT at the Golden Gate Bridge with crisis intervention and suicide negotiation training. Proven track record of effective & successful construction project management.
                            </p>
                        </div>
                    </Section>

                    {/* SKILLS - DYNAMIC */}
                    <Section
                        title="Skills & Expertise"
                        isOpen={openSections['skills']}
                        onClick={() => toggleSection('skills')}
                        isAdmin={isAdmin}
                        onAdd={handleAddSkillCat}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-400">
                            {cvSkills.map(cat => (
                                <div key={cat.id} className="relative group">
                                    {isAdmin && (
                                        <button
                                            onClick={() => deleteCvSkillCategory(cat.id)}
                                            className="absolute -top-2 -right-2 bg-red-900 text-red-200 rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    )}
                                    <h4 className="text-cyan-400 font-bold mb-2 font-mono text-sm uppercase">{cat.title}</h4>
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {cat.skills.map((skill, i) => (
                                            <li key={i}>{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* EXPERIENCE - DYNAMIC */}
                    <Section
                        title="Professional Experience"
                        isOpen={openSections['experience']}
                        onClick={() => toggleSection('experience')}
                        isAdmin={isAdmin}
                        onAdd={handleAddExperience}
                    >
                        <div className="space-y-8">
                            {cvExperiences.map(exp => (
                                <div key={exp.id} className="relative group">
                                    {isAdmin && (
                                        <button
                                            onClick={() => deleteCvExperience(exp.id)}
                                            className="absolute top-0 right-0 text-red-400 hover:text-red-200 text-xs opacity-0 group-hover:opacity-100 transition-opacity border border-red-900 bg-red-900/20 px-2 py-1 rounded"
                                        >
                                            Delete Entry
                                        </button>
                                    )}
                                    <div className="flex justify-between items-baseline pr-8">
                                        <h4 className="text-lg font-bold text-slate-200">{exp.role}</h4>
                                        <span className="text-sm text-slate-500 font-mono shrink-0 ml-4">{exp.period}</span>
                                    </div>
                                    <p className="text-cyan-500 text-sm mb-2">{exp.company}</p>
                                    <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                                        {exp.responsibilities.map((res, i) => (
                                            <li key={i}>{res}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* LICENSES - STATIC (Could be made dynamic similarly, skipping for brevity) */}
                    <Section title="Licenses & Certifications" isOpen={openSections['licenses']} onClick={() => toggleSection('licenses')}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-400 text-sm">
                            <p><span className="font-semibold text-slate-300 block">General B Contractor</span> CA License B382267</p>
                            <p><span className="font-semibold text-slate-300 block">California Broker</span> License 01887570</p>
                            <p><span className="font-semibold text-slate-300 block">SSI Open Water Instructor</span> Scuba Schools International</p>
                            <p><span className="font-semibold text-slate-300 block">EMT & Paramedic Assoc.</span> CPR & First Aid, Extrication</p>
                            <p><span className="font-semibold text-slate-300 block">FAA Student Pilot</span> Certificate FF-0219426</p>
                            <p><span className="font-semibold text-slate-300 block">CA Driver's License</span> C, M1 (Commercial A, TN, P, AB)</p>
                        </div>
                    </Section>

                    {/* EDUCATION - DYNAMIC */}
                    <Section
                        title="Education"
                        isOpen={openSections['education']}
                        onClick={() => toggleSection('education')}
                        isAdmin={isAdmin}
                        onAdd={handleAddEducation}
                    >
                        <div className="space-y-4 text-sm">
                            {cvEducation.map(edu => (
                                <div key={edu.id} className="relative group">
                                    {isAdmin && (
                                        <button
                                            onClick={() => deleteCvEducation(edu.id)}
                                            className="absolute top-0 right-0 text-red-400 text-xs opacity-0 group-hover:opacity-100"
                                        >
                                            [Delete]
                                        </button>
                                    )}
                                    <h4 className="text-slate-200 font-bold">{edu.degree}</h4>
                                    <p className="text-slate-400">{edu.school} ({edu.year})</p>
                                    {edu.details && <p className="text-slate-500 text-xs mt-1">{edu.details}</p>}
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* INTEGRATIONS - FIXED */}
                    <Section
                        title="Tech Integrations & Tools"
                        isOpen={openSections['integrations'] ?? true}
                        onClick={() => toggleSection('integrations')}
                    >
                        <div className="space-y-4">
                            {integrationCategories.map(cat => (
                                <div key={cat.id}>
                                    <h4 className="text-cyan-400 font-bold mb-2 font-mono text-sm uppercase">
                                        {cat.title}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {cat.tools.map((tool, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded border border-slate-600/50"
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
            </div>
        </Panel>
    );
};

export default CvPanel;