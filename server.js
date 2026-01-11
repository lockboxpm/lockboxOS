import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// ============== API ROUTES ==============

// Printful API Proxy - Products List
app.get('/api/printful/store/products', async (req, res) => {
    try {
        const printfulKey = process.env.PRINTFUL_API_KEY;

        if (!printfulKey) {
            console.error('PRINTFUL_API_KEY not set');
            return res.status(500).json({ error: 'Printful API key not configured' });
        }

        const response = await fetch('https://api.printful.com/store/products', {
            headers: {
                'Authorization': `Bearer ${printfulKey}`,
                'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID || '17464534'
            }
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Printful API error:', error);
        res.status(500).json({ error: 'Failed to fetch from Printful', details: String(error) });
    }
});

// Printful API Proxy - Product Details
app.get('/api/printful/store/products/:id', async (req, res) => {
    try {
        const printfulKey = process.env.PRINTFUL_API_KEY;

        if (!printfulKey) {
            return res.status(500).json({ error: 'Printful API key not configured' });
        }

        const response = await fetch(`https://api.printful.com/store/products/${req.params.id}`, {
            headers: {
                'Authorization': `Bearer ${printfulKey}`,
                'X-PF-Store-Id': process.env.PRINTFUL_STORE_ID || '17464534'
            }
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Printful product detail error:', error);
        res.status(500).json({ error: 'Failed to fetch product details', details: String(error) });
    }
});

// Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY || '', {
            apiVersion: '2025-04-30.basil'
        });

        const { items, successUrl, cancelUrl } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images: item.image ? [item.image] : undefined,
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity || 1,
            })),
            mode: 'payment',
            success_url: successUrl || `${req.headers.origin}/success`,
            cancel_url: cancelUrl || `${req.headers.origin}/`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// Send CV Email
app.post('/api/send-cv', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"Nicholas Kraemer" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Nicholas Kraemer - CV & Introduction',
            text: 'Thank you for your interest. Visit https://lockboxpm.com for more information.',
        });

        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Send Chat Transcript
app.post('/api/send-chat-transcript', async (req, res) => {
    try {
        const { sessionId, messages, timestamp } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'No messages provided' });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const formattedMessages = messages.map((msg) =>
            `[${msg.sender === 'ai' ? 'Nick (AI)' : 'Visitor'}]: ${msg.text}`
        ).join('\n\n');

        await transporter.sendMail({
            from: `"LockboxPM Chat Bot" <${process.env.SMTP_USER}>`,
            to: 'nick@lockboxpm.com',
            subject: `💬 New Chat Lead - Session ${sessionId?.slice(-8) || 'Unknown'}`,
            text: `Session: ${sessionId}\nTime: ${timestamp}\n\n${formattedMessages}`,
        });

        res.json({ success: true, message: 'Transcript sent successfully' });
    } catch (error) {
        console.error('Chat transcript error:', error);
        res.status(500).json({ error: 'Failed to send transcript' });
    }
});

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 LockboxPM server running on port ${PORT}`);
    console.log(`   PRINTFUL_API_KEY: ${process.env.PRINTFUL_API_KEY ? '✓ Set' : '✗ Missing'}`);
    console.log(`   STRIPE_API_SECRET_KEY: ${process.env.STRIPE_API_SECRET_KEY ? '✓ Set' : '✗ Missing'}`);
    console.log(`   SMTP configured: ${process.env.SMTP_HOST ? '✓ Yes' : '✗ No'}`);
});
