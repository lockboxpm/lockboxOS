import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { GoogleGenAI } from "@google/genai";

// Nick's photo - using actual headshot
const NICK_PHOTO = "/headshot_nick.png";
const CHAT_STORAGE_KEY = 'lbpm_chat_session';
const SESSION_ID_KEY = 'lbpm_chat_session_id';

interface ChatWidgetProps {
  onNavigate?: (panel: string) => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [emailSent, setEmailSent] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate or retrieve session ID
  useEffect(() => {
    let id = localStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(SESSION_ID_KEY, id);
    }
    setSessionId(id);

    // Load saved messages
    const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error('Failed to parse saved chat:', e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        sender: 'ai',
        text: "Hi! I'm Nick. 👋 Tell me a bit about yourself — where are you from, what's your business, and what challenges are you facing? I help with financial systems, AI automation, tax strategy, and even corporate retreats in Costa Rica."
      }]);
    }
  }, [isOpen, messages.length]);

  // Send chat transcript via email
  const sendChatTranscript = async () => {
    if (emailSent || messages.length < 3) return; // Only send if meaningful conversation

    try {
      const response = await fetch('/api/send-chat-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setEmailSent(true);
        console.log('Chat transcript sent successfully');
      }
    } catch (error) {
      console.error('Failed to send chat transcript:', error);
    }
  };

  // Handle closing chat - send transcript if meaningful conversation
  const handleClose = () => {
    if (messages.length >= 3 && !emailSent) {
      sendChatTranscript();
    }
    setIsOpen(false);
  };

  // Clear chat and start fresh
  const handleClearChat = () => {
    sendChatTranscript(); // Send transcript before clearing
    localStorage.removeItem(CHAT_STORAGE_KEY);
    localStorage.removeItem(SESSION_ID_KEY);
    setMessages([]);
    setEmailSent(false);
    // Generate new session ID
    const newId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_ID_KEY, newId);
    setSessionId(newId);
  };

  // Navigate to Communications tab
  const handleTalkToHuman = () => {
    sendChatTranscript(); // Send transcript before navigating
    setIsOpen(false);
    if (onNavigate) {
      onNavigate('communicate');
    }
  };

  const callAIEndpoint = async (message: string): Promise<string> => {
    setIsLoading(true);
    console.log(`Sending to Gemini: "${message}"`);

    try {
      if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        return "Error: API key is not configured. Please contact the site administrator.";
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
          systemInstruction: `You are Nicholas Kraemer, a financial and AI consultant based in Costa Rica.
              Have a warm, conversational tone. Your goal is to learn about the visitor:
              - Where they're from and their contact info
              - What their business does
              - Pain points they're experiencing
              - Whether they need consulting, retreats, tax help, or other life/business architecture
              
              Keep responses concise and friendly. If they seem like a good fit, 
              encourage them to schedule a call or share their email for follow-up.
              Be helpful but also qualify leads - not everyone is a fit.`,
        }
      });

      return response.text;

    } catch (error) {
      console.error("Gemini API call failed:", error);
      return "Sorry, I encountered an error. Please try again later or email me directly at nick@lockboxpm.com.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const aiResponseText = await callAIEndpoint(textToSend);
    const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
    setMessages(prev => [...prev, aiMessage]);
  };

  const quickPrompts = [
    "I need help with my business financials",
    "Tell me about corporate retreats",
    "I'm looking for tax strategy help",
    "I want to automate my workflows"
  ];

  if (!isOpen) {
    return (
      <button
        id="chat-widget-button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 w-16 h-16 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform overflow-hidden border-2 border-cyan-400 hover:border-cyan-300"
        aria-label="Chat with Nick"
        title="Chat with Nick"
      >
        <img src={NICK_PHOTO} alt="Nick" className="w-full h-full object-cover object-top" />
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-[calc(100%-40px)] sm:w-96 h-[70vh] sm:h-[600px] bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in-up">
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <img src={NICK_PHOTO} alt="Nick" className="w-8 h-8 rounded-full object-cover border border-cyan-400" />
          <div>
            <h3 className="font-bold text-slate-200 text-sm">Nick Kraemer</h3>
            <span className="text-xs text-green-400">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 1 && (
            <button
              onClick={handleClearChat}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
            </button>
          )}
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1" aria-label="Close chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && <img src={NICK_PHOTO} alt="Nick" className="w-8 h-8 rounded-full object-cover border border-cyan-400 shrink-0" />}
            <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2">
            <img src={NICK_PHOTO} alt="Nick" className="w-8 h-8 rounded-full object-cover border border-cyan-400 shrink-0" />
            <div className="p-3 bg-slate-700 rounded-lg flex items-center space-x-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-0"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-200"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-400"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {messages.length <= 1 && (
        <div className="p-4 border-t border-slate-700 flex flex-wrap gap-2">
          {quickPrompts.map(prompt => (
            <button key={prompt} onClick={() => handleSend(prompt)} className="text-xs text-cyan-300 bg-slate-700/50 border border-slate-600 px-3 py-1 rounded-full hover:bg-slate-600 transition-colors">
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Talk to Human Link */}
      <div className="px-3 py-2 border-t border-slate-700/50 bg-slate-800/50">
        <button
          onClick={handleTalkToHuman}
          className="w-full text-center text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center justify-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          Prefer a live conversation? Schedule a call →
        </button>
      </div>

      <div className="p-3 border-t border-slate-700">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-slate-900 border border-slate-600 rounded-md py-2 px-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={isLoading}
          />
          <button type="submit" className="bg-cyan-600 text-white p-2 rounded-md hover:bg-cyan-700 disabled:bg-slate-600" disabled={isLoading || !input.trim()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWidget;