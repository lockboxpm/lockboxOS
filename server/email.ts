import type { Plugin, ViteDevServer } from 'vite';
import nodemailer from 'nodemailer';

/**
 * Vite plugin to handle CV email sending requests
 */
export function emailPlugin(): Plugin {
    return {
        name: 'email-plugin',
        configureServer(server: ViteDevServer) {
            server.middlewares.use('/api/send-cv', async (req, res) => {
                if (req.method !== 'POST') {
                    res.statusCode = 405;
                    res.end(JSON.stringify({ error: 'Method not allowed' }));
                    return;
                }

                // Parse request body
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });

                req.on('end', async () => {
                    try {
                        const { email } = JSON.parse(body);

                        if (!email || !email.includes('@')) {
                            res.statusCode = 400;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ error: 'Invalid email address' }));
                            return;
                        }

                        // Create SMTP transporter
                        const transporter = nodemailer.createTransport({
                            host: process.env.SMTP_HOST,
                            port: parseInt(process.env.SMTP_PORT || '587'),
                            secure: false, // TLS
                            auth: {
                                user: process.env.SMTP_USER,
                                pass: process.env.SMTP_PASSWORD,
                            },
                        });

                        // Email content
                        const mailOptions = {
                            from: `"Nicholas Kraemer" <${process.env.SMTP_USER}>`,
                            to: email,
                            subject: 'Nicholas Kraemer - CV & Introduction',
                            html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 24px; }
        .header { border-bottom: 2px solid #0891b2; padding-bottom: 16px; margin-bottom: 24px; }
        .name { font-size: 24px; font-weight: bold; color: #0f172a; margin: 0; }
        .title { color: #64748b; font-size: 14px; margin: 4px 0 0; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 14px; font-weight: 600; color: #0891b2; text-transform: uppercase; margin-bottom: 8px; }
        .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
        a { color: #0891b2; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="name">Nicholas Kraemer</h1>
            <p class="title">Business Engineer | AI Architect | Financial Systems Consultant</p>
        </div>
        
        <div class="section">
            <p>Thank you for your interest in working with me.</p>
            <p>I specialize in financial systems automation, AI-powered workflows, and operational efficiency for growing businesses. With experience across property management, fintech, and enterprise operations, I help organizations streamline their processes and make data-driven decisions.</p>
        </div>

        <div class="section">
            <div class="section-title">What I Offer</div>
            <ul>
                <li><strong>Financial Systems & Automation</strong> - QuickBooks, AppFolio, Xero integrations</li>
                <li><strong>AI & Agentic Workflows</strong> - Custom automation using LLMs and intelligent agents</li>
                <li><strong>Fractional CFO Services</strong> - Strategic financial guidance for growing companies</li>
                <li><strong>Playwright & Web Automation</strong> - Browser automation for complex web workflows</li>
            </ul>
        </div>

        <div class="section">
            <div class="section-title">Let's Connect</div>
            <p>Ready to discuss how I can help your business? Visit <a href="https://lockboxpm.com">lockboxpm.com</a> to schedule a call.</p>
        </div>

        <div class="footer">
            <p>Nicholas Kraemer | Business Engineer</p>
            <p>Email: nick@lockboxpm.com | Web: <a href="https://lockboxpm.com">lockboxpm.com</a></p>
        </div>
    </div>
</body>
</html>
                            `,
                            text: `
Nicholas Kraemer - Business Engineer | AI Architect | Financial Systems Consultant

Thank you for your interest in working with me.

I specialize in financial systems automation, AI-powered workflows, and operational efficiency for growing businesses.

WHAT I OFFER:
- Financial Systems & Automation - QuickBooks, AppFolio, Xero integrations
- AI & Agentic Workflows - Custom automation using LLMs and intelligent agents
- Fractional CFO Services - Strategic financial guidance for growing companies  
- Playwright & Web Automation - Browser automation for complex web workflows

Ready to discuss how I can help your business? Visit https://lockboxpm.com to schedule a call.

Nicholas Kraemer
Email: nick@lockboxpm.com
Web: https://lockboxpm.com
                            `
                        };

                        // Send email
                        await transporter.sendMail(mailOptions);

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ success: true, message: 'Email sent successfully' }));

                    } catch (error) {
                        console.error('Email error:', error);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'Failed to send email', details: String(error) }));
                    }
                });
            });

            // Chat transcript endpoint
            server.middlewares.use('/api/send-chat-transcript', async (req, res) => {
                if (req.method !== 'POST') {
                    res.statusCode = 405;
                    res.end(JSON.stringify({ error: 'Method not allowed' }));
                    return;
                }

                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });

                req.on('end', async () => {
                    try {
                        const { sessionId, messages, timestamp } = JSON.parse(body);

                        if (!messages || !Array.isArray(messages) || messages.length === 0) {
                            res.statusCode = 400;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ error: 'No messages provided' }));
                            return;
                        }

                        // Format messages for email
                        const formattedMessages = messages.map((msg: { sender: string; text: string }) => {
                            const sender = msg.sender === 'ai' ? '🤖 Nick (AI)' : '👤 Visitor';
                            return `<div style="margin-bottom: 12px; padding: 12px; background: ${msg.sender === 'ai' ? '#f1f5f9' : '#e0f2fe'}; border-radius: 8px;">
                                <strong style="color: ${msg.sender === 'ai' ? '#475569' : '#0891b2'};">${sender}</strong>
                                <p style="margin: 6px 0 0; color: #334155;">${msg.text}</p>
                            </div>`;
                        }).join('');

                        // Create SMTP transporter
                        const transporter = nodemailer.createTransport({
                            host: process.env.SMTP_HOST,
                            port: parseInt(process.env.SMTP_PORT || '587'),
                            secure: false,
                            auth: {
                                user: process.env.SMTP_USER,
                                pass: process.env.SMTP_PASSWORD,
                            },
                        });

                        const mailOptions = {
                            from: `"LockboxPM Chat Bot" <${process.env.SMTP_USER}>`,
                            to: 'nick@lockboxpm.com',
                            subject: `💬 New Chat Lead - Session ${sessionId?.slice(-8) || 'Unknown'}`,
                            html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0891b2 0%, #6366f1 100%); color: white; padding: 20px; border-radius: 12px 12px 0 0; }
        .content { background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; }
        .meta { font-size: 12px; color: #64748b; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="header">
        <h2 style="margin: 0;">💬 New Website Chat Lead</h2>
        <p style="margin: 8px 0 0; opacity: 0.9;">A visitor had a conversation on lockboxpm.com</p>
    </div>
    <div class="content">
        <div class="meta">
            <strong>Session ID:</strong> ${sessionId || 'Unknown'}<br>
            <strong>Timestamp:</strong> ${timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString()}<br>
            <strong>Messages:</strong> ${messages.length}
        </div>
        <h3 style="color: #0f172a; margin-bottom: 16px;">Conversation Transcript</h3>
        ${formattedMessages}
    </div>
</body>
</html>
                            `,
                            text: messages.map((msg: { sender: string; text: string }) =>
                                `[${msg.sender === 'ai' ? 'Nick (AI)' : 'Visitor'}]: ${msg.text}`
                            ).join('\n\n')
                        };

                        await transporter.sendMail(mailOptions);

                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ success: true, message: 'Transcript sent successfully' }));

                    } catch (error) {
                        console.error('Chat transcript email error:', error);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'Failed to send transcript', details: String(error) }));
                    }
                });
            });
        },
    };
}
