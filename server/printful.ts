import type { Plugin, ViteDevServer } from 'vite';

/**
 * Vite plugin to proxy Printful API requests (works in both dev and production)
 */
export function printfulPlugin(): Plugin {
    return {
        name: 'printful-plugin',
        configureServer(server: ViteDevServer) {
            // Handle specific product details FIRST (before the general products endpoint)
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

            // Handle store products list (only exact /api/printful/store/products)
            server.middlewares.use('/api/printful/store/products', async (req, res, next) => {
                // Only handle exact match (no trailing path)
                if (req.url && req.url !== '/' && req.url !== '') {
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
        },
    };
}
