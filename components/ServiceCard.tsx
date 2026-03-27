import React from 'react';
import { useCart } from '../contexts/CartContext';

interface ServiceCardProps {
    id: string;
    price: number;
    priceLabel?: string; // e.g., "$800" or "$50/item"
    title: string;
    description: string;
    category: string;
    badge?: string;
    badgeColor?: 'violet' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'blue';
    accentColor?: 'violet' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'blue' | 'slate';
    isRecurring?: boolean;
    interval?: 'month' | 'year';
    isQuoteOnly?: boolean;
}

const colorMap = {
    violet: { border: 'border-violet-500/30', badge: 'bg-violet-500 text-white', text: 'text-violet-400' },
    emerald: { border: 'border-emerald-500/30', badge: 'bg-emerald-500 text-slate-900', text: 'text-emerald-400' },
    rose: { border: 'border-rose-500/30', badge: 'bg-rose-500 text-white', text: 'text-rose-400' },
    amber: { border: 'border-amber-500/30', badge: 'bg-amber-500 text-slate-900', text: 'text-amber-400' },
    cyan: { border: 'border-cyan-500/30', badge: 'bg-cyan-500 text-slate-900', text: 'text-cyan-400' },
    blue: { border: 'border-blue-500/30', badge: 'bg-blue-500 text-white', text: 'text-blue-400' },
    slate: { border: 'border-slate-700/50', badge: 'bg-slate-600 text-white', text: 'text-slate-400' },
};

const ServiceCard: React.FC<ServiceCardProps> = ({
    id,
    price,
    priceLabel,
    title,
    description,
    category,
    badge,
    badgeColor = 'violet',
    accentColor = 'slate',
    isRecurring = false,
    interval = 'year',
    isQuoteOnly = false,
}) => {
    const { addToCart } = useCart();
    const colors = colorMap[accentColor];

    const handleAddToCart = () => {
        addToCart({
            id,
            name: title,
            price,
            category,
            description,
            isRecurring,
            interval,
        });
    };

    return (
        <div className={`bg-slate-800/50 rounded-lg p-5 border ${badge ? colorMap[badgeColor].border : colors.border} relative flex flex-col`}>
            {badge && (
                <div className={`absolute -top-2 right-3 ${colorMap[badgeColor].badge} text-[9px] font-bold px-2 py-0.5 rounded`}>
                    {badge}
                </div>
            )}
            <div className="text-2xl font-bold text-slate-100 mb-1">
                {priceLabel || `$${price.toLocaleString()}`}
                {isRecurring && <span className="text-sm font-normal text-slate-500">/{interval === 'year' ? 'yr' : 'mo'}</span>}
            </div>
            <div className={`${colors.text} font-medium text-sm mb-3`}>{title}</div>
            <p className="text-sm text-slate-400 flex-1" dangerouslySetInnerHTML={{ __html: description }} />

            {!isQuoteOnly && (
                <button
                    onClick={handleAddToCart}
                    className="mt-4 w-full py-2 px-3 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 text-sm font-medium rounded-lg border border-cyan-500/30 transition-all hover:border-cyan-500/50 flex items-center justify-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Add to Cart
                </button>
            )}
            {isQuoteOnly && (
                <div className="mt-4 w-full py-2 px-3 bg-slate-700/50 text-slate-400 text-sm font-medium rounded-lg border border-slate-600/30 text-center">
                    Contact for Quote
                </div>
            )}
        </div>
    );
};

export default ServiceCard;
