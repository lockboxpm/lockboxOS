import React, { useState } from 'react';
import Panel from '../Panel';
import { useData } from '../../contexts/DataContext';
import type { Purchase, PurchaseStatus } from '../../types';

const STATUS_CONFIG: Record<PurchaseStatus, { label: string; color: string; bg: string; icon: string }> = {
    pending: { label: 'Payment Pending', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: '⏳' },
    paid: { label: 'Paid', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: '✓' },
    processing: { label: 'Processing', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: '⚙️' },
    shipped: { label: 'Shipped', color: 'text-cyan-400', bg: 'bg-cyan-500/20', icon: '📦' },
    delivered: { label: 'Delivered', color: 'text-green-400', bg: 'bg-green-500/20', icon: '✅' },
    refunded: { label: 'Refunded', color: 'text-orange-400', bg: 'bg-orange-500/20', icon: '↩️' },
    cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/20', icon: '✕' }
};

const CARRIER_URLS: Record<string, string> = {
    usps: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
    ups: 'https://www.ups.com/track?tracknum=',
    fedex: 'https://www.fedex.com/fedextrack/?trknbr=',
    dhl: 'https://www.dhl.com/us-en/home/tracking.html?tracking-id=',
    other: ''
};

const OrderCard: React.FC<{ order: Purchase; isExpanded: boolean; onToggle: () => void }> = ({ order, isExpanded, onToggle }) => {
    const status = STATUS_CONFIG[order.status];
    const trackingUrl = order.trackingCarrier && order.trackingNumber
        ? CARRIER_URLS[order.trackingCarrier] + order.trackingNumber
        : null;

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            {/* Order Header - Always Visible */}
            <button
                onClick={onToggle}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-800/70 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg ${status.bg} flex items-center justify-center text-lg`}>
                        {status.icon}
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-cyan-400">#{order.id.slice(-8)}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${status.color} ${status.bg}`}>
                                {status.label}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric'
                            })}
                            {' • '}{order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-lg font-bold text-white">${order.total.toFixed(2)}</div>
                        {order.type === 'subscription' && (
                            <span className="text-xs text-purple-400">⟳ Subscription</span>
                        )}
                    </div>
                    <svg
                        className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-slate-700">
                    {/* Items */}
                    <div className="mt-4 space-y-2">
                        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Items</h4>
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-lg">
                                {item.image && (
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                )}
                                <div className="flex-1">
                                    <p className="text-sm text-white">{item.name}</p>
                                    <p className="text-xs text-slate-500">{item.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-white">${item.price.toFixed(2)}</p>
                                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-4 pt-3 border-t border-slate-700 space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Subtotal</span>
                            <span className="text-white">${order.subtotal.toFixed(2)}</span>
                        </div>
                        {order.shipping !== undefined && order.shipping > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Shipping</span>
                                <span className="text-white">${order.shipping.toFixed(2)}</span>
                            </div>
                        )}
                        {order.tax !== undefined && order.tax > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Tax</span>
                                <span className="text-white">${order.tax.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-700">
                            <span className="text-white">Total</span>
                            <span className="text-green-400">${order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                        <div className="mt-4 pt-3 border-t border-slate-700">
                            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Shipping Address</h4>
                            <div className="text-sm text-slate-300">
                                <p>{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.line1}</p>
                                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    )}

                    {/* Tracking */}
                    {order.trackingNumber && (
                        <div className="mt-4 pt-3 border-t border-slate-700">
                            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Tracking</h4>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-400">{order.trackingCarrier?.toUpperCase()}</span>
                                {trackingUrl ? (
                                    <a
                                        href={trackingUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                                    >
                                        {order.trackingNumber}
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                ) : (
                                    <span className="text-sm text-cyan-400 font-mono">{order.trackingNumber}</span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const MyPurchasesPanel: React.FC = () => {
    const { user, purchases, getUserPurchases } = useData();
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    if (!user) {
        return (
            <Panel title="~/my-purchases">
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="text-6xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">Sign In Required</h2>
                    <p className="text-slate-400 max-w-md">
                        Please log in to view your purchase history.
                    </p>
                </div>
            </Panel>
        );
    }

    const userPurchases = getUserPurchases(user.id);

    const filteredPurchases = userPurchases.filter(p => {
        if (filter === 'all') return true;
        if (filter === 'active') return ['pending', 'paid', 'processing', 'shipped'].includes(p.status);
        if (filter === 'completed') return ['delivered', 'refunded', 'cancelled'].includes(p.status);
        return true;
    });

    const stats = {
        total: userPurchases.length,
        active: userPurchases.filter(p => ['pending', 'paid', 'processing', 'shipped'].includes(p.status)).length,
        totalSpent: userPurchases.filter(p => p.status !== 'cancelled' && p.status !== 'refunded')
            .reduce((acc, p) => acc + p.total, 0)
    };

    return (
        <Panel title="~/my-purchases">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span>📦</span> My Purchases
                    </h1>
                    <p className="text-slate-400 text-sm">View and track your orders</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
                        <div className="text-2xl font-bold text-cyan-400">{stats.total}</div>
                        <div className="text-xs text-slate-400">Total Orders</div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
                        <div className="text-2xl font-bold text-purple-400">{stats.active}</div>
                        <div className="text-xs text-slate-400">Active</div>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
                        <div className="text-2xl font-bold text-green-400">${stats.totalSpent.toLocaleString()}</div>
                        <div className="text-xs text-slate-400">Total Spent</div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    {(['all', 'active', 'completed'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f
                                ? 'bg-cyan-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-3">
                    {filteredPurchases.length === 0 ? (
                        <div className="p-8 text-center bg-slate-800/30 rounded-xl border border-dashed border-slate-600">
                            <div className="text-4xl mb-3">🛒</div>
                            <p className="text-slate-400">No purchases yet</p>
                            <p className="text-sm text-slate-500 mt-2">
                                {filter === 'all'
                                    ? "When you make a purchase, it will appear here"
                                    : `No ${filter} orders found`
                                }
                            </p>
                        </div>
                    ) : (
                        filteredPurchases
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    isExpanded={expandedOrder === order.id}
                                    onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                />
                            ))
                    )}
                </div>
            </div>
        </Panel>
    );
};

export default MyPurchasesPanel;
