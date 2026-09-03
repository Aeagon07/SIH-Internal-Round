import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { ScanProvider } from './hooks/useScanContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScanProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#162035',
              color: '#F1F5F9',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#16A34A', secondary: '#fff' } },
            error: { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
          }}
        />
      </ScanProvider>
    </BrowserRouter>
  </React.StrictMode>
);
