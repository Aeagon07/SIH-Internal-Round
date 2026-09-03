import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Copy screenshot image assets for GitHub README documentation
try {
  const images = [
    { src: 'C:\\Users\\Rushikesh\\.gemini\\antigravity\\brain\\0a4d83ed-d05f-4374-bceb-23a0f9446501\\landing_page_1788463290658.png', name: 'landing_page.png' },
    { src: 'C:\\Users\\Rushikesh\\.gemini\\antigravity\\brain\\0a4d83ed-d05f-4374-bceb-23a0f9446501\\scanner_page_1788463307299.png', name: 'scanner_page.png' },
    { src: 'C:\\Users\\Rushikesh\\.gemini\\antigravity\\brain\\0a4d83ed-d05f-4374-bceb-23a0f9446501\\dashboard_page_1788463320902.png', name: 'dashboard_page.png' },
    { src: 'C:\\Users\\Rushikesh\\.gemini\\antigravity\\brain\\0a4d83ed-d05f-4374-bceb-23a0f9446501\\audit_results_page_1788463337735.png', name: 'audit_results_page.png' },
    { src: 'C:\\Users\\Rushikesh\\.gemini\\antigravity\\brain\\0a4d83ed-d05f-4374-bceb-23a0f9446501\\manufacturer_page_1788463352535.png', name: 'manufacturer_page.png' },
  ];

  const targetDirs = [
    path.resolve(__dirname, '../docs/screenshots'),
    path.resolve(__dirname, './docs/screenshots'),
    path.resolve(__dirname, './public/screenshots')
  ];

  targetDirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  images.forEach(img => {
    if (fs.existsSync(img.src)) {
      targetDirs.forEach(dir => {
        fs.copyFileSync(img.src, path.join(dir, img.name));
      });
    }
  });
} catch (err) {
  // silent
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/claude': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/claude/, ''),
        headers: {
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
      },
    },
  },
})
