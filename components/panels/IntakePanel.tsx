import React, { useState, useRef } from 'react';
import Panel from '../Panel';
import { GoogleGenAI } from "@google/genai";
import { PanelType } from '../../types';
import { useData } from '../../contexts/DataContext';
import AuthModal from '../AuthModal';

interface IntakePanelProps {
    setActivePanel: (panel: PanelType) => void;
}

type Step = 'welcome' | 'identity' | 'discovery' | 'upload' | 'analysis' | 'result';

const IntakePanel: React.FC<IntakePanelProps> = ({ setActivePanel }) => {
    const { user } = useData();
    const [step, setStep] = useState<Step>('welcome');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        problem: '',
        tools: '',
        goals: ''
    });
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null); // Base64 or text
    const [fileType, setFileType] = useState<string>('');
    const [playbookHtml, setPlaybookHtml] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Pre-fill form if user is logged in
    React.useEffect(() => {
        if (user && step === 'welcome') {
            setFormData(prev => ({
                ...prev,
                name: user.username || prev.name,
                email: user.email || prev.email
            }));
            // Skip to identity step if logged in
            setStep('identity');
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const result = event.target.result as string;
                    // If image, we keep base64. If text, we keep text.
                    if (selectedFile.type.startsWith('image/')) {
                        setFileContent(result.split(',')[1]); // Remove data url prefix for API
                        setFileType('image');
                    } else {
                        setFileContent(result); // Keep text content
                        setFileType('text');
                    }
                }
            };

            if (selectedFile.type.startsWith('image/')) {
                reader.readAsDataURL(selectedFile);
            } else {
                reader.readAsText(selectedFile);
            }
        }
    };

    const generatePlaybook = async () => {
        if (!process.env.API_KEY) {
            alert("API Key is missing.");
            return;
        }

        setStep('analysis');
        setIsProcessing(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            let prompt = `
            You are an expert Business Systems Architect and Financial Consultant named Nick Kraemer.
            Create a professional "Corporate Strategy Playbook" for the following potential client.
            
            CLIENT IDENTITY:
            Name: ${formData.name}
            Company: ${formData.company}
            Goals: ${formData.goals}

            CHALLENGES & TECH STACK:
            Core Problem: ${formData.problem}
            Current Tools: ${formData.tools}
            
            INSTRUCTIONS:
            Analyze the inputs provided. 
            Generate a comprehensive, 3-part strategy report in HTML format (use <h2>, <h3>, <ul>, <li>, <p> tags).
            Do not include <html> or <body> tags, just the content div.
            
            Structure the report as follows:
            1. EXECUTIVE SUMMARY: A diagnosis of their situation.
            2. AUTOMATION & EFFICIENCY: Specific recommendations on how to automate their workflow based on their tools (${formData.tools}).
            3. FINANCIAL OPTIMIZATION: Strategies to reduce overhead or improve reporting.
            4. SALES & GROWTH: How to use technology to increase revenue.
            5. RECOMMENDED NEXT STEPS: A call to action to book a consultation with Nick Kraemer.
            
            Make the tone professional, authoritative, yet innovative.
            `;

            const parts: any[] = [{ text: prompt }];

            // Add file context if available
            if (file && fileContent) {
                if (fileType === 'image') {
                    parts.push({
                        inlineData: {
                            mimeType: file.type,
                            data: fileContent
                        }
                    });
                    parts.push({ text: "Also analyze the attached screenshot/document image for context on their reporting or systems." });
                } else {
                    parts.push({ text: `\n\nAdditional Context from Uploaded File (${file.name}):\n${fileContent.substring(0, 10000)}` }); // Limit text length
                }
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: parts }
            });

            setPlaybookHtml(response.text.replace(/```html/g, '').replace(/```/g, ''));
            setStep('result');

        } catch (error) {
            console.error("Generation failed", error);
            alert("Failed to generate playbook. Please try again.");
            setStep('discovery');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Strategic Playbook - ${formData.company}</title>
                    <style>
                        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
                        h1 { border-bottom: 2px solid #0891b2; padding-bottom: 10px; color: #0e7490; }
                        h2 { margin-top: 30px; color: #155e75; }
                        h3 { color: #0891b2; }
                        ul { margin-bottom: 20px; }
                        li { margin-bottom: 8px; }
                        .header { text-align: center; margin-bottom: 50px; }
                        .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
                        .logo { font-size: 24px; font-weight: bold; color: #0891b2; text-decoration: none; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">LOCKBOX PM</div>
                        <p>Financial Engineering & AI Automation</p>
                        <h1>Strategic Playbook: ${formData.company}</h1>
                        <p>Prepared for: ${formData.name} | Date: ${new Date().toLocaleDateString()}</p>
                    </div>
                    ${playbookHtml}
                    <div class="footer">
                        <p><strong>Nicholas Kraemer</strong> | Financial Systems Engineer</p>
                        <p>Email: nick+web@lockboxpm.com | Phone: 702-720-4750</p>
                        <p>www.lockboxpm.com</p>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <Panel title="~/project_intake_and_analysis">
            <div className="max-w-4xl mx-auto">
                {/* Auth Modal */}
                <AuthModal isOpen={showAuthModal} onClose={() => { setShowAuthModal(false); setStep('identity'); }} />

                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-8 text-sm font-mono text-slate-500 border-b border-slate-700 pb-4">
                    <span className={step === 'welcome' || step === 'identity' ? 'text-cyan-400 font-bold' : ''}>01. Identity</span>
                    <span className="text-slate-700">------</span>
                    <span className={step === 'discovery' ? 'text-cyan-400 font-bold' : ''}>02. Discovery</span>
                    <span className="text-slate-700">------</span>
                    <span className={step === 'upload' ? 'text-cyan-400 font-bold' : ''}>03. Data</span>
                    <span className="text-slate-700">------</span>
                    <span className={step === 'result' ? 'text-cyan-400 font-bold' : ''}>04. Playbook</span>
                </div>

                {/* Welcome Step - Login or Continue as Guest */}
                {step === 'welcome' && !user && (
                    <div className="animate-fade-in space-y-6 text-center py-8">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-100">Welcome to Project Intake</h2>
                        <p className="text-slate-400 max-w-md mx-auto">
                            Get an AI-generated strategy playbook for your business. Already have an account? Login to track your projects.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button
                                onClick={() => setShowAuthModal(true)}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13 12H3" />
                                </svg>
                                Login / Register
                            </button>
                            <button
                                onClick={() => setStep('identity')}
                                className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-8 rounded-lg transition-all"
                            >
                                Continue as Guest →
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 pt-4">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Guest projects can be claimed later by registering with the same email
                        </p>
                    </div>
                )}

                {step === 'identity' && (
                    <div className="animate-fade-in space-y-6">
                        <h2 className="text-2xl font-bold text-slate-100">Let's Start with the Basics.</h2>
                        <p className="text-slate-400">Who am I creating this strategy for?</p>
                        {user && (
                            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-sm">
                                    <span className="text-cyan-400 font-medium">Logged in as {user.username}</span>
                                    <span className="text-slate-500 ml-2">• This project will be saved to your dashboard</span>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-1">Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-slate-100 focus:border-cyan-400 focus:outline-none" placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-1">Company Name</label>
                                <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-slate-100 focus:border-cyan-400 focus:outline-none" placeholder="e.g. Acme Corp" />
                            </div>
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-1">Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-slate-100 focus:border-cyan-400 focus:outline-none" placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="flex justify-between pt-4">
                            {!user && (
                                <button onClick={() => setStep('welcome')} className="text-slate-500 hover:text-slate-300">
                                    &larr; Back
                                </button>
                            )}
                            <button
                                onClick={() => setStep('discovery')}
                                disabled={!formData.name || !formData.company}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-auto"
                            >
                                Next: Discovery &rarr;
                            </button>
                        </div>
                    </div>
                )}

                {step === 'discovery' && (
                    <div className="animate-fade-in space-y-6">
                        <h2 className="text-2xl font-bold text-slate-100">Define Your Challenge.</h2>
                        <p className="text-slate-400">The more specific you are, the better the playbook.</p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-1">What is the primary problem or bottleneck?</label>
                                <textarea name="problem" value={formData.problem} onChange={handleInputChange} rows={3} className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-slate-100 focus:border-cyan-400 focus:outline-none" placeholder="e.g. Monthly reconciliation takes 20 hours and is full of errors..." />
                            </div>
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-1">What tools/software do you currently use?</label>
                                <textarea name="tools" value={formData.tools} onChange={handleInputChange} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-slate-100 focus:border-cyan-400 focus:outline-none" placeholder="e.g. QuickBooks Online, AppFolio, Slack, Google Sheets..." />
                            </div>
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-1">What is your ultimate goal?</label>
                                <input type="text" name="goals" value={formData.goals} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-slate-100 focus:border-cyan-400 focus:outline-none" placeholder="e.g. Automate the rent roll report" />
                            </div>
                        </div>
                        <div className="flex justify-between pt-4">
                            <button onClick={() => setStep('identity')} className="text-slate-500 hover:text-slate-300">
                                &larr; Back
                            </button>
                            <button
                                onClick={() => setStep('upload')}
                                disabled={!formData.problem}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded disabled:opacity-50 transition-colors"
                            >
                                Next: Upload Data &rarr;
                            </button>
                        </div>
                    </div>
                )}

                {step === 'upload' && (
                    <div className="animate-fade-in space-y-6">
                        <h2 className="text-2xl font-bold text-slate-100">Add Context (Optional).</h2>
                        <p className="text-slate-400">Upload a bookkeeping report, a screenshot of your dashboard, or a CSV of expenses. The AI will analyze it.</p>

                        <div className="border-2 border-dashed border-slate-700 rounded-lg p-10 text-center hover:border-cyan-500/50 transition-colors bg-slate-800/30">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".csv,.txt,.json,.png,.jpg,.jpeg"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 mb-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                <span className="text-lg font-bold text-slate-300 mb-1">
                                    {file ? file.name : "Click to Upload File"}
                                </span>
                                <span className="text-xs text-slate-500">Supports CSV, TXT, PNG, JPG</span>
                            </label>
                        </div>

                        <div className="flex justify-between pt-4">
                            <button onClick={() => setStep('discovery')} className="text-slate-500 hover:text-slate-300">
                                &larr; Back
                            </button>
                            <button
                                onClick={generatePlaybook}
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-8 py-3 rounded shadow-lg shadow-cyan-900/20 flex items-center gap-2 transition-all"
                            >
                                {isProcessing ? 'Analyzing...' : 'Generate Playbook'}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                            </button>
                        </div>
                    </div>
                )}

                {step === 'analysis' && (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                        <div className="relative w-24 h-24 mb-8">
                            <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-t-4 border-blue-500 rounded-full animate-spin-reverse"></div>
                        </div>
                        <h3 className="text-xl font-mono font-bold text-cyan-400 mb-2">AI Agent is thinking...</h3>
                        <p className="text-slate-500 text-center max-w-md">
                            Analyzing your tech stack ({formData.tools})...<br />
                            Reviewing {file ? file.name : 'inputs'}...<br />
                            Formulating expense reduction strategy...
                        </p>
                    </div>
                )}

                {step === 'result' && (
                    <div className="animate-fade-in">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    Strategy Ready
                                </h2>
                                <p className="text-slate-400 text-sm">Generated for {formData.company}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                    Print / Save PDF
                                </button>
                                <button
                                    onClick={() => setActivePanel('communicate')}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    Execute Strategy (Book Call)
                                </button>
                            </div>
                        </div>

                        <div className="bg-white text-slate-800 p-8 rounded-lg shadow-xl overflow-hidden">
                            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: playbookHtml }}></div>
                        </div>

                        <div className="mt-8 text-center">
                            <button onClick={() => setStep('identity')} className="text-slate-500 hover:text-slate-300 text-sm underline">
                                Start New Analysis
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Panel>
    );
};

export default IntakePanel;