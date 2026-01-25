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
app.post('/api/checkout', async (req, res) => {
    try {
        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY || '', {
            apiVersion: '2025-04-30.basil'
        });

        const { items, successUrl, cancelUrl, mode = 'payment' } = req.body;

        // Build line items based on mode
        const lineItems = items.map((item) => {
            const priceData = {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : undefined,
                },
                unit_amount: Math.round(item.price * 100),
            };

            // Add recurring interval for subscription mode
            if (mode === 'subscription') {
                priceData.recurring = {
                    interval: item.interval || 'year',
                };
            }

            return {
                price_data: priceData,
                quantity: item.quantity || 1,
            };
        });

        const sessionParams = {
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: mode,
            success_url: successUrl || `${req.headers.origin}/?checkout=success`,
            cancel_url: cancelUrl || `${req.headers.origin}/?checkout=cancelled`,
        };

        // Add shipping for physical products (payment mode only)
        if (mode === 'payment') {
            sessionParams.shipping_address_collection = {
                allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'MX', 'CR'],
            };
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({ error: error.message || 'Failed to create checkout session' });
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

// Send Intake Summary/Quote Email
app.post('/api/send-intake-summary', async (req, res) => {
    try {
        const { email, name, company, playbookHtml } = req.body;

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
            from: `"Nicholas Kraemer - LockboxPM" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Your Strategy Playbook - ${company}`,
            html: `
                <div style="font-family: 'Helvetica', sans-serif; color: #333; max-width: 700px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0891b2, #1e40af); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0;">LockboxPM</h1>
                        <p style="color: #e0f2fe; margin: 10px 0 0;">Financial Systems & AI Automation Consulting</p>
                    </div>
                    <div style="padding: 30px; background: #f8fafc; border: 1px solid #e2e8f0;">
                        <p>Hi ${name},</p>
                        <p>Thank you for submitting your project intake. Here's your personalized strategy playbook:</p>
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                            ${playbookHtml}
                        </div>
                        <p><strong>Ready to get started?</strong></p>
                        <p>
                            <a href="https://lockboxpm.com/communicate" style="display: inline-block; background: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Schedule a Call</a>
                        </p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                        <p style="font-size: 12px; color: #64748b;">
                            Nicholas Kraemer | Financial Systems Engineer<br>
                            Email: nick@lockboxpm.com | Phone: 702-720-4750<br>
                            www.lockboxpm.com
                        </p>
                    </div>
                </div>
            `,
        });

        res.json({ success: true, message: 'Playbook summary sent successfully' });
    } catch (error) {
        console.error('Intake summary email error:', error);
        res.status(500).json({ error: 'Failed to send summary email' });
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
