import type { Plugin, ViteDevServer } from 'vite';

/**
 * Vite plugin to proxy Printful API requests (works in both dev and production)
 */
export function printfulPlugin(): Plugin {
    return {
        name: 'printful-plugin',
        configureServer(server: ViteDevServer) {
            // Handle store products list
            server.middlewares.use('/api/printful/store/products', async (req, res, next) => {
                // Check if this is a specific product request (has an ID after /products/)
                const url = new URL(req.url || '', `http://${req.headers.host}`);
                const pathParts = url.pathname.split('/').filter(Boolean);

                // If there's an ID after products, let the next handler deal with it
                if (pathParts.length > 4) {
                    return next();
                }

                if (req.method !== 'GET') {
                    res.statusCode = 405;
                    res.end(JSON.stringify({ error: 'Method not allowed' }));
                    return;
                }

                try {
                    const printfulKey = process.env.PRINTFUL_API_KEY;

                    if (!printfulKey) {
                        console.error('PRINTFUL_API_KEY not set');
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'Printful API key not configured' }));
                        return;
                    }

                    const response = await fetch('https://api.printful.com/store/products', {
                        headers: {
                            'Authorization': `Bearer ${printfulKey}`,
                            'X-PF-Store-Id': '17464534'
                        }
                    });

                    const data = await response.json();

                    res.statusCode = response.status;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                } catch (error) {
                    console.error('Printful API error:', error);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Failed to fetch from Printful', details: String(error) }));
                }
            });

            // Handle specific product details
            server.middlewares.use((req, res, next) => {
                const match = req.url?.match(/^\/api\/printful\/store\/products\/(\d+)/);
                if (!match || req.method !== 'GET') {
                    return next();
                }

                const productId = match[1];

                (async () => {
                    try {
                        const printfulKey = process.env.PRINTFUL_API_KEY;

                        if (!printfulKey) {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ error: 'Printful API key not configured' }));
                            return;
                        }

                        const response = await fetch(`https://api.printful.com/store/products/${productId}`, {
                            headers: {
                                'Authorization': `Bearer ${printfulKey}`,
                                'X-PF-Store-Id': '17464534'
                            }
                        });

                        const data = await response.json();

                        res.statusCode = response.status;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(data));
                    } catch (error) {
                        console.error('Printful product detail error:', error);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'Failed to fetch product details', details: String(error) }));
                    }
                })();
            });
        },
    };
}
