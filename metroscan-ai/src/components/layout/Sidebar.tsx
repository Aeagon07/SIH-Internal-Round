import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ScanLine, LayoutDashboard, Camera,
  Building2, FileText, ArrowLeft, ShieldCheck, UserCheck, KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Enforcement Dashboard', to: '/dashboard' },
  { icon: Camera, label: 'Compliance Scanner', to: '/scan' },
  { icon: Building2, label: 'Manufacturer Clearance', to: '/manufacturer' },
  { icon: FileText, label: 'Audit Reports', to: '/results' },
];

interface SidebarProps {
  collapsed?: boolean;
  officerName?: string;
  badgeId?: string;
  onUpdateOfficer?: (name: string, badge: string) => void;
}

export default function Sidebar({
  collapsed = false,
  officerName = 'Inspector Rajesh Kumar',
  badgeId = 'MH-LM-4029',
  onUpdateOfficer,
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [inputName, setInputName] = useState(officerName);
  const [inputBadge, setInputBadge] = useState(badgeId);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateOfficer && inputName.trim()) {
      onUpdateOfficer(inputName.trim(), inputBadge.trim() || 'MH-LM-5001');
    }
    setShowAuthModal(false);
  };

  return (
    <>
      <aside style={{
        width: collapsed ? 68 : 240,
        background: '#FFFFFF',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        transition: 'width 0.25s ease',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Header: Logo linked to Home */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '16px 18px',
          borderBottom: '1px solid var(--border)',
          height: 64, flexShrink: 0,
          background: '#FFFFFF',
        }}>
          <Link
            to="/"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              textDecoration: 'none', width: '100%',
            }}
          >
            <div style={{
              width: 34, height: 34, background: 'linear-gradient(135deg, #EA580C, #C2410C)', borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)',
            }}>
              <ScanLine size={18} color="#FFFFFF" />
            </div>
            {!collapsed && (
              <div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.95rem', color: 'var(--navy-dark)', lineHeight: 1.1 }}>
                  MetroScan <span style={{ color: 'var(--saffron)' }}>AI</span>
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Legal Metrology Dept
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* Home Navigation button */}
        {!collapsed && (
          <div style={{ padding: '12px 14px 6px 14px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px', background: '#F8FAFC',
                border: '1px solid var(--border)', borderRadius: 8,
                color: 'var(--navy-dark)', fontSize: '0.8rem', fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FFF7ED')}
              onMouseLeave={e => (e.currentTarget.style.background = '#F8FAFC')}
            >
              <ArrowLeft size={14} color="var(--saffron)" />
              Back to Home Page
            </button>
          </div>
        )}

        {/* Officer info card with Login Switch */}
        {!collapsed && (
          <div style={{ padding: '10px 14px', flexShrink: 0 }}>
            <div style={{
              padding: '12px', borderRadius: 10,
              background: '#F8FAFC', border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: '#FFF7ED',
                  border: '1px solid rgba(234, 88, 12, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <ShieldCheck size={16} color="var(--saffron)" />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-dark)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {officerName}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                    Badge: {badgeId}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  width: '100%', padding: '5px 8px', background: '#FFFFFF',
                  border: '1px solid var(--border)', borderRadius: 6,
                  fontSize: '0.72rem', fontWeight: 700, color: 'var(--saffron)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                }}
              >
                <KeyRound size={12} /> Switch Officer Profile
              </button>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav style={{ padding: '10px 12px', flex: 1, overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`sidebar-nav-item ${active ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
                style={{ justifyContent: collapsed ? 'center' : 'flex-start', marginBottom: 4 }}
              >
                <Icon size={18} style={{ flexShrink: 0, color: active ? 'var(--saffron)' : 'var(--text-muted)' }} />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', background: '#F8FAFC', flexShrink: 0 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <div style={{ color: 'var(--india-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--india-green)' }} />
                NIC Officer Portal Active
              </div>
              <div style={{ marginTop: 2 }}>Ministry of Consumer Affairs</div>
            </div>
          </div>
        )}
      </aside>

      {/* Officer Switch Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                position: 'relative', zIndex: 301, background: '#FFFFFF',
                borderRadius: 16, border: '1px solid var(--border)',
                padding: 28, width: 360, boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <UserCheck size={22} color="var(--saffron)" />
                <h3 className="text-h3">Officer Credentials Auth</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
                Enter District Enforcement Officer name and badge ID to authenticate inspector privileges.
              </p>
              <form onSubmit={handleAuthSubmit}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--navy-dark)', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    Inspector Name
                  </label>
                  <input
                    className="input-base"
                    value={inputName}
                    onChange={e => setInputName(e.target.value)}
                    placeholder="e.g. Inspector Rajesh Kumar"
                    required
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--navy-dark)', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                    Government Badge / District ID
                  </label>
                  <input
                    className="input-base"
                    value={inputBadge}
                    onChange={e => setInputBadge(e.target.value)}
                    placeholder="e.g. MH-LM-4029"
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowAuthModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    Verify &amp; Enter
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
