import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { stripeCheckoutPlugin } from './server/stripe-checkout';
import { emailPlugin } from './server/email';
import { printfulPlugin } from './server/printful';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Make API keys available to server middleware
  process.env.STRIPE_API_SECRET_KEY = env.STRIPE_API_SECRET_KEY;
  process.env.SMTP_HOST = env.SMTP_HOST;
  process.env.SMTP_PORT = env.SMTP_PORT;
  process.env.SMTP_USER = env.SMTP_USER;
  process.env.SMTP_PASSWORD = env.SMTP_PASSWORD;
  process.env.PRINTFUL_API_KEY = env.PRINTFUL_API_KEY;

  return {
    server: {
      port: 3000,
      host: '0.0.0.0'
    },
    plugins: [
      react(),
      stripeCheckoutPlugin(),
      emailPlugin(),
      printfulPlugin()
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

