import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, User, Menu, X, ShieldCheck } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Scanner', to: '/scan' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Manufacturer', to: '/manufacturer' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          borderBottom: '1px solid',
          borderColor: scrolled ? '#E2E8F0' : 'rgba(226, 232, 240, 0.6)',
          background: scrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          transition: 'all 0.25s ease',
          boxShadow: scrolled ? '0 4px 20px -2px rgba(15, 23, 42, 0.05)' : 'none',
        }}
      >
        {/* Top subtle Saffron line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, #EA580C, #F97316, #15803D)',
        }} />

        <div className="max-w-content" style={{ display: 'flex', alignItems: 'center', height: 64 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 34, height: 34, background: 'linear-gradient(135deg, #EA580C, #C2410C)', borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)',
            }}>
              <ScanLine size={20} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy-dark)', lineHeight: 1.1 }}>
                MetroScan <span style={{ color: 'var(--saffron)' }}>AI</span>
              </div>
              <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>
                Legal Metrology · Govt of India
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 48, flex: 1 }}>
            {NAV_LINKS.map(link => {
              const active = location.pathname === link.to || location.pathname.startsWith(link.to + '/');
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: '0.875rem',
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--saffron)' : 'var(--text-secondary)',
                    background: active ? '#FFF7ED' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--navy-dark)';
                      (e.currentTarget as HTMLElement).style.background = '#F8FAFC';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Officer portal badge & login btn */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'none', alignItems: 'center', gap: 6,
              background: '#F1F5F9', padding: '6px 12px', borderRadius: 20,
              fontSize: '0.75rem', color: 'var(--navy-dark)', fontWeight: 600,
            }} className="md-flex">
              <ShieldCheck size={14} color="var(--india-green)" />
              NIC Portal Active
            </div>

            <button
              className="btn-outline"
              style={{ padding: '8px 18px', fontSize: '0.8125rem' }}
              onClick={() => navigate('/dashboard')}
            >
              <User size={14} />
              Officer Dashboard
            </button>

            {/* Mobile menu icon */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              style={{
                display: 'none', background: 'transparent', border: '1px solid var(--border)',
                borderRadius: 8, padding: 8, color: 'var(--text-secondary)', cursor: 'pointer',
              }}
              className="mobile-menu-btn"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
              background: '#FFFFFF',
              borderBottom: '1px solid var(--border)',
              padding: '16px 24px',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'block', padding: '12px 0',
                  color: location.pathname === link.to ? 'var(--saffron)' : 'var(--navy-dark)',
                  textDecoration: 'none', fontSize: '1rem', fontWeight: 600,
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          nav { display: none !important; }
        }
        @media (min-width: 768px) {
          .md-flex { display: flex !important; }
        }
      `}</style>
    </>
  );
}
