import React, { useState, useEffect, useRef } from 'react';
import Panel from '../Panel';

interface SystemInfo {
    browser: string;
    os: string;
    platform: string;
    language: string;
    screenSize: string;
    cookiesEnabled: boolean;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

type TabType = 'schedule' | 'contact' | 'system' | 'chat';

const CommunicatePanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('schedule');
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi! I'm the LockboxPM assistant. How can I help you today? Feel free to ask about our consulting services, pricing, or how we can help with your project.",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const getOS = (userAgent: string): string => {
            if (/Windows/i.test(userAgent)) return "Windows";
            if (/Macintosh|Mac OS/i.test(userAgent)) return "macOS";
            if (/Linux/i.test(userAgent)) return "Linux";
            if (/Android/i.test(userAgent)) return "Android";
            if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
            return "Unknown";
        };

        const getBrowser = (userAgent: string): string => {
            if (/Firefox/i.test(userAgent)) return "Firefox";
            if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) return "Chrome";
            if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) return "Safari";
            if (/Edg/i.test(userAgent)) return "Edge";
            if (/MSIE|Trident/i.test(userAgent)) return "Internet Explorer";
            return "Unknown";
        };

        const userAgent = navigator.userAgent;
        setSystemInfo({
            browser: getBrowser(userAgent),
            os: getOS(userAgent),
            platform: navigator.platform,
            language: navigator.language,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            cookiesEnabled: navigator.cookieEnabled,
        });
    }, []);

    const generateResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
            return "Our rates vary by engagement type:\n\n• **GTM (Global Team Members)**: Starting at $15+/hr for bilingual staff\n• **Implementation Team**: $50+/hr for specialized tasks\n• **Systems Architect**: $100-250/hr for senior-level work\n• **Direct with Nick**: $400-1200/hr for executive advisory\n\nWe also offer fixed-rate packages for CFO, Controller, and Tax services. Would you like more details on any specific service?";
        }

        if (lowerMessage.includes('consult') || lowerMessage.includes('service')) {
            return "We offer consulting across several domains:\n\n• **Technology & AI**: Custom software, AI integration, websites\n• **Finance**: Fractional CFO, Controller oversight, bookkeeping\n• **Real Estate**: Commercial acquisitions, property development\n• **Construction**: Project management, materials sourcing\n\nWhat area interests you most?";
        }

        if (lowerMessage.includes('schedule') || lowerMessage.includes('call') || lowerMessage.includes('meeting')) {
            return "You can book a free 15-minute discovery call directly from the **Schedule** tab above. Just select a time that works for you on the Google Calendar embed. No commitment required!";
        }

        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
            return "You can reach us through:\n\n• **Email**: nick+web@lockboxpm.com\n• **Phone**: 702-720-4750\n• **LinkedIn**: linkedin.com/in/njkraemer\n\nCheck the **Contact** tab for clickable links!";
        }

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! Great to connect with you. I'm here to help answer questions about LockboxPM's consulting services. What brings you here today?";
        }

        if (lowerMessage.includes('thank')) {
            return "You're welcome! Is there anything else I can help you with?";
        }

        return "Thanks for your message! I'd be happy to help. You can ask me about:\n\n• Our consulting services\n• Pricing and engagement options\n• Scheduling a call\n• Contact information\n\nOr feel free to describe your specific needs and I'll point you in the right direction.";
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            const response = generateResponse(userMessage.content);
            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const tabs = [
        {
            id: 'schedule' as TabType, label: 'Schedule', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 'contact' as TabType, label: 'Contact', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 'chat' as TabType, label: 'Chat', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            )
        },
        {
            id: 'system' as TabType, label: 'System', icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="4 17 10 11 4 5" />
                    <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
            )
        },
    ];

    return (
        <Panel title="~/communicate">
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-100 mb-2">Get in Touch</h2>
                    <p className="text-slate-400">Schedule a call, find contact details, or view system information</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center">
                    <div className="inline-flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {/* Schedule Tab */}
                    {activeTab === 'schedule' && (
                        <div className="space-y-6 max-w-4xl mx-auto text-center">
                            <div>
                                <h3 className="text-xl font-semibold text-slate-100 mb-2">Schedule a Discovery Call</h3>
                                <p className="text-slate-400 text-sm">
                                    Book a complimentary 15-minute discovery call to discuss your challenges, goals, and determine if my services are the right fit.
                                </p>
                            </div>
                            <div className="bg-white border border-slate-700 rounded-lg overflow-hidden w-full">
                                <iframe
                                    src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0ne_A_zPFE3uOvIixVmfjkqeg7q7G1qy0DK1hb7DcZgrNloHeJYeoCdrRPoV_2uxPbfzscreti?gv=true"
                                    style={{ border: 0, width: '100%', height: '500px' }}
                                    title="Schedule an Appointment"
                                />
                            </div>
                            <p className="text-sm text-slate-500">
                                My timezone: <span className="text-cyan-400">America/Costa_Rica</span>
                            </p>
                        </div>
                    )}

                    {/* Contact Tab */}
                    {activeTab === 'contact' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Email */}
                                <a href="mailto:nick+web@lockboxpm.com" className="glass-panel p-5 flex items-center gap-4 hover:border-cyan-500/30 transition-all group">
                                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">Email</div>
                                        <div className="text-slate-200 font-medium">nick+web@lockboxpm.com</div>
                                    </div>
                                </a>

                                {/* Phone */}
                                <a href="tel:+17027204750" className="glass-panel p-5 flex items-center gap-4 hover:border-green-500/30 transition-all group">
                                    <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">Phone</div>
                                        <div className="text-slate-200 font-medium">702-720-4750</div>
                                    </div>
                                </a>

                                {/* LinkedIn */}
                                <a href="https://linkedin.com/in/njkraemer/" target="_blank" rel="noopener noreferrer" className="glass-panel p-5 flex items-center gap-4 hover:border-blue-500/30 transition-all group">
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">LinkedIn</div>
                                        <div className="text-slate-200 font-medium">linkedin.com/in/njkraemer</div>
                                    </div>
                                </a>

                                {/* GitHub */}
                                <a href="https://github.com/lockboxpm" target="_blank" rel="noopener noreferrer" className="glass-panel p-5 flex items-center gap-4 hover:border-slate-400/30 transition-all group">
                                    <div className="w-12 h-12 rounded-lg bg-slate-500/10 border border-slate-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">GitHub</div>
                                        <div className="text-slate-200 font-medium">github.com/lockboxpm</div>
                                    </div>
                                </a>
                            </div>

                            <div className="glass-panel p-5">
                                <h4 className="text-sm font-semibold text-slate-200 mb-2">Confidentiality & Security</h4>
                                <p className="text-sm text-slate-400">
                                    I prioritize client confidentiality. All communications and shared documents are treated with the highest level of discretion and protected using industry-best practices.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Chat Tab */}
                    {activeTab === 'chat' && (
                        <div className="max-w-3xl mx-auto">
                            <div className="glass-panel overflow-hidden">
                                {/* Chat Header */}
                                <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/50 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-slate-100 font-medium">LockboxPM Assistant</div>
                                        <div className="text-xs text-green-400 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                            Online
                                        </div>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-900/30">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                                        ? 'bg-cyan-600 text-white rounded-br-md'
                                                        : 'bg-slate-700/50 text-slate-200 rounded-bl-md border border-slate-600/50'
                                                    }`}
                                            >
                                                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                                                <div className={`text-[10px] mt-1 ${message.role === 'user' ? 'text-cyan-200' : 'text-slate-500'}`}>
                                                    {formatTime(message.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-slate-700/50 rounded-2xl rounded-bl-md px-4 py-3 border border-slate-600/50">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
                                    <div className="flex gap-3">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Type your message..."
                                            className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!inputValue.trim() || isTyping}
                                            className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center gap-2 font-medium"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            Send
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 text-center">
                                        This is an AI assistant. For complex inquiries, please schedule a call.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* System Tab */}
                    {activeTab === 'system' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-black/50 p-6 rounded-lg border border-slate-700">
                                <div className="border-b border-slate-600 pb-2 mb-4">
                                    <p className="font-mono text-green-400 text-sm">Welcome, {systemInfo?.browser || 'user'}. Session information:</p>
                                </div>
                                {systemInfo ? (
                                    <div className="space-y-2 font-mono text-sm">
                                        <div className="flex">
                                            <span className="text-cyan-400 w-40">Browser:</span>
                                            <span className="text-slate-300">{systemInfo.browser}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="text-cyan-400 w-40">Operating System:</span>
                                            <span className="text-slate-300">{systemInfo.os}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="text-cyan-400 w-40">Platform:</span>
                                            <span className="text-slate-300">{systemInfo.platform}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="text-cyan-400 w-40">Language:</span>
                                            <span className="text-slate-300">{systemInfo.language}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="text-cyan-400 w-40">Screen Resolution:</span>
                                            <span className="text-slate-300">{systemInfo.screenSize}</span>
                                        </div>
                                        <div className="flex">
                                            <span className="text-cyan-400 w-40">Cookies Enabled:</span>
                                            <span className="text-slate-300">{systemInfo.cookiesEnabled ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 animate-pulse">Gathering system info...</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Panel>
    );
};

export default CommunicatePanel;
