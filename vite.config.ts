import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { stripeCheckoutPlugin } from './server/stripe-checkout';
import { emailPlugin } from './server/email';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Make API keys available to server middleware
  process.env.STRIPE_API_SECRET_KEY = env.STRIPE_API_SECRET_KEY;
  process.env.SMTP_HOST = env.SMTP_HOST;
  process.env.SMTP_PORT = env.SMTP_PORT;
  process.env.SMTP_USER = env.SMTP_USER;
  process.env.SMTP_PASSWORD = env.SMTP_PASSWORD;

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api/printful': {
          target: 'https://api.printful.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/printful/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Authorization', `Bearer ${env.PRINTFUL_API_KEY}`);
              proxyReq.setHeader('X-PF-Store-Id', '17464534');
            });
          }
        }
      }
    },
    plugins: [
      react(),
      stripeCheckoutPlugin(),
      emailPlugin()
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.PRINTFUL_STORE_ID': JSON.stringify('17464534'),
      'process.env.STRIPE_PUBLISHABLE_KEY': JSON.stringify(env.STRIPE_PUBLISHABLE_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});

