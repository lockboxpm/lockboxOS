import React, { useState, useRef, useEffect } from 'react';
import { PanelType, Venture } from '../../types';
import { GoogleGenAI } from "@google/genai";
import { useData } from '../../contexts/DataContext';

interface HomePanelProps {
    setActivePanel: (panel: PanelType) => void;
}

const cleanJson = (text: string) => {
    return text.replace(/```json\s*|\s*```/g, '').trim();
};

// High-fidelity Dashboard Status Card
const StatusCard: React.FC<{title: string, value?: string, children?: React.ReactNode, icon?: React.ReactNode, colorClass?: string}> = ({ title, value, children, icon, colorClass = "text-cyan-400" }) => (
    <div className="glass-panel p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
            {icon || <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>}
        </div>
        <h3 className={`font-mono text-xs uppercase tracking-widest mb-1 text-slate-500`}>
            {title}
        </h3>
        {value && <div className={`text-2xl font-bold ${colorClass} font-mono tracking-tight`}>{value}</div>}
        {children && <div className="mt-2 text-sm text-slate-400 leading-snug">{children}</div>}
    </div>
);

interface TerminalLine {
    type: 'command' | 'response' | 'system';
    text: string;
}

const VenturesSection: React.FC = () => {
    const { ventures, updateVenture, isAdmin, addVenture, deleteVenture } = useData();

    const scanVenture = async (id: string, venture: Venture) => {
        if (!process.env.API_KEY) return;
        updateVenture(id, { ...venture, status: 'loading' });
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Analyze the website ${venture.url} for the company "${venture.name}".
            You are a web scraper. Visit the site using Google Search tools.
            Return a VALID JSON object (do not include markdown formatting) with:
            - summary: A compelling 1-sentence marketing summary of what they do.
            - products: An array of strings listing up to 5 key products, amenities, or services.
            - location: The physical location, city, or country.
            - contact: Email address or phone number if visible.
            - logoUrl: Find a URL for their logo image.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { tools: [{ googleSearch: {} }] }
            });
            
            const cleanText = cleanJson(response.text);
            const data = JSON.parse(cleanText);
            updateVenture(id, { ...venture, ...data, status: 'loaded' });
        } catch (e) {
            console.error(e);
            updateVenture(id, { ...venture, status: 'error' });
        }
    };

    const handleAddVenture = () => {
        const name = prompt("Venture Name:");
        if (!name) return;
        const url = prompt("Website URL:");
        if (!url) return;
        addVenture({ id: `v_${Date.now()}`, name, url, status: 'idle' });
    }

    return (
        <div className="space-y-6 mt-12">
            <div className="flex items-end justify-between border-b border-white/5 pb-4">
                <div>
                    <h2 className="text-2xl font-bold font-mono text-slate-100 flex items-center gap-3">
                        <span className="text-cyan-500">./</span> Ventures & Holdings
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Self-owned business infrastructure and assets.</p>
                </div>
                <div className="flex gap-3">
                    {isAdmin && (
                        <button onClick={handleAddVenture} className="btn-secondary text-xs">+ Add Asset</button>
                    )}
                    <button onClick={() => ventures.forEach(v => scanVenture(v.id, v))} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-slate-800/50 px-3 py-1.5 rounded border border-cyan-500/20 hover:border-cyan-500/50 transition-all">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        Run Live Diagnostics
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {ventures.map((v) => (
                    <div key={v.id} className="glass-panel group relative transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:border-cyan-500/30">
                        {isAdmin && (
                             <button onClick={() => deleteVenture(v.id)} className="absolute top-3 right-3 z-10 text-red-400/50 hover:text-red-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        )}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors tracking-tight">
                                        <a href={v.url} target="_blank" rel="noopener noreferrer">{v.name}</a>
                                    </h3>
                                    <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-slate-500 hover:text-cyan-500 flex items-center gap-1 mt-1">
                                        {v.url}
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                                    </a>
                                </div>
                                {v.status === 'loaded' && v.logoUrl ? (
                                     <div className="w-14 h-14 rounded-lg bg-white p-1 shadow-lg shrink-0">
                                         <img src={v.logoUrl} alt="logo" className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'}/>
                                     </div>
                                ) : (
                                    <div className={`w-3 h-3 rounded-full ${v.status === 'loading' ? 'bg-yellow-500 animate-ping' : 'bg-slate-700'}`}></div>
                                )}
                            </div>
                            
                            {v.status === 'loaded' ? (
                                <div className="space-y-4 animate-fade-in">
                                    <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-slate-700 pl-3">
                                        {v.summary}
                                    </p>
                                    {v.products && v.products.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {v.products.map((prod, idx) => (
                                                <span key={idx} className="text-[10px] uppercase font-bold bg-slate-800/50 text-cyan-200/80 px-2 py-1 rounded border border-white/5">
                                                    {prod}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="pt-4 border-t border-white/5 flex flex-wrap gap-6 text-xs text-slate-500 font-mono">
                                        {v.location && <span>📍 {v.location}</span>}
                                        {v.contact && <span>✉️ {v.contact}</span>}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-24 flex items-center justify-center bg-slate-900/30 rounded border border-dashed border-slate-800">
                                    {v.status === 'loading' ? (
                                         <p className="text-xs text-cyan-400 font-mono animate-pulse">Running diagnostics...</p>
                                    ) : (
                                        <p className="text-xs text-slate-600 font-mono">System idle. Initiate scan for data.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HomePanel: React.FC<HomePanelProps> = ({ setActivePanel }) => {
    const [history, setHistory] = useState<TerminalLine[]>([
        { type: 'system', text: 'LockboxPM OS Kernel v2.1.0-generic x86_64' },
        { type: 'system', text: 'Copyright (c) 2024 Nicholas Kraemer. All Rights Reserved.' },
        { type: 'system', text: ' ' },
        { type: 'system', text: 'Initializing systems...' },
        { type: 'system', text: '   [ OK ] Mounted /dev/skills' },
        { type: 'system', text: '   [ OK ] Started Financial_Engine.service' },
        { type: 'system', text: '   [ OK ] Connected to AI_Neural_Net' },
        { type: 'system', text: ' ' },
        { type: 'system', text: 'Welcome to the interactive shell. Type "help" for commands or ask natural language questions.' },
    ]);
    const [command, setCommand] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userIp, setUserIp] = useState<string>('unknown_host');
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalEndRef = useRef<HTMLDivElement>(null);
    const { isAdmin, login, logout } = useData();

    useEffect(() => {
        inputRef.current?.focus();
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => { if(data.ip) setUserIp(data.ip); })
            .catch(() => {});
    }, []);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLoading]);
    
    const callGeminiEndpoint = async (message: string): Promise<string> => {
        setIsLoading(true);
        try {
            if (!process.env.API_KEY) return "ERROR: API_KEY missing.";
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: message,
                config: {
                    systemInstruction: `You are a specialized shell environment for Nicholas Kraemer (LockboxPM).
                    Respond precisely like a Linux terminal. Use markdown for tables/lists.
                    If asked about Nick, summarize his role as a Financial Systems Engineer.
                    Commands: 'help', 'whois', 'skills', 'projects', 'contact'.
                    For 'clear', return '[[CLEAR]]'.`
                }
            });
            return response.text;
        } catch (error) {
            return "ERROR: Connection refused.";
        } finally {
            setIsLoading(false);
        }
    };

    const handleCommandSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = command.trim();
        if (!cmd || isLoading) return;

        if (cmd.toLowerCase() === 'clear') {
            setHistory([]); setCommand(''); return;
        }
        if (cmd.startsWith('login') || cmd.startsWith('sudo')) {
            setHistory(prev => [...prev, { type: 'command', text: command }]);
            const password = prompt("Password:");
            if (password === 'admin') {
                login('Nick Kraemer', 'admin');
                setHistory(prev => [...prev, { type: 'system', text: '>> Access Granted. Root privileges enabled.' }]);
            } else {
                setHistory(prev => [...prev, { type: 'system', text: '>> Authentication failure.' }]);
            }
            setCommand(''); return;
        }
        if (cmd === 'logout') {
             setHistory(prev => [...prev, { type: 'command', text: command }]);
             logout();
             setHistory(prev => [...prev, { type: 'system', text: '>> Session closed.' }]);
             setCommand(''); return;
        }

        setHistory(prev => [...prev, { type: 'command', text: command }]);
        const currentCommand = command;
        setCommand('');

        const responseText = await callGeminiEndpoint(currentCommand);
        if (responseText.trim() === '[[CLEAR]]') setHistory([]);
        else setHistory(prev => [...prev, { type: 'response', text: responseText }]);
    };
    
    return (
        <div className="pb-10">
            {/* Hero Header */}
            <div className="mb-12 relative">
                <div className="absolute -left-10 top-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-transparent opacity-50"></div>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-100 tracking-tighter mb-4">
                    Financial Systems <span className="text-cyan-400">Architect</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl font-light leading-relaxed">
                    Engineering agentic workflows, tax compliance strategies, and operational automation for high-growth enterprises.
                </p>
            </div>

            {/* Terminal Window */}
            <div className="bg-[#0c0c0c] rounded-lg border border-slate-800 shadow-2xl overflow-hidden mb-8 ring-1 ring-white/5 font-mono text-sm">
                {/* Terminal Bar */}
                <div className="bg-[#1a1a1a] px-4 py-2 flex items-center justify-between border-b border-slate-800 select-none">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </div>
                    <div className="text-slate-500 text-xs flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        zsh — {userIp}
                    </div>
                </div>
                
                <div className="p-4 h-80 overflow-y-auto custom-scrollbar" onClick={() => inputRef.current?.focus()}>
                    {history.map((line, i) => (
                        <div key={i} className="mb-1">
                            {line.type === 'command' && (
                                <div className="flex text-slate-300">
                                    <span className={isAdmin ? "text-red-500 mr-2 font-bold" : "text-cyan-500 mr-2 font-bold"}>
                                        {isAdmin ? "root@lockbox:~#" : `guest@${userIp}:~$`}
                                    </span>
                                    <span>{line.text}</span>
                                </div>
                            )}
                            {line.type === 'response' && <div className="text-slate-400 whitespace-pre-wrap pl-2 border-l-2 border-slate-800 ml-1">{line.text}</div>}
                            {line.type === 'system' && <div className="text-slate-600 italic">{line.text}</div>}
                        </div>
                    ))}
                    <form onSubmit={handleCommandSubmit} className="flex items-center mt-2">
                        <span className={isAdmin ? "text-red-500 mr-2 font-bold" : "text-cyan-500 mr-2 font-bold"}>
                            {isAdmin ? "root@lockbox:~#" : `guest@${userIp}:~$`}
                        </span>
                        <input 
                            ref={inputRef}
                            type="text" 
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-800 caret-cyan-400"
                            autoFocus
                            disabled={isLoading}
                        />
                    </form>
                    <div ref={terminalEndRef} />
                </div>
            </div>

            {/* Status Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusCard title="Availability" value="Q2 2025" colorClass="text-green-400">
                    Currently accepting new consulting engagements for late Q2.
                </StatusCard>
                 <StatusCard title="Last Deploy" value="AppFolio Bot" colorClass="text-cyan-400">
                    Custom Playwright reconciliation agent deployed 4h ago.
                </StatusCard>
                 <StatusCard title="System Health" value="99.9%" colorClass="text-cyan-400">
                    <div className="flex items-center gap-2 mt-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="font-mono text-xs">All Systems Operational</span>
                    </div>
                </StatusCard>
            </div>

            <VenturesSection />
        </div>
    );
};

export default HomePanel;