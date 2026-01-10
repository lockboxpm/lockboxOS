import type { CartItem } from '../types';

export interface CheckoutResponse {
    url: string;
    sessionId: string;
}

export async function createCheckoutSession(
    items: CartItem[],
    successUrl?: string,
    cancelUrl?: string
): Promise<CheckoutResponse> {
    const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            })),
            successUrl: successUrl || `${window.location.origin}/?checkout=success`,
            cancelUrl: cancelUrl || `${window.location.origin}/?checkout=cancelled`,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Checkout failed');
    }

    return response.json();
}
