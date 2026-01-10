import React, { useState, useEffect } from 'react';
import Panel from '../Panel';
import { useData } from '../../contexts/DataContext';
import type { Product } from '../../types';
import { fetchPrintfulProducts, type PrintfulProduct } from '../../services/printful';
import { createCheckoutSession } from '../../services/stripe';

const StorePanel: React.FC = () => {
    const {
        addToCart,
        cart,
        removeFromCart,
        updateCartQuantity,
        cartTotal,
        clearCart
    } = useData();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [printfulProducts, setPrintfulProducts] = useState<PrintfulProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const products = await fetchPrintfulProducts();
            setPrintfulProducts(products);
            // Set default variant for each product
            const defaults: Record<string, number> = {};
            products.forEach(p => {
                if (p.variants.length > 0) {
                    defaults[p.id] = p.variants[0].id;
                }
            });
            setSelectedVariants(defaults);
        } catch (err) {
            setError('Failed to load products. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = (product: PrintfulProduct) => {
        const selectedVariantId = selectedVariants[product.id];
        const variant = product.variants.find(v => v.id === selectedVariantId);

        const cartProduct: Product = {
            id: `${product.id}_${selectedVariantId}`,
            name: variant ? `${product.name} - ${variant.name}` : product.name,
            price: variant?.price || product.price,
            image: product.image,
            category: product.category,
            description: product.description
        };

        addToCart(cartProduct);
    };

    const handleCheckout = async () => {
        if (cart.length === 0 || isCheckingOut) return;

        setIsCheckingOut(true);
        try {
            const { url } = await createCheckoutSession(cart);
            if (url) {
                window.location.href = url;
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Checkout failed. Please try again.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <Panel title="~/merch_store">
            <div className="relative min-h-[600px]">
                {/* Store Header */}
                <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Official Merch</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-slate-400 text-sm">Powered by</span>
                            <span className="text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 px-2 py-0.5 rounded">Printful</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadProducts}
                            disabled={isLoading}
                            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 px-3 py-2 rounded border border-slate-600 text-sm font-mono"
                        >
                            {isLoading ? 'Loading...' : '↻ Refresh'}
                        </button>
                        <button
                            onClick={() => setIsCartOpen(!isCartOpen)}
                            className="relative bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-bold shadow-lg shadow-cyan-900/20 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                            Cart
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-mono border border-slate-900">
                                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400">Loading products from Printful...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="text-center py-20">
                        <div className="text-red-400 mb-4">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p>{error}</p>
                        </div>
                        <button onClick={loadProducts} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded">
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && printfulProducts.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p>No products synced yet.</p>
                        <p className="text-sm mt-2">Add products in your Printful dashboard.</p>
                    </div>
                )}

                {/* Product Grid */}
                {!isLoading && !error && printfulProducts.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                        <div className={`col-span-1 ${isCartOpen ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-all`}>
                            {printfulProducts.map(product => (
                                <div key={product.id} className="group bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col">
                                    <div className="relative aspect-square bg-slate-700 overflow-hidden">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                                            PRINTFUL
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-100 text-lg leading-tight">{product.name}</h3>
                                            <span className="font-mono text-cyan-400 font-bold ml-2">
                                                ${(product.variants.find(v => v.id === selectedVariants[product.id])?.price || product.price).toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{product.category}</p>

                                        {/* Variant Selector */}
                                        {product.variants.length > 1 && (
                                            <select
                                                value={selectedVariants[product.id] || ''}
                                                onChange={(e) => setSelectedVariants({
                                                    ...selectedVariants,
                                                    [product.id]: Number(e.target.value)
                                                })}
                                                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 mb-3 focus:border-cyan-500 focus:outline-none"
                                            >
                                                {product.variants.map(variant => (
                                                    <option key={variant.id} value={variant.id}>
                                                        {variant.name} - ${variant.price.toFixed(2)}
                                                    </option>
                                                ))}
                                            </select>
                                        )}

                                        <p className="text-sm text-slate-400 mb-4 flex-grow">{product.description}</p>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full bg-slate-700 hover:bg-cyan-600 text-slate-200 hover:text-white py-2 rounded font-bold transition-colors flex items-center justify-center gap-2"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Sidebar */}
                        {isCartOpen && (
                            <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col animate-slide-in-right lg:static lg:h-auto lg:border lg:border-slate-700 lg:rounded-lg lg:shadow-none lg:block lg:z-auto">
                                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                                    <h3 className="text-xl font-bold font-mono text-white">Your Cart</h3>
                                    <button onClick={() => setIsCartOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {cart.length === 0 ? (
                                        <div className="text-center text-slate-500 py-10">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                                            <p>Your cart is empty.</p>
                                        </div>
                                    ) : (
                                        cart.map(item => (
                                            <div key={item.id} className="flex gap-3 bg-slate-800/50 p-3 rounded border border-slate-700">
                                                <div className="w-16 h-16 bg-slate-700 rounded overflow-hidden shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-slate-200 line-clamp-1">{item.name}</h4>
                                                    <p className="text-xs text-cyan-400 font-mono">${item.price.toFixed(2)}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <button onClick={() => updateCartQuantity(item.id, -1)} className="text-slate-400 hover:text-white bg-slate-700 w-6 h-6 rounded flex items-center justify-center">-</button>
                                                        <span className="text-sm text-slate-200 font-mono">{item.quantity}</span>
                                                        <button onClick={() => updateCartQuantity(item.id, 1)} className="text-slate-400 hover:text-white bg-slate-700 w-6 h-6 rounded flex items-center justify-center">+</button>
                                                        <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-400 text-xs hover:underline">Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="p-4 border-t border-slate-700 bg-slate-800/30">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-slate-400">Subtotal</span>
                                        <span className="text-xl font-bold text-cyan-400 font-mono">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <button
                                        disabled={cart.length === 0 || isCheckingOut}
                                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                                        onClick={handleCheckout}
                                    >
                                        {isCheckingOut ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            'Checkout via Stripe'
                                        )}
                                    </button>
                                    <p className="text-[10px] text-slate-500 text-center mt-2">
                                        Secure checkout. Products printed & shipped by Printful.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Panel>
    );
};

export default StorePanel;