import type { CartItem } from '../types';

export interface CheckoutResponse {
    url: string;
    sessionId: string;
}

export interface CheckoutItem {
    name: string;
    price: number;
    quantity: number;
    image?: string;
    interval?: 'month' | 'year';
}

export async function createCheckoutSession(
    items: CheckoutItem[],
    successUrl?: string,
    cancelUrl?: string,
    mode: 'payment' | 'subscription' = 'payment'
): Promise<CheckoutResponse> {
    const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            items: items.map(item => ({
                id: (item as any).id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                interval: item.interval,
            })),
            successUrl: successUrl || `${window.location.origin}/?checkout=success`,
            cancelUrl: cancelUrl || `${window.location.origin}/?checkout=cancelled`,
            mode,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Checkout failed');
    }

    return response.json();
}
