import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { GoogleGenAI } from "@google/genai";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        sender: 'ai',
        text: "Hello! I'm Nick's AI assistant. Ask about my services, how I work, or describe your situation. I'll help route you to the right offering."
      }]);
    }
  }, [isOpen, messages.length]);

  const callAIEndpoint = async (message: string): Promise<string> => {
    setIsLoading(true);
    // This function sends the user's message to the Gemini API for a response.
    console.log(`Sending to Gemini: "${message}"`);
    
    try {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable not set.");
            return "Error: API key is not configured. Please contact the site administrator.";
        }
        // Initialize the GoogleGenAI client with the API key.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Call the Gemini model to generate content.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message, // The user's direct query.
            config: {
              systemInstruction: `You are a helpful AI assistant for Nicholas Kraemer, a financial and AI consultant. 
              Your goal is to answer questions about his services, skills, and experience to help potential clients. 
              Keep responses concise and professional. If a question is too specific or requires consultation, 
              politely guide the user to book a call or contact Nicholas directly.`,
            }
        });
        
        // Return the text from the API response.
        return response.text;

    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "Sorry, I encountered an error. Please try again later or contact Nick directly via email.";
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
    "Help me automate my finance workflows.",
    "Review my property management tech stack.",
    "I want tax-efficiency options for my S-Corp."
  ];

  if (!isOpen) {
    return (
      <button
        id="chat-widget-button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 w-16 h-16 bg-cyan-600 rounded-full text-white flex items-center justify-center shadow-lg hover:bg-cyan-700 transition-transform hover:scale-110"
        aria-label="Open AI chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-[calc(100%-40px)] sm:w-96 h-[70vh] sm:h-[600px] bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in-up">
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <h3 className="font-bold text-slate-200 font-mono">AI Agent: lockboxpm assistant</h3>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white" aria-label="Close chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-mono text-cyan-400 text-sm shrink-0">AI</div>}
            <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-mono text-cyan-400 text-sm shrink-0">AI</div>
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