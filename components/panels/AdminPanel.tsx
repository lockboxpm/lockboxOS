import React, { useState } from 'react';
import Panel from '../Panel';
import { useData } from '../../contexts/DataContext';
import type { ProjectStatus, User, Purchase, PurchaseStatus, ChatSession } from '../../types';

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
    draft: { label: 'Draft', color: 'text-slate-400', bg: 'bg-slate-500/20' },
    submitted: { label: 'Submitted', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    in_review: { label: 'In Review', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    approved: { label: 'Approved', color: 'text-green-400', bg: 'bg-green-500/20' },
    in_progress: { label: 'In Progress', color: 'text-purple-400', bg: 'bg-purple-500/20' },
    completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/20' }
};

const ORDER_STATUS_CONFIG: Record<PurchaseStatus, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    paid: { label: 'Paid', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    processing: { label: 'Processing', color: 'text-purple-400', bg: 'bg-purple-500/20' },
    shipped: { label: 'Shipped', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    delivered: { label: 'Delivered', color: 'text-green-400', bg: 'bg-green-500/20' },
    refunded: { label: 'Refunded', color: 'text-orange-400', bg: 'bg-orange-500/20' },
    cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/20' }
};

const UserRow: React.FC<{
    userData: User;
    onUpdateRole: (role: 'admin' | 'user') => void;
}> = ({ userData, onUpdateRole }) => (
    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg font-bold text-white">
                {userData.username.charAt(0).toUpperCase()}
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{userData.username}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${userData.role === 'admin' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {userData.role}
                    </span>
                </div>
                <p className="text-sm text-slate-400">{userData.email || 'No email'}</p>
                <p className="text-xs text-slate-500">
                    {userData.businesses.length} businesses • {userData.projectRequests.length} projects
                </p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <select
                value={userData.role}
                onChange={(e) => onUpdateRole(e.target.value as 'admin' | 'user')}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-sm text-white"
            >
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
        </div>
    </div>
);

const AdminPanel: React.FC = () => {
    const { user, isAdmin, allUsers, allProjectRequests, updateUserRole, updateProjectStatus, allPurchases, updatePurchase, allChatSessions } = useData();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'projects' | 'orders' | 'chats'>('overview');
    const [projectFilter, setProjectFilter] = useState<'all' | ProjectStatus>('all');
    const [orderFilter, setOrderFilter] = useState<'all' | PurchaseStatus>('all');
    const [editingTracking, setEditingTracking] = useState<string | null>(null);
    const [trackingInput, setTrackingInput] = useState('');
    const [selectedChatSession, setSelectedChatSession] = useState<ChatSession | null>(null);
    const [chatUserFilter, setChatUserFilter] = useState<string>('all');

    if (!user || !isAdmin) {
        return (
            <Panel title="~/admin">
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">Admin Access Required</h2>
                    <p className="text-slate-400 max-w-md">
                        This panel is restricted to administrators only.
                    </p>
                </div>
            </Panel>
        );
    }

    const filteredProjects = projectFilter === 'all'
        ? allProjectRequests
        : allProjectRequests.filter(p => p.status === projectFilter);

    // Stats
    const stats = {
        totalUsers: allUsers.length,
        totalProjects: allProjectRequests.length,
        pendingProjects: allProjectRequests.filter(p => p.status === 'submitted' || p.status === 'in_review').length,
        activeProjects: allProjectRequests.filter(p => p.status === 'in_progress' || p.status === 'approved').length,
        completedProjects: allProjectRequests.filter(p => p.status === 'completed').length,
        totalBusinesses: allUsers.reduce((acc, u) => acc + (u.businesses?.length || 0), 0),
        totalOrders: allPurchases.length,
        pendingOrders: allPurchases.filter(p => p.status === 'pending' || p.status === 'paid').length,
        totalRevenue: allPurchases.filter(p => p.status !== 'cancelled' && p.status !== 'refunded').reduce((acc, p) => acc + p.total, 0),
        totalChats: allChatSessions.length
    };

    const filteredOrders = orderFilter === 'all'
        ? allPurchases
        : allPurchases.filter(p => p.status === orderFilter);

    return (
        <Panel title="~/admin">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="text-green-400">⚡</span> Admin Dashboard
                        </h1>
                        <p className="text-slate-400 text-sm">Manage users, projects, and system settings</p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 border-b border-slate-700 pb-2 overflow-x-auto">
                    {(['overview', 'orders', 'users', 'projects', 'chats'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                        >
                            {tab === 'orders' ? `Orders (${stats.pendingOrders})` : tab === 'chats' ? `Chats (${stats.totalChats})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
                                <div className="text-3xl font-bold text-cyan-400">{stats.totalUsers}</div>
                                <div className="text-sm text-slate-400">Total Users</div>
                            </div>
                            <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                                <div className="text-3xl font-bold text-purple-400">{stats.totalProjects}</div>
                                <div className="text-sm text-slate-400">Total Projects</div>
                            </div>
                            <div className="p-5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                                <div className="text-3xl font-bold text-yellow-400">{stats.pendingProjects}</div>
                                <div className="text-sm text-slate-400">Pending Review</div>
                            </div>
                            <div className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                                <div className="text-3xl font-bold text-green-400">{stats.activeProjects}</div>
                                <div className="text-sm text-slate-400">Active Projects</div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700">
                            <h3 className="font-semibold text-white mb-4">Recent Project Submissions</h3>
                            <div className="space-y-3">
                                {allProjectRequests
                                    .filter(p => p.status === 'submitted')
                                    .slice(0, 5)
                                    .map(project => {
                                        const owner = allUsers.find(u => u.id === project.userId);
                                        return (
                                            <div key={project.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-white">{project.title}</p>
                                                    <p className="text-xs text-slate-500">
                                                        by {owner?.username || 'Unknown'} • {new Date(project.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => updateProjectStatus(project.id, 'in_review')}
                                                        className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs hover:bg-yellow-500/30"
                                                    >
                                                        Review
                                                    </button>
                                                    <button
                                                        onClick={() => updateProjectStatus(project.id, 'approved')}
                                                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30"
                                                    >
                                                        Approve
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                {allProjectRequests.filter(p => p.status === 'submitted').length === 0 && (
                                    <p className="text-center text-slate-500 py-4">No pending submissions</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white">Registered Users ({allUsers.length})</h3>
                        </div>
                        <div className="space-y-3">
                            {allUsers.length === 0 ? (
                                <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-600">
                                    <p className="text-slate-400">No registered users yet</p>
                                </div>
                            ) : (
                                allUsers.map(userData => (
                                    <UserRow
                                        key={userData.id}
                                        userData={userData}
                                        onUpdateRole={(role) => updateUserRole(userData.id, role)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-4">
                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20 text-center">
                                <div className="text-2xl font-bold text-green-400">${stats.totalRevenue.toLocaleString()}</div>
                                <div className="text-xs text-slate-400">Total Revenue</div>
                            </div>
                            <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 text-center">
                                <div className="text-2xl font-bold text-purple-400">{stats.totalOrders}</div>
                                <div className="text-xs text-slate-400">Total Orders</div>
                            </div>
                            <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-center">
                                <div className="text-2xl font-bold text-yellow-400">{stats.pendingOrders}</div>
                                <div className="text-xs text-slate-400">Pending</div>
                            </div>
                        </div>

                        {/* Filter */}
                        <div className="flex flex-wrap gap-2">
                            {(['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'refunded', 'cancelled'] as const).map(status => (
                                <button
                                    key={status}
                                    onClick={() => setOrderFilter(status)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${orderFilter === status
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {status === 'all' ? 'All' : ORDER_STATUS_CONFIG[status].label}
                                </button>
                            ))}
                        </div>

                        {/* Orders List */}
                        <div className="space-y-3">
                            {filteredOrders.length === 0 ? (
                                <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-600">
                                    <div className="text-4xl mb-3">📦</div>
                                    <p className="text-slate-400">No orders found</p>
                                    <p className="text-sm text-slate-500 mt-2">Orders will appear here after customers complete checkout</p>
                                </div>
                            ) : (
                                filteredOrders
                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    .map(order => {
                                        const customer = allUsers.find(u => u.id === order.userId);
                                        const isEditingThisOrder = editingTracking === order.id;
                                        return (
                                            <div key={order.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-mono text-sm text-cyan-400">#{order.id.slice(-8)}</span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${ORDER_STATUS_CONFIG[order.status].color} ${ORDER_STATUS_CONFIG[order.status].bg}`}>
                                                                {ORDER_STATUS_CONFIG[order.status].label}
                                                            </span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${order.type === 'subscription' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                                                {order.type === 'subscription' ? '⟳ Subscription' : 'One-time'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-400">
                                                            Customer: <span className="text-white">{customer?.username || customer?.email || 'Guest'}</span>
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {order.items.length} item(s) • ${order.total.toFixed(2)} • {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => updatePurchase(order.id, { status: e.target.value as PurchaseStatus })}
                                                            className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-sm text-white"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="paid">Paid</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="refunded">Refunded</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                        <div className="text-xl font-bold text-green-400 text-right">${order.total.toFixed(2)}</div>
                                                    </div>
                                                </div>

                                                {/* Items List */}
                                                <div className="mb-3 p-2 bg-slate-900/50 rounded-lg">
                                                    <div className="text-xs text-slate-500 mb-2">Items:</div>
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between text-sm py-1">
                                                            <span className="text-slate-300">{item.quantity}× {item.name}</span>
                                                            <span className="text-slate-400">${(item.price * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Shipping & Tracking */}
                                                {order.shippingAddress && (
                                                    <div className="text-xs text-slate-500 mb-2">
                                                        Ship to: {order.shippingAddress.name}, {order.shippingAddress.city}, {order.shippingAddress.state}
                                                    </div>
                                                )}

                                                {/* Tracking Input */}
                                                <div className="flex items-center gap-2">
                                                    {isEditingThisOrder ? (
                                                        <>
                                                            <select
                                                                value={order.trackingCarrier || 'usps'}
                                                                onChange={(e) => updatePurchase(order.id, { trackingCarrier: e.target.value as any })}
                                                                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                                                            >
                                                                <option value="usps">USPS</option>
                                                                <option value="ups">UPS</option>
                                                                <option value="fedex">FedEx</option>
                                                                <option value="dhl">DHL</option>
                                                                <option value="other">Other</option>
                                                            </select>
                                                            <input
                                                                type="text"
                                                                placeholder="Tracking number..."
                                                                value={trackingInput}
                                                                onChange={(e) => setTrackingInput(e.target.value)}
                                                                className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    updatePurchase(order.id, { trackingNumber: trackingInput, status: 'shipped' });
                                                                    setEditingTracking(null);
                                                                    setTrackingInput('');
                                                                }}
                                                                className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-500"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => { setEditingTracking(null); setTrackingInput(''); }}
                                                                className="px-2 py-1 bg-slate-600 text-white rounded text-xs hover:bg-slate-500"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : order.trackingNumber ? (
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-slate-500">Tracking:</span>
                                                            <span className="text-cyan-400 font-mono">{order.trackingCarrier?.toUpperCase()} {order.trackingNumber}</span>
                                                            <button
                                                                onClick={() => { setEditingTracking(order.id); setTrackingInput(order.trackingNumber || ''); }}
                                                                className="text-slate-400 hover:text-white"
                                                            >
                                                                ✏️
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => { setEditingTracking(order.id); setTrackingInput(''); }}
                                                            className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs hover:bg-slate-600 hover:text-white"
                                                        >
                                                            + Add Tracking
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <div className="space-y-4">
                        {/* Filter */}
                        <div className="flex flex-wrap gap-2">
                            {(['all', 'submitted', 'in_review', 'approved', 'in_progress', 'completed'] as const).map(status => (
                                <button
                                    key={status}
                                    onClick={() => setProjectFilter(status)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${projectFilter === status
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {status === 'all' ? 'All' : STATUS_CONFIG[status].label}
                                </button>
                            ))}
                        </div>

                        {/* Projects List */}
                        <div className="space-y-3">
                            {filteredProjects.length === 0 ? (
                                <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-600">
                                    <p className="text-slate-400">No projects found</p>
                                </div>
                            ) : (
                                filteredProjects
                                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                                    .map(project => {
                                        const owner = allUsers.find(u => u.id === project.userId);
                                        return (
                                            <div key={project.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-white">{project.title}</span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_CONFIG[project.status].color} ${STATUS_CONFIG[project.status].bg}`}>
                                                                {STATUS_CONFIG[project.status].label}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-400 line-clamp-1">{project.description}</p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            Client: {owner?.username || 'Unknown'} • {project.type} • Updated {new Date(project.updatedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <select
                                                        value={project.status}
                                                        onChange={(e) => updateProjectStatus(project.id, e.target.value as ProjectStatus)}
                                                        className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-sm text-white"
                                                    >
                                                        <option value="draft">Draft</option>
                                                        <option value="submitted">Submitted</option>
                                                        <option value="in_review">In Review</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="in_progress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    </div>
                )}

                {/* Chats Tab */}
                {activeTab === 'chats' && (
                    <div className="space-y-4">
                        {/* Back button if viewing a session */}
                        {selectedChatSession ? (
                            <div className="space-y-4">
                                <button
                                    onClick={() => setSelectedChatSession(null)}
                                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                    Back to all chats
                                </button>

                                {/* Session Header */}
                                <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-lg font-bold text-white">
                                                {(() => {
                                                    const chatOwner = allUsers.find(u => u.id === selectedChatSession.userId);
                                                    return chatOwner ? chatOwner.username.charAt(0).toUpperCase() : '?';
                                                })()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">
                                                    {allUsers.find(u => u.id === selectedChatSession.userId)?.username || 'Anonymous'}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Session: {selectedChatSession.id.slice(-12)} • {selectedChatSession.messages.length} messages
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right text-xs text-slate-500">
                                            <p>Started: {new Date(selectedChatSession.startedAt).toLocaleString()}</p>
                                            <p>Last msg: {new Date(selectedChatSession.lastMessageAt).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Contact Info */}
                                    {(selectedChatSession.contactInfo?.name || selectedChatSession.contactInfo?.email || selectedChatSession.contactInfo?.phone) && (
                                        <div className="mt-3 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                                            <p className="text-xs font-semibold text-cyan-400 mb-2">📇 Extracted Contact Info</p>
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                {selectedChatSession.contactInfo.name && (
                                                    <span className="text-slate-300"><span className="text-slate-500">Name:</span> {selectedChatSession.contactInfo.name}</span>
                                                )}
                                                {selectedChatSession.contactInfo.email && (
                                                    <span className="text-slate-300"><span className="text-slate-500">Email:</span> {selectedChatSession.contactInfo.email}</span>
                                                )}
                                                {selectedChatSession.contactInfo.phone && (
                                                    <span className="text-slate-300"><span className="text-slate-500">Phone:</span> {selectedChatSession.contactInfo.phone}</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* AI Summary */}
                                    {selectedChatSession.summary && (
                                        <div className="mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                            <p className="text-xs font-semibold text-green-400 mb-1">📝 AI Summary</p>
                                            <p className="text-sm text-slate-300">{selectedChatSession.summary}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Interactive Transcript */}
                                <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700">
                                    <h3 className="font-semibold text-white mb-4">💬 Full Transcript</h3>
                                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                                        {selectedChatSession.messages.map((msg, index) => (
                                            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                                                {msg.sender === 'ai' && (
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">N</div>
                                                )}
                                                <div className={`max-w-[75%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                                    <p className="text-sm">{msg.text}</p>
                                                    {msg.timestamp && (
                                                        <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-cyan-200/60' : 'text-slate-500'}`}>
                                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                                        </p>
                                                    )}
                                                </div>
                                                {msg.sender === 'user' && (
                                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                        {(() => {
                                                            const chatOwner = allUsers.find(u => u.id === selectedChatSession.userId);
                                                            return chatOwner ? chatOwner.username.charAt(0).toUpperCase() : 'V';
                                                        })()}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Chat Session List */
                            <>
                                {/* User Filter */}
                                <div className="flex items-center gap-3">
                                    <label className="text-sm text-slate-400">Filter by user:</label>
                                    <select
                                        value={chatUserFilter}
                                        onChange={(e) => setChatUserFilter(e.target.value)}
                                        className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-sm text-white"
                                    >
                                        <option value="all">All Users</option>
                                        {allUsers.map(u => (
                                            <option key={u.id} value={u.id}>{u.username}</option>
                                        ))}
                                    </select>
                                    <span className="text-xs text-slate-500 ml-auto">{allChatSessions.length} total sessions</span>
                                </div>

                                {/* Sessions List */}
                                <div className="space-y-3">
                                    {(() => {
                                        const filtered = chatUserFilter === 'all'
                                            ? allChatSessions
                                            : allChatSessions.filter(s => s.userId === chatUserFilter);
                                        const sorted = [...filtered].sort((a, b) =>
                                            new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
                                        );

                                        if (sorted.length === 0) {
                                            return (
                                                <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-600">
                                                    <div className="text-4xl mb-3">💬</div>
                                                    <p className="text-slate-400">No chat sessions found</p>
                                                    <p className="text-sm text-slate-500 mt-2">Chat sessions will appear here as users interact with the chat widget</p>
                                                </div>
                                            );
                                        }

                                        return sorted.map(session => {
                                            const chatOwner = allUsers.find(u => u.id === session.userId);
                                            const userMsgCount = session.messages.filter(m => m.sender === 'user').length;
                                            const lastUserMsg = [...session.messages].reverse().find(m => m.sender === 'user');

                                            return (
                                                <button
                                                    key={session.id}
                                                    onClick={() => setSelectedChatSession(session)}
                                                    className="w-full text-left p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all group"
                                                >
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-lg font-bold text-white">
                                                                {chatOwner ? chatOwner.username.charAt(0).toUpperCase() : '?'}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                                                        {chatOwner?.username || 'Anonymous'}
                                                                    </span>
                                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-600/50 text-slate-400">
                                                                        {session.messages.length} msgs
                                                                    </span>
                                                                    {(session.contactInfo?.email || session.contactInfo?.phone) && (
                                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">📇 contact</span>
                                                                    )}
                                                                </div>
                                                                {lastUserMsg && (
                                                                    <p className="text-sm text-slate-400 line-clamp-1 mt-0.5">
                                                                        "{lastUserMsg.text}"
                                                                    </p>
                                                                )}
                                                                <p className="text-xs text-slate-500 mt-1">
                                                                    {userMsgCount} user messages • {new Date(session.lastMessageAt).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0 mt-1"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                                    </div>
                                                </button>
                                            );
                                        });
                                    })()}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </Panel>
    );
};

export default AdminPanel;
