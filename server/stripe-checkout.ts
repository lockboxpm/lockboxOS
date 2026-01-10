import type { Plugin, ViteDevServer } from 'vite';
import Stripe from 'stripe';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export function stripeCheckoutPlugin(): Plugin {
    return {
        name: 'stripe-checkout',
        configureServer(server: ViteDevServer) {
            server.middlewares.use('/api/checkout', async (req, res) => {
                if (req.method !== 'POST') {
                    res.statusCode = 405;
                    res.end(JSON.stringify({ error: 'Method not allowed' }));
                    return;
                }

                // Parse request body
                let body = '';
                for await (const chunk of req) {
                    body += chunk;
                }

                try {
                    const { items, successUrl, cancelUrl } = JSON.parse(body) as {
                        items: CartItem[];
                        successUrl: string;
                        cancelUrl: string;
                    };

                    if (!items || items.length === 0) {
                        res.statusCode = 400;
                        res.end(JSON.stringify({ error: 'No items in cart' }));
                        return;
                    }

                    // Get Stripe secret from environment
                    const stripeSecret = process.env.STRIPE_API_SECRET_KEY;
                    if (!stripeSecret) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Stripe not configured' }));
                        return;
                    }

                    const stripe = new Stripe(stripeSecret);

                    // Create line items for Stripe Checkout
                    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => ({
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: item.name,
                                images: item.image ? [item.image] : [],
                            },
                            unit_amount: Math.round(item.price * 100), // Convert to cents
                        },
                        quantity: item.quantity,
                    }));

                    // Create Stripe Checkout Session
                    const session = await stripe.checkout.sessions.create({
                        payment_method_types: ['card'],
                        line_items: lineItems,
                        mode: 'payment',
                        success_url: successUrl || `${req.headers.origin || 'http://localhost:3000'}/?checkout=success`,
                        cancel_url: cancelUrl || `${req.headers.origin || 'http://localhost:3000'}/?checkout=cancelled`,
                        shipping_address_collection: {
                            allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'MX', 'CR'],
                        },
                        metadata: {
                            source: 'lockboxpm_merch_store',
                        },
                    });

                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                        url: session.url,
                        sessionId: session.id
                    }));

                } catch (error) {
                    console.error('Stripe checkout error:', error);
                    res.statusCode = 500;
                    res.end(JSON.stringify({
                        error: error instanceof Error ? error.message : 'Checkout failed'
                    }));
                }
            });
        },
    };
}
