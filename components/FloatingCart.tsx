import React from 'react';
import { useCart, CartItem } from '../contexts/CartContext';
import { createCheckoutSession } from '../services/stripe';
import type { PanelType } from '../types';

interface FloatingCartProps {
    onNavigate: (panel: string) => void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({ onNavigate }) => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isCartOpen,
        setIsCartOpen
    } = useCart();

    const [isCheckingOut, setIsCheckingOut] = React.useState(false);

    const count = getCartCount();

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        setIsCheckingOut(true);
        try {
            // Separate recurring and one-time items
            const oneTimeItems = cartItems.filter(item => !item.isRecurring);
            const recurringItems = cartItems.filter(item => item.isRecurring);

            // Handle mixed cart - warn user they need separate checkouts
            if (oneTimeItems.length > 0 && recurringItems.length > 0) {
                const proceed = confirm(
                    'Your cart contains both one-time purchases and subscriptions. ' +
                    'These require separate checkouts. Click OK to proceed with one-time items first, ' +
                    'then you can checkout subscriptions separately.'
                );
                if (!proceed) {
                    setIsCheckingOut(false);
                    return;
                }
            }

            // Handle one-time items
            if (oneTimeItems.length > 0) {
                const stripeItems = oneTimeItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image || undefined // Filter out empty strings
                }));

                const result = await createCheckoutSession(stripeItems);
                if (result?.url) {
                    // Only clear one-time items, keep recurring for next checkout
                    if (recurringItems.length > 0) {
                        oneTimeItems.forEach(item => removeFromCart(item.id));
                    } else {
                        clearCart();
                    }
                    window.location.href = result.url;
                    return;
                }
            }

            // Handle recurring items (subscription mode)
            if (recurringItems.length > 0 && oneTimeItems.length === 0) {
                const stripeItems = recurringItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image || undefined,
                    interval: item.interval || 'year'
                }));

                const result = await createCheckoutSession(stripeItems, undefined, undefined, 'subscription');
                if (result?.url) {
                    clearCart();
                    window.location.href = result.url;
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed. Please try again.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    // Don't render anything if cart is empty and closed
    if (count === 0 && !isCartOpen) {
        return null;
    }

    return (
        <>
            {/* Floating Cart Button */}
            <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
                aria-label="Open cart"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {count > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {count}
                    </span>
                )}
            </button>

            {/* Cart Drawer */}
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsCartOpen(false)}
                    />

                    {/* Cart Panel */}
                    <div className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400">
                                        <circle cx="9" cy="21" r="1" />
                                        <circle cx="20" cy="21" r="1" />
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Your Cart</h2>
                                    <p className="text-xs text-slate-400">{count} item{count !== 1 ? 's' : ''}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-slate-400 hover:text-white p-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
                            {cartItems.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4 opacity-50">
                                        <circle cx="9" cy="21" r="1" />
                                        <circle cx="20" cy="21" r="1" />
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                    </svg>
                                    <p>Your cart is empty</p>
                                    <button
                                        onClick={() => { setIsCartOpen(false); onNavigate('store'); }}
                                        className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm"
                                    >
                                        Browse Merch Store →
                                    </button>
                                </div>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.id} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex gap-3">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                                        ) : (
                                            <div className="w-16 h-16 rounded bg-slate-700 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-slate-100 truncate">{item.name}</h4>
                                            <p className="text-xs text-slate-400">{item.category}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-6 h-6 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 flex items-center justify-center text-sm"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm text-slate-300 w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-6 h-6 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 flex items-center justify-center text-sm"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            {item.isRecurring && (
                                                <span className="inline-block mt-1 text-[10px] bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded">
                                                    {item.interval === 'year' ? 'Annual' : 'Monthly'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-cyan-400">${(item.price * item.quantity).toFixed(2)}</p>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-xs text-red-400 hover:text-red-300 mt-2"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-4 border-t border-slate-700 space-y-3">
                                <div className="flex justify-between text-slate-300">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-white">${getCartTotal().toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut}
                                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isCheckingOut ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                                <line x1="1" y1="10" x2="23" y2="10" />
                                            </svg>
                                            Checkout with Stripe
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={clearCart}
                                    className="w-full py-2 text-sm text-slate-400 hover:text-red-400 transition-colors"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default FloatingCart;
