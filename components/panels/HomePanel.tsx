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

// Friendly AI Chat Message Component
interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

// Striking gradient icons for each service
const ServiceIcons = {
    financial: (
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
            <defs>
                <linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
            </defs>
            <rect x="3" y="8" width="18" height="13" rx="2" stroke="url(#finGrad)" strokeWidth="2" />
            <path d="M12 12v5M9 14.5l3-3 3 3" stroke="url(#finGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2" stroke="url(#finGrad)" strokeWidth="2" />
        </svg>
    ),
    data: (
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
            <defs>
                <linearGradient id="dataGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
            </defs>
            <ellipse cx="12" cy="6" rx="8" ry="3" stroke="url(#dataGrad)" strokeWidth="2" />
            <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" stroke="url(#dataGrad)" strokeWidth="2" />
            <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" stroke="url(#dataGrad)" strokeWidth="2" />
        </svg>
    ),
    operations: (
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
            <defs>
                <linearGradient id="opsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0891B2" />
                </linearGradient>
            </defs>
            <path d="M12 3L4 9v12h16V9l-8-6z" stroke="url(#opsGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 21v-6h6v6" stroke="url(#opsGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="2" stroke="url(#opsGrad)" strokeWidth="2" />
        </svg>
    ),
    sales: (
        <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none">
            <defs>
                <linearGradient id="salesGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
            </defs>
            <path d="M3 17l6-6 4 4 8-8" stroke="url(#salesGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 7h4v4" stroke="url(#salesGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
};

const ServiceCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    question: string;
    onClick: () => void;
    accentColor: string;
}> = ({ icon, title, question, onClick, accentColor }) => (
    <button
        onClick={onClick}
        className={`text-left p-5 rounded-2xl bg-slate-800/60 border border-slate-600/40 hover:border-${accentColor}-400/60 hover:bg-slate-800/80 transition-all duration-300 group hover:shadow-lg hover:shadow-${accentColor}-500/10 hover:-translate-y-0.5`}
    >
        <div className="mb-3 p-2 w-fit rounded-xl bg-slate-700/50 group-hover:bg-slate-700/70 transition-colors">
            {icon}
        </div>
        <h3 className={`font-bold text-slate-100 mb-1 text-lg group-hover:text-${accentColor}-300 transition-colors`}>{title}</h3>
        <p className="text-sm text-slate-400">{question}</p>
    </button>
);

const VenturesSection: React.FC = () => {
    const { ventures, updateVenture, isAdmin, addVenture, deleteVenture } = useData();
    const hasScannedRef = useRef(false);

    const scanVenture = async (id: string, venture: Venture) => {
        if (!process.env.API_KEY) return;
        if (venture.status === 'loaded' || venture.status === 'loading') return;
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

    useEffect(() => {
        if (hasScannedRef.current) return;
        if (!process.env.API_KEY) return;
        hasScannedRef.current = true;
        ventures.forEach(v => {
            if (v.status === 'idle') {
                scanVenture(v.id, v);
            }
        });
    }, [ventures]);

    const handleAddVenture = () => {
        const name = prompt("Venture Name:");
        if (!name) return;
        const url = prompt("Website URL:");
        if (!url) return;
        addVenture({ id: `v_${Date.now()}`, name, url, status: 'idle' });
    };

    return (
        <div className="mt-16">
            <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/5">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                        Live Ventures
                    </h2>
                    <p className="text-sm text-slate-400 mt-1 pl-4">Real world companies and infrastructure I run.</p>
                </div>
                {isAdmin && (
                    <button onClick={handleAddVenture} className="text-xs px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded font-medium transition-colors">+ Add Company</button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ventures.map((v) => (
                    <div key={v.id} className="group relative overflow-hidden rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10">
                        {/* Decorative top accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    {/* Logo Placeholder or Image */}
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm overflow-hidden">
                                        {v.logoUrl ? (
                                            <img src={v.logoUrl} alt="logo" className="w-full h-full object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                                        ) : (
                                            <span className="text-lg font-bold text-slate-900">{v.name.substring(0, 2).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-100 text-lg leading-tight group-hover:text-blue-300 transition-colors">
                                            {v.name}
                                        </h3>
                                        <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 mt-0.5">
                                            {v.url.replace(/^https?:\/\//, '')}
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        </a>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                {v.status === 'loaded' && (
                                    <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-medium border border-green-500/10">
                                        Active
                                    </span>
                                )}
                            </div>

                            {v.status === 'loaded' ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-slate-700 pl-3">
                                        {v.summary}
                                    </p>

                                    {v.products && v.products.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {v.products.slice(0, 3).map((prod, idx) => (
                                                <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-700/50 text-slate-300 text-xs font-medium border border-slate-600/30">
                                                    {prod}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : v.status === 'loading' ? (
                                <div className="flex flex-col gap-3 py-2">
                                    <div className="space-y-2">
                                        <div className="h-4 bg-slate-700/50 rounded animate-pulse w-3/4"></div>
                                        <div className="h-4 bg-slate-700/30 rounded animate-pulse w-1/2"></div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-blue-400 mt-2">
                                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                                        Retrieving live data...
                                    </div>
                                </div>
                            ) : (
                                <div className="py-4 text-center">
                                    <button onClick={() => scanVenture(v.id, v)} className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2">Initialize Data Scan</button>
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
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [clientInfo, setClientInfo] = useState<{
        name?: string;
        email?: string;
        phone?: string;
        company?: string;
        budget?: string;
        timeline?: string;
    }>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    // Send email summary when we have enough info
    const sendEmailSummary = async (allMessages: ChatMessage[], info: typeof clientInfo) => {
        if (!info.email) return;

        const chatTranscript = allMessages.map(m =>
            `${m.role === 'user' ? 'CLIENT' : 'AI ASSISTANT'}: ${m.content}`
        ).join('\n\n');

        const emailBody = `
NEW PROJECT INTAKE FROM LOCKBOXPM.COM
=====================================

CLIENT INFORMATION:
- Name: ${info.name || 'Not provided'}
- Email: ${info.email}
- Phone: ${info.phone || 'Not provided'}
- Company: ${info.company || 'Not provided'}
- Budget: ${info.budget || 'Not provided'}
- Timeline: ${info.timeline || 'Not provided'}

CHAT TRANSCRIPT:
${chatTranscript}

---
Sent automatically from LockboxPM Project Intake
        `.trim();

        // Use mailto as fallback - in production, this would hit an API endpoint
        const mailtoLink = `mailto:nick@lockboxpm.com?subject=${encodeURIComponent(`New Project Intake: ${info.name || 'Website Visitor'}`)}&body=${encodeURIComponent(emailBody)}`;

        // For now, open mailto - a backend API would be better for production
        console.log('Chat summary ready for:', info.email);
        console.log('Full transcript:', emailBody);

        // Store in localStorage as backup
        const intakes = JSON.parse(localStorage.getItem('lbpm_intakes') || '[]');
        intakes.push({
            timestamp: new Date().toISOString(),
            clientInfo: info,
            messages: allMessages
        });
        localStorage.setItem('lbpm_intakes', JSON.stringify(intakes));
    };

    const systemPrompt = `You are Nick's AI project intake assistant at LockboxPM. Your job is to warmly welcome potential clients and gather information about their project needs.

Nick is a Financial Systems Architect & AI Engineer with 15+ years experience in:
- Financial automation & bookkeeping systems (AppFolio, QuickBooks, Xero)
- Business data infrastructure & database systems
- Operations workflow optimization & employee process automation
- Sales automation & CRM integrations
- AI & agentic workflows (LangChain, Gemini, n8n)
- Browser automation (Playwright, data extraction)
- Fractional CFO/COO services

YOUR PRIMARY GOAL: Gather project intake information naturally through conversation.

Within the first few exchanges, try to collect:
1. Their NAME - Ask for it early, warmly
2. Their EMAIL - Essential for follow-up
3. Their PHONE (optional) - "In case we need to reach you quickly"
4. Their COMPANY/BUSINESS name
5. PROJECT DETAILS - What problem are they trying to solve?
6. BUDGET RANGE - Ask sensitively: "Do you have a budget range in mind?"
7. TIMELINE - "When are you hoping to have this completed?"

CONVERSATION STYLE:
- Be warm, friendly, conversational - like a helpful intake coordinator
- After 2-3 exchanges about their problem, naturally ask for contact info
- Don't ask all questions at once - weave them in naturally
- Acknowledge what they share before asking the next question
- Keep responses concise (2-4 sentences max)
- When you have enough info, suggest scheduling a call with Nick

EXAMPLE FLOW:
1. User describes problem → You respond helpfully, then ask their name
2. They give name → Thank them, ask one clarifying question about the project
3. They elaborate → Share relevant experience, ask for email "so Nick can follow up"
4. They give email → Ask about timeline or budget casually
5. Wrap up by suggesting they schedule a call

Remember: You're gathering intake info to help Nick prepare for a productive call with them.`;

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: text };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        // Try to extract client info from the message
        const lowerText = text.toLowerCase();
        const updatedInfo = { ...clientInfo };

        // Extract email
        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (emailMatch) updatedInfo.email = emailMatch[0];

        // Extract phone (simple pattern)
        const phoneMatch = text.match(/(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
        if (phoneMatch) updatedInfo.phone = phoneMatch[0];

        // Update client info
        if (JSON.stringify(updatedInfo) !== JSON.stringify(clientInfo)) {
            setClientInfo(updatedInfo);
            // Send email summary when we get their email
            if (updatedInfo.email && !clientInfo.email) {
                setTimeout(() => sendEmailSummary(newMessages, updatedInfo), 2000);
            }
        }

        try {
            if (!process.env.API_KEY) {
                setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Please try the chat widget or schedule a call directly!" }]);
                return;
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            // Build conversation history
            const conversationHistory = messages.map(m =>
                `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`
            ).join('\n');

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `${conversationHistory}\nUser: ${text}\nAssistant:`,
                config: {
                    systemInstruction: systemPrompt
                }
            });

            const assistantMessage: ChatMessage = { role: 'assistant', content: response.text };
            setMessages(prev => [...prev, assistantMessage]);

            // Update email summary with latest message
            if (updatedInfo.email) {
                sendEmailSummary([...newMessages, assistantMessage], updatedInfo);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an issue. Feel free to schedule a call directly - I'd love to chat!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickQuestion = (question: string) => {
        sendMessage(question);
    };

    const quickStarters = [
        { icon: ServiceIcons.financial, title: "Financial Systems", question: "Bookkeeping, reporting, or automation", accentColor: "emerald" },
        { icon: ServiceIcons.data, title: "Business Data & Systems", question: "Databases, integrations, infrastructure", accentColor: "violet" },
        { icon: ServiceIcons.operations, title: "Operations & Workflows", question: "Process optimization & efficiency", accentColor: "cyan" },
        { icon: ServiceIcons.sales, title: "Sales & Growth Automation", question: "CRM workflows & growth ops", accentColor: "orange" },
    ];

    return (
        <div className="max-w-4xl mx-auto pb-10">
            {/* Hero - Nicholas Kraemer Branding */}
            <div className="text-center mb-10 pt-4 relative">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-sm font-medium mb-4 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Available for Projects
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                    Nicholas <span className="text-cyan-400">(The Professor)</span> Kraemer
                </h1>

                {/* Rotating Titles */}
                <div className="flex flex-wrap justify-center gap-2 mb-5">
                    <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-sm font-medium border border-blue-500/20">
                        🏢 Corporate Officer
                    </span>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-sm font-medium border border-cyan-500/20">
                        📊 Fractional CFO/COO
                    </span>
                    <span className="px-3 py-1 rounded-full bg-violet-500/15 text-violet-400 text-sm font-medium border border-violet-500/20">
                        🤖 AI Systems Architect
                    </span>
                </div>

                <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
                    <span className="text-blue-400 font-medium">20+ years</span> building and scaling companies as a
                    <span className="text-cyan-400 font-medium"> corporate executive</span>,
                    <span className="text-emerald-400 font-medium"> financial strategist</span>, and
                    <span className="text-violet-400 font-medium"> automation engineer</span>.
                </p>

                {/* Expertise Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto mb-6">
                    <div className="group p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all hover:scale-105">
                        <div className="text-2xl font-bold text-blue-400 mb-0.5">CFO</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Financial Leadership</div>
                    </div>
                    <div className="group p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all hover:scale-105">
                        <div className="text-2xl font-bold text-cyan-400 mb-0.5">COO</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Operations Expert</div>
                    </div>
                    <div className="group p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/50 transition-all hover:scale-105">
                        <div className="text-2xl font-bold text-violet-400 mb-0.5">CTO</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Tech Strategy</div>
                    </div>
                    <div className="group p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/50 transition-all hover:scale-105">
                        <div className="text-2xl font-bold text-amber-400 mb-0.5">Gen B</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">CA Contractor</div>
                    </div>
                    <div className="group p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/50 transition-all hover:scale-105">
                        <div className="text-2xl font-bold text-teal-400 mb-0.5">Broker</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">CA Real Estate</div>
                    </div>
                </div>

                {/* Quick Stats Row */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span><strong className="text-slate-200">$500M+</strong> projects delivered</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span><strong className="text-slate-200">500+</strong> companies served</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                        <span><strong className="text-slate-200">US + Costa Rica</strong> based</span>
                    </div>
                </div>
            </div>

            {/* Main Chat Interface */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-600/30 overflow-hidden mb-8 shadow-xl">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-600/30 bg-slate-800/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        AI
                    </div>
                    <div>
                        <div className="font-medium text-slate-100">Project Intake Assistant</div>
                        <div className="text-xs text-slate-400">Tell me about your business needs</div>
                    </div>
                </div>

                {/* Messages */}
                <div className="p-6 min-h-[300px] max-h-[400px] overflow-y-auto space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-400 mb-6 font-medium">Tell me about your project, or ask about my relevant experience.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                {quickStarters.map((starter, i) => (
                                    <ServiceCard
                                        key={i}
                                        icon={starter.icon}
                                        title={starter.title}
                                        question={starter.question}
                                        accentColor={starter.accentColor}
                                        onClick={() => handleQuickQuestion(`I need help with ${starter.title}: ${starter.question}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-cyan-600 text-white rounded-br-md'
                                        : 'bg-slate-700/50 text-slate-200 rounded-bl-md'
                                        }`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-700/50 px-4 py-3 rounded-2xl rounded-bl-md">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-6 py-4 border-t border-slate-700/50">
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe your project..."
                            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-xl transition-colors"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>

            {/* CTA */}
            <div className="text-center mb-12">
                <p className="text-slate-500 mb-4">Prefer to talk directly?</p>
                <button
                    onClick={() => setActivePanel('communicate')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 font-medium transition-all hover:border-cyan-500/30"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Schedule a Call
                </button>
            </div>

            {/* Ventures */}
            <VenturesSection />
        </div>
    );
};

export default HomePanel;