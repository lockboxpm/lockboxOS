import React, { useState } from 'react';
import Panel from '../Panel';
import { useData } from '../../contexts/DataContext';
import type { Business, ContactInfo } from '../../types';

// Generate unique ID
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const BUSINESS_TYPES = ['LLC', 'Corporation', 'Sole Proprietorship', 'Partnership', 'Non-Profit', 'Other'] as const;

const ContactBadge: React.FC<{ contact: ContactInfo; onDelete: () => void }> = ({ contact, onDelete }) => {
    const typeColors: Record<string, string> = {
        email: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        phone: 'bg-green-500/20 text-green-400 border-green-500/30',
        website: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        linkedin: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        other: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border ${typeColors[contact.type] || typeColors.other} group`}>
            <span className="font-medium">{contact.label}:</span>
            <span>{contact.value}</span>
            <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity">×</button>
        </span>
    );
};

const BusinessCard: React.FC<{
    business: Business;
    onUpdate: (updates: Partial<Business>) => void;
    onDelete: () => void;
}> = ({ business, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showAddContact, setShowAddContact] = useState(false);
    const [newContact, setNewContact] = useState<Partial<ContactInfo>>({ type: 'email', label: '', value: '' });

    const handleAddContact = () => {
        if (!newContact.label || !newContact.value) return;
        const contact: ContactInfo = {
            id: generateId(),
            type: newContact.type || 'other',
            label: newContact.label,
            value: newContact.value
        };
        onUpdate({ contacts: [...business.contacts, contact] });
        setNewContact({ type: 'email', label: '', value: '' });
        setShowAddContact(false);
    };

    const handleDeleteContact = (contactId: string) => {
        onUpdate({ contacts: business.contacts.filter(c => c.id !== contactId) });
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                        {business.name.charAt(0)}
                    </div>
                    <div>
                        {isEditing ? (
                            <input
                                type="text"
                                value={business.name}
                                onChange={(e) => onUpdate({ name: e.target.value })}
                                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white font-semibold"
                            />
                        ) : (
                            <h3 className="font-semibold text-white">{business.name}</h3>
                        )}
                        <p className="text-sm text-slate-400">{business.type}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                    >
                        {isEditing ? 'Done' : 'Edit'}
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-xs px-2 py-1 rounded bg-red-900/30 text-red-400 hover:bg-red-900/50"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Industry</label>
                        <input
                            type="text"
                            value={business.industry || ''}
                            onChange={(e) => onUpdate({ industry: e.target.value })}
                            placeholder="e.g., Technology"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-500 mb-1">Website</label>
                        <input
                            type="url"
                            value={business.website || ''}
                            onChange={(e) => onUpdate({ website: e.target.value })}
                            placeholder="https://example.com"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-white"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs text-slate-500 mb-1">Address</label>
                        <input
                            type="text"
                            value={business.address || ''}
                            onChange={(e) => onUpdate({ address: e.target.value })}
                            placeholder="123 Main St, City, State"
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-white"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs text-slate-500 mb-1">Business Type</label>
                        <select
                            value={business.type}
                            onChange={(e) => onUpdate({ type: e.target.value as Business['type'] })}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-white"
                        >
                            {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {/* Contacts */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 font-medium">CONTACTS</span>
                    <button
                        onClick={() => setShowAddContact(!showAddContact)}
                        className="text-xs text-cyan-400 hover:text-cyan-300"
                    >
                        + Add Contact
                    </button>
                </div>

                {showAddContact && (
                    <div className="flex gap-2 mb-3 p-3 bg-slate-900/50 rounded-lg">
                        <select
                            value={newContact.type}
                            onChange={(e) => setNewContact(prev => ({ ...prev, type: e.target.value as ContactInfo['type'] }))}
                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                        >
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="website">Website</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="other">Other</option>
                        </select>
                        <input
                            type="text"
                            value={newContact.label}
                            onChange={(e) => setNewContact(prev => ({ ...prev, label: e.target.value }))}
                            placeholder="Label"
                            className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white w-24"
                        />
                        <input
                            type="text"
                            value={newContact.value}
                            onChange={(e) => setNewContact(prev => ({ ...prev, value: e.target.value }))}
                            placeholder="Value"
                            className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                        />
                        <button
                            onClick={handleAddContact}
                            className="px-3 py-1 bg-cyan-600 text-white rounded text-sm hover:bg-cyan-500"
                        >
                            Add
                        </button>
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {business.contacts.map(contact => (
                        <ContactBadge
                            key={contact.id}
                            contact={contact}
                            onDelete={() => handleDeleteContact(contact.id)}
                        />
                    ))}
                    {business.contacts.length === 0 && (
                        <span className="text-sm text-slate-500 italic">No contacts added</span>
                    )}
                </div>
            </div>

            {/* Display info when not editing */}
            {!isEditing && (business.website || business.industry || business.address) && (
                <div className="text-sm text-slate-400 space-y-1 pt-2 border-t border-slate-700">
                    {business.industry && <p>🏭 {business.industry}</p>}
                    {business.website && (
                        <p>🌐 <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{business.website}</a></p>
                    )}
                    {business.address && <p>📍 {business.address}</p>}
                </div>
            )}
        </div>
    );
};

const ProfilePanel: React.FC = () => {
    const { user, updateUserProfile, addBusiness, updateBusiness, deleteBusiness } = useData();
    const [showAddBusiness, setShowAddBusiness] = useState(false);
    const [newBusinessName, setNewBusinessName] = useState('');
    const [newBusinessType, setNewBusinessType] = useState<Business['type']>('LLC');

    if (!user) {
        return (
            <Panel title="~/profile">
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="text-6xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">Sign In Required</h2>
                    <p className="text-slate-400 max-w-md">
                        Please log in or create an account to access your profile and manage your businesses.
                    </p>
                </div>
            </Panel>
        );
    }

    const handleAddBusiness = () => {
        if (!newBusinessName.trim()) return;
        const business: Business = {
            id: generateId(),
            name: newBusinessName,
            type: newBusinessType,
            contacts: [],
            createdAt: new Date().toISOString()
        };
        addBusiness(business);
        setNewBusinessName('');
        setNewBusinessType('LLC');
        setShowAddBusiness(false);
    };

    return (
        <Panel title="~/profile">
            <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-cyan-500/20">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {user.role === 'admin' ? 'Administrator' : 'Client'}
                            </span>
                        </div>
                        <p className="text-slate-400">{user.email || 'No email set'}</p>
                        {user.phone && <p className="text-slate-500 text-sm">📱 {user.phone}</p>}
                        <p className="text-slate-500 text-sm mt-2">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
                        <div className="text-3xl font-bold text-cyan-400">{user.businesses.length}</div>
                        <div className="text-sm text-slate-400">Businesses</div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
                        <div className="text-3xl font-bold text-purple-400">{user.projectRequests.length}</div>
                        <div className="text-sm text-slate-400">Projects</div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
                        <div className="text-3xl font-bold text-green-400">
                            {user.projectRequests.filter(p => p.status === 'in_progress' || p.status === 'approved').length}
                        </div>
                        <div className="text-sm text-slate-400">Active</div>
                    </div>
                </div>

                {/* Edit Profile */}
                <section>
                    <h2 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <span>👤</span> Profile Information
                    </h2>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Email</label>
                            <input
                                type="email"
                                value={user.email}
                                onChange={(e) => updateUserProfile({ email: e.target.value })}
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={user.phone || ''}
                                onChange={(e) => updateUserProfile({ phone: e.target.value })}
                                placeholder="+1 (555) 123-4567"
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                            />
                        </div>
                    </div>
                </section>

                {/* Businesses Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-300 flex items-center gap-2">
                            <span>🏢</span> My Businesses
                        </h2>
                        <button
                            onClick={() => setShowAddBusiness(!showAddBusiness)}
                            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg transition-colors"
                        >
                            + Add Business
                        </button>
                    </div>

                    {showAddBusiness && (
                        <div className="p-4 bg-slate-800/50 border border-cyan-500/30 rounded-xl mb-4 space-y-3">
                            <input
                                type="text"
                                value={newBusinessName}
                                onChange={(e) => setNewBusinessName(e.target.value)}
                                placeholder="Business Name"
                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <select
                                    value={newBusinessType}
                                    onChange={(e) => setNewBusinessType(e.target.value as Business['type'])}
                                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                                >
                                    {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <button
                                    onClick={handleAddBusiness}
                                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors"
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => setShowAddBusiness(false)}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {user.businesses.length === 0 ? (
                            <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-600">
                                <div className="text-4xl mb-3">🏗️</div>
                                <p className="text-slate-400">No businesses added yet</p>
                                <p className="text-sm text-slate-500">Add a business to link it to your project requests</p>
                            </div>
                        ) : (
                            user.businesses.map(business => (
                                <BusinessCard
                                    key={business.id}
                                    business={business}
                                    onUpdate={(updates) => updateBusiness(business.id, updates)}
                                    onDelete={() => deleteBusiness(business.id)}
                                />
                            ))
                        )}
                    </div>
                </section>
            </div>
        </Panel>
    );
};

export default ProfilePanel;
