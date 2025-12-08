import React, { useState } from 'react';
import Panel from '../Panel';
import { useData } from '../../contexts/DataContext';
import type { Product } from '../../types';

const StorePanel: React.FC = () => {
    const { 
        products, 
        addToCart, 
        cart, 
        removeFromCart, 
        updateCartQuantity, 
        cartTotal, 
        isAdmin, 
        addProduct, 
        deleteProduct 
    } = useData();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '', price: 0, category: '', image: '', description: ''
    });

    const handleAddNewProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProduct.name && newProduct.price) {
            addProduct({
                id: `prod_${Date.now()}`,
                name: newProduct.name,
                price: Number(newProduct.price),
                category: newProduct.category || 'Misc',
                image: newProduct.image || 'https://via.placeholder.com/300',
                description: newProduct.description || ''
            });
            setIsAddingProduct(false);
            setNewProduct({ name: '', price: 0, category: '', image: '', description: '' });
        }
    };

    return (
        <Panel title="~/merch_store">
            <div className="relative min-h-[600px]">
                {/* Store Header */}
                <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Official Merch</h2>
                        <p className="text-slate-400 text-sm mt-1">Powered by Printful Integration</p>
                    </div>
                    <div className="flex items-center gap-3">
                         {isAdmin && (
                            <button 
                                onClick={() => setIsAddingProduct(true)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded border border-slate-600 text-sm font-mono"
                            >
                                + Add Item (Admin)
                            </button>
                        )}
                        <button 
                            onClick={() => setIsCartOpen(!isCartOpen)}
                            className="relative bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md flex items-center gap-2 font-bold shadow-lg shadow-cyan-900/20 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                            Cart
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-mono border border-slate-900">
                                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Admin Add Product Modal */}
                {isAddingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-slate-900 border border-slate-700 rounded-lg w-full max-w-md p-6 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">Add Printful Product (Mock)</h3>
                            <form onSubmit={handleAddNewProduct} className="space-y-3">
                                <input type="text" placeholder="Product Name" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" required onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                                <input type="number" placeholder="Price" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" required onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                                <input type="text" placeholder="Category" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                                <input type="url" placeholder="Image URL" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
                                <textarea placeholder="Description" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                                <div className="flex justify-end gap-2 pt-2">
                                    <button type="button" onClick={() => setIsAddingProduct(false)} className="text-slate-400 hover:text-white px-4">Cancel</button>
                                    <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded">Add Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                    {/* Product Grid */}
                    <div className={`col-span-1 ${isCartOpen ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-all`}>
                        {products.map(product => (
                            <div key={product.id} className="group bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all flex flex-col">
                                <div className="relative aspect-square bg-slate-700 overflow-hidden">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    {isAdmin && (
                                        <button 
                                            onClick={() => deleteProduct(product.id)}
                                            className="absolute top-2 right-2 bg-red-900/80 text-red-200 p-1 rounded hover:bg-red-700"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                        </button>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-100 text-lg leading-tight">{product.name}</h3>
                                        <span className="font-mono text-cyan-400 font-bold ml-2">${product.price.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{product.category}</p>
                                    <p className="text-sm text-slate-400 mb-4 flex-grow">{product.description}</p>
                                    <button 
                                        onClick={() => addToCart(product)}
                                        className="w-full bg-slate-700 hover:bg-cyan-600 text-slate-200 hover:text-white py-2 rounded font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Sidebar (Desktop: Sticky Column, Mobile: Overlay) */}
                    {isCartOpen && (
                        <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col animate-slide-in-right lg:static lg:h-auto lg:border lg:border-slate-700 lg:rounded-lg lg:shadow-none lg:block lg:z-auto">
                            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                                <h3 className="text-xl font-bold font-mono text-white">Your Cart</h3>
                                <button onClick={() => setIsCartOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {cart.length === 0 ? (
                                    <div className="text-center text-slate-500 py-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
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
                                    disabled={cart.length === 0}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/20"
                                    onClick={() => alert("In a production environment, this would redirect to Stripe Checkout or Printful Order API.")}
                                >
                                    Checkout via Stripe
                                </button>
                                <p className="text-[10px] text-slate-500 text-center mt-2">
                                    Secure checkout handled externally. Products fulfilled by Printful.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Panel>
    );
};

export default StorePanel;