import React, { useState } from 'react';
import Panel from '../Panel';
import { useData } from '../../contexts/DataContext';
import type { Client, ClientScannedData } from '../../types';
import { GoogleGenAI, Type } from "@google/genai";

// Helper to strip markdown code blocks from JSON responses
const cleanJson = (text: string) => {
    return text.replace(/```json\s*|\s*```/g, '').trim();
};

const ClientCard: React.FC<{ 
    client: Client; 
    index: number;
    isAdmin: boolean;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
    onScan: (index: number, client: Client) => void;
    isScanning: boolean;
}> = ({ client, index, isAdmin, onEdit, onDelete, onScan, isScanning }) => (
    <div 
        className={`flex flex-col bg-slate-800/50 border rounded-lg transition-all duration-200 group relative overflow-hidden ${
            isAdmin 
                ? 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                : client.url !== '#' ? 'border-slate-700 hover:border-cyan-400/50' : 'border-slate-700'
        }`}
    >
        {/* Admin Toolbar - Visually Distinct Header */}
        {isAdmin && (
            <div className="bg-red-950/30 border-b border-red-900/30 p-2 flex justify-between items-center backdrop-blur-md">
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider uppercase px-2 py-0.5 bg-red-900/20 rounded border border-red-900/30">
                        Admin Controls
                    </span>
                 </div>
                 <div className="flex gap-2">
                     <button 
                        onClick={() => onScan(index, client)} 
                        disabled={isScanning} 
                        className="p-1.5 bg-slate-800 text-cyan-400 border border-slate-600 rounded hover:bg-cyan-900/50 hover:border-cyan-400 hover:text-cyan-200 disabled:opacity-50 transition-all" 
                        title="AI Scan: Fetch Logo, Status & Summary"
                    >
                        {isScanning ? (
                            <span className="animate-spin block w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full"></span>
                        ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        )}
                    </button>
                    <button 
                        onClick={() => onEdit(index)} 
                        className="p-1.5 bg-slate-800 text-yellow-400 border border-slate-600 rounded hover:bg-yellow-900/50 hover:border-yellow-400 hover:text-yellow-200 transition-all" 
                        title="Edit Details"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button 
                        onClick={() => onDelete(index)} 
                        className="p-1.5 bg-slate-800 text-red-400 border border-slate-600 rounded hover:bg-red-900/50 hover:border-red-400 hover:text-red-200 transition-all" 
                        title="Delete Client"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        )}

        <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
                {/* Logo Display Logic */}
                <div className="w-12 h-12 rounded-md bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden border border-slate-600">
                    {client.scannedData?.logoUrl ? (
                        <img src={client.scannedData.logoUrl} alt={`${client.name} logo`} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                    ) : (
                        <span className="text-xl font-bold text-slate-500">{client.name.charAt(0)}</span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <a 
                            href={client.url} 
                            target={client.url !== '#' ? "_blank" : "_self"} 
                            rel="noopener noreferrer"
                            className={`text-lg font-bold text-slate-200 truncate block ${client.url !== '#' ? 'hover:text-cyan-400' : ''}`}
                        >
                            {client.name}
                        </a>
                        {client.scannedData?.status && (
                             <button 
                                type="button"
                                className="relative flex items-center group/status focus:outline-none cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                aria-label={`Status: ${client.scannedData.status}`}
                             >
                                <span 
                                    className={`w-2.5 h-2.5 rounded-full ${
                                        client.scannedData.status === 'Online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
                                        client.scannedData.status === 'Reported Down' ? 'bg-red-500 animate-pulse' : 
                                        'bg-slate-500'
                                    }`}
                                ></span>
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded shadow-xl opacity-0 group-hover/status:opacity-100 group-focus/status:opacity-100 transition-opacity z-20 pointer-events-none min-w-[140px] text-center">
                                    <div className={`text-xs font-bold mb-1 ${
                                        client.scannedData.status === 'Online' ? 'text-green-400' : 
                                        client.scannedData.status === 'Reported Down' ? 'text-red-400' : 'text-slate-300'
                                    }`}>
                                        {client.scannedData.status}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                                        Last: {client.scannedData.lastScanned || 'Unknown'}
                                    </div>
                                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
                                </div>
                             </button>
                        )}
                    </div>
                    <p className="text-cyan-600/80 font-mono text-xs">{client.role}</p>
                </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-4">{client.description}</p>

            {/* Scanned Data Section */}
            {client.scannedData && (
                <div className="mt-auto pt-4 border-t border-slate-700/50 text-xs font-mono bg-black/20 p-3 rounded border border-slate-700/30">
                    <div className="flex justify-between mb-2">
                        <span className="text-slate-500 uppercase font-bold tracking-wider">System Analysis</span>
                        <span className={`font-bold ${client.scannedData.status === 'Online' ? 'text-green-400' : 'text-red-400'}`}>
                            [{client.scannedData.status || 'Checking'}]
                        </span>
                    </div>
                    {client.scannedData.summary && (
                        <p className="text-slate-300 mb-2 italic">"{client.scannedData.summary}"</p>
                    )}
                    {client.scannedData.contacts && (
                        <div className="text-slate-400">
                            <span className="text-cyan-500">Contacts: </span>{client.scannedData.contacts}
                        </div>
                    )}
                    <div className="mt-2 text-slate-600 text-[10px] text-right">
                        Last scan: {client.scannedData.lastScanned || 'Just now'}
                    </div>
                </div>
            )}
        </div>
    </div>
);

const ClientsPanel: React.FC = () => {
  const { clients, isAdmin, addClient, updateClient, deleteClient, updateClientScan } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Client>({ name: '', description: '', url: '', role: '' });
  const [scanningIndices, setScanningIndices] = useState<number[]>([]);

  const handleEdit = (index: number) => {
      setEditIndex(index);
      setFormData(clients[index]);
      setIsEditing(true);
  };

  const handleDelete = (index: number) => {
      if (window.confirm('Are you sure you want to remove this client?')) {
          deleteClient(index);
      }
  };

  const handleAdd = () => {
      setEditIndex(null);
      setFormData({ name: '', description: '', url: '', role: '' });
      setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editIndex !== null) {
          updateClient(editIndex, formData);
      } else {
          addClient(formData);
      }
      setIsEditing(false);
  };

  const handleScan = async (index: number, client: Client) => {
      if (!process.env.API_KEY) {
          alert("API Key missing. Cannot scan.");
          return;
      }
      
      setScanningIndices(prev => [...prev, index]);
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const prompt = `Search the web for "${client.name}" at url: ${client.url}. 
        Perform the following checks:
        1. Summarize what the company does in one sentence.
        2. Look for a URL to their logo.
        3. Find any public contact email or phone number.
        4. Check if there are recent reports of the website being down or offline.
        
        Return a VALID JSON object (do not include markdown formatting) with the keys: 
        "summary", "logoUrl", "contacts", "status" (should be "Online" or "Reported Down"), "branding".`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });

        const cleanText = cleanJson(response.text);
        if (cleanText) {
            const scannedData: ClientScannedData = JSON.parse(cleanText);
            scannedData.lastScanned = new Date().toLocaleTimeString();
            updateClientScan(index, scannedData);
        }

      } catch (error) {
          console.error("Scan failed", error);
          alert("Scan failed. Check console for details.");
      } finally {
          setScanningIndices(prev => prev.filter(i => i !== index));
      }
  };

  return (
    <Panel title="~/clients_and_partners">
        <div className="space-y-8 relative">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Clients & Partners</h2>
                    <p className="mt-2 text-slate-400">
                        Collaborating with forward-thinking businesses to build robust financial infrastructure and automated systems.
                    </p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={handleAdd}
                        className="bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-700 px-4 py-2 rounded-md font-mono text-sm flex items-center gap-2 shadow-[0_0_10px_rgba(220,38,38,0.3)] transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add Client Entry
                    </button>
                )}
            </div>

            {/* Edit/Add Form Modal (Inline Overlay) */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-red-500/50 rounded-lg w-full max-w-md p-6 shadow-2xl">
                        <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                            <span className="text-red-400 font-mono text-xs uppercase border border-red-900 px-1 rounded">Admin</span>
                            <h3 className="text-xl font-bold text-white">{editIndex !== null ? 'Edit Client Record' : 'Create Client Record'}</h3>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-1">Client Name</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-1">Role/Relationship</label>
                                <input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-1">Website URL</label>
                                <input type="text" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-mono text-slate-400 mb-1">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-900" rows={3} />
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-400 hover:text-white font-mono text-sm">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-bold shadow-lg text-sm">Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clients.map((client, index) => (
                   <ClientCard 
                        key={index} 
                        client={client} 
                        index={index}
                        isAdmin={isAdmin}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onScan={handleScan}
                        isScanning={scanningIndices.includes(index)}
                    />
                ))}
            </div>
            
            {isAdmin && (
                <div className="mt-8 p-4 border border-dashed border-red-900/50 bg-red-950/10 rounded-lg text-center text-red-400/70 text-xs font-mono">
                    <p>[ADMIN MODE ACTIVE] Authorized personnel only. Changes are persisted locally.</p>
                </div>
            )}
        </div>
    </Panel>
  );
};

export default ClientsPanel;