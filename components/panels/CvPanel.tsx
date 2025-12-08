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
            <svg className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/></svg>
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
        isAdmin
    } = useData();

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        'bio': true,
        'experience': true,
        'skills': true,
        'licenses': true,
        'education': true
    });
    
    // Simple state for adding items (just using prompts for MVP to save code space)
    // In a full app, these would be modal forms.
    
    const toggleSection = (id: string) => {
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
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
            <div className="text-right">
                <a href="#" className="inline-block bg-cyan-600 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors">
                    Download CV (PDF)
                </a>
            </div>

            <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/20">
                
                {/* EXECUTIVE SUMMARY - STATIC FOR NOW */}
                <Section title="Executive Summary" isOpen={openSections['bio']} onClick={() => toggleSection('bio')}>
                    <p className="text-slate-400 leading-relaxed mb-4">
                         Results-driven and innovative bilingual (English/Spanish) financial executive with a strong technical background, extensive experience in financial management, strategic planning, & business development. Proven track record in driving financial performance, optimizing operations, and facilitating organizational growth. Proficient in utilizing software such as SAP, Oracle Financials, Adaptive Insights, Tableau, & Kyriba. Skilled in leveraging advanced mathematical modeling, optimization techniques, & risk analysis to drive data-driven decision-making.
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                        A reliable business leader & field operations manager operator with decades of technical, business and operational building experience with a proven track record of effective & successful construction project management.
                    </p>
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
            </div>
        </div>
    </Panel>
  );
};

export default CvPanel;