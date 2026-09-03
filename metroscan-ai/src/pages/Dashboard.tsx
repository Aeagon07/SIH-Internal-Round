import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { ScanLine, TrendingUp, AlertTriangle, Clock, Download, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import StatusBadge from '@/components/ui/StatusBadge';
import { RECENT_SCANS, VIOLATION_BY_FIELD, SCAN_DISTRIBUTION, generateDailyData } from '@/data/mockData';
import toast from 'react-hot-toast';

const STAT_CARDS = [
  { label: 'Total Products Audited', value: 1247, trend: '↑ 23% vs previous month', trendUp: true, icon: ScanLine, color: 'var(--saffron)' },
  { label: 'Legal Violations Flagged', value: 342, trend: '↓ 8% enforcement reduction', trendUp: true, icon: AlertTriangle, color: 'var(--crimson)' },
  { label: 'Overall Compliance Rate', value: 73, trend: '↑ 4.2% quality compliance', trendUp: true, icon: TrendingUp, color: 'var(--india-green)', unit: '%' },
  { label: 'Inspector Escalations', value: 18, trend: 'Pending officer audit', trendUp: false, icon: Clock, color: 'var(--amber)' },
];

const FILTER_PILLS = ['All Audits', 'Critical Non-Compliance', 'Major Non-Compliance', 'Fully Compliant'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px', fontSize: '0.8125rem',
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ color: 'var(--navy-dark)', fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState('All Audits');
  const [sortCol, setSortCol] = useState('time');
  const [sortAsc, setSortAsc] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [officerName, setOfficerName] = useState('Inspector Rajesh Kumar');
  const [badgeId, setBadgeId] = useState('MH-LM-4029');

  const navigate = useNavigate();
  const dailyData = useMemo(generateDailyData, []);

  const filteredScans = RECENT_SCANS.filter(s => {
    if (activeFilter === 'All Audits') return true;
    if (activeFilter === 'Critical Non-Compliance') return s.violations.critical > 0;
    if (activeFilter === 'Major Non-Compliance') return s.violations.major > 0;
    if (activeFilter === 'Fully Compliant') return s.status === 'compliant';
    return true;
  });

  const sidebarWidth = sidebarCollapsed ? 68 : 240;

  return (
    <div style={{ display: 'flex', background: 'var(--bg-base)', minHeight: '100vh' }}>
      {/* Sidebar with officer profile */}
      <Sidebar
        collapsed={sidebarCollapsed}
        officerName={officerName}
        badgeId={badgeId}
        onUpdateOfficer={(name, badge) => {
          setOfficerName(name);
          setBadgeId(badge);
          toast.success(`Authenticated as ${name} (${badge})`);
        }}
      />

      {/* Main Content Area */}
      <div style={{ marginLeft: sidebarWidth, flex: 1, transition: 'margin-left 0.25s ease', minWidth: 0 }}>
        {/* Top Sticky Header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          padding: '12px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/')}
            className="btn-outline"
            style={{ padding: '7px 16px', fontSize: '0.8125rem' }}
          >
            <ArrowLeft size={16} /> Back to Home Page
          </button>

          {/* Active Officer Badge Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FFF7ED', border: '1px solid rgba(234, 88, 12, 0.3)',
              padding: '6px 14px', borderRadius: 20,
              fontSize: '0.78rem', color: 'var(--saffron)', fontWeight: 700,
            }}>
              <ShieldCheck size={14} color="var(--saffron)" />
              {officerName} ({badgeId}) · District Inspector
            </div>

            <button
              onClick={() => {
                const name = prompt('Enter District Inspector Name:', officerName);
                if (name) {
                  setOfficerName(name);
                  toast.success(`Updated Inspector Profile: ${name}`);
                }
              }}
              className="btn-ghost"
              style={{ fontSize: '0.78rem', padding: '6px 12px', border: '1px solid var(--border)' }}
            >
              <UserCheck size={14} /> Change Officer Profile
            </button>
          </div>
        </div>

        <div style={{ padding: '32px 32px 48px' }}>
          {/* Page Heading */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="text-h1">Legal Metrology Enforcement Dashboard</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 3 }}>
                Official Packaged Commodities Audit Log &amp; Compliance Analytics · Government of India
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <select className="input-base" style={{ width: 'auto', padding: '8px 36px 8px 14px', fontSize: '0.85rem' }}>
                <option>Current Fiscal Year (2025–26)</option>
                <option>Last 30 Days Audit</option>
                <option>Last Quarter</option>
              </select>
              <button
                className="btn-primary"
                style={{ padding: '9px 18px', fontSize: '0.85rem' }}
                onClick={() => toast.success('Exporting Official Legal Metrology Audit PDF...')}
              >
                <Download size={16} /> Export Audit Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }} className="stats-grid">
            {STAT_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  className="glass-card"
                  style={{ padding: '22px 24px' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'Outfit' }}>{card.label}</span>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: `${card.color}15`, border: `1px solid ${card.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} color={card.color} />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--navy-dark)', lineHeight: 1, marginBottom: 8, fontFamily: 'Outfit' }}>
                    <AnimatedCounter target={card.value} suffix={card.unit || ''} />
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: card.trendUp ? 'var(--india-green)' : 'var(--crimson)' }}>
                    {card.trend}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 24, marginBottom: 32 }} className="charts-row">
            {/* Rule Violations Bar Chart */}
            <motion.div
              className="glass-card"
              style={{ padding: '24px 24px 16px' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <h3 className="text-h3" style={{ marginBottom: 18 }}>Rule 6 Declaration Non-Compliance Frequency</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={VIOLATION_BY_FIELD} layout="vertical" margin={{ left: 20, right: 20, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="field" tick={{ fill: '#0F172A', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Violations Count" radius={[0, 6, 6, 0]} fill="#EA580C" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Inspection Modality Pie Chart */}
            <motion.div
              className="glass-card"
              style={{ padding: '24px 24px 16px', display: 'flex', flexDirection: 'column' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <h3 className="text-h3" style={{ marginBottom: 12 }}>Inspection Modality Breakdown</h3>
              <div style={{ flex: 1, position: 'relative', minHeight: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SCAN_DISTRIBUTION}
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={80}
                      dataKey="value"
                      stroke="none"
                    >
                      {SCAN_DISTRIBUTION.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  textAlign: 'center', pointerEvents: 'none',
                }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--navy-dark)', lineHeight: 1, fontFamily: 'Outfit' }}>1,247</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Audits</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {SCAN_DISTRIBUTION.map(d => (
                  <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                      <span style={{ fontSize: '0.8125rem', color: 'var(--navy-dark)', fontWeight: 600 }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--navy-dark)', fontWeight: 700 }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Daily Trends Line Chart */}
          <motion.div
            className="glass-card"
            style={{ padding: '24px 24px 16px', marginBottom: 32 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <h3 className="text-h3" style={{ marginBottom: 20 }}>Daily Inspection &amp; Non-Compliance Trends (Past 30 Days)</h3>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={dailyData} margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#0F172A', fontSize: '0.8125rem', marginTop: 10 }} />
                <Line type="monotone" dataKey="scans" name="Total Inspections" stroke="#EA580C" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="violations" name="Violations Flagged" stroke="#DC2626" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Audit Logs Table */}
          <motion.div
            className="glass-card"
            style={{ overflow: 'hidden' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <div style={{ padding: '20px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <h3 className="text-h3">Packaged Commodity Verification Register</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {FILTER_PILLS.map(pill => (
                  <button
                    key={pill}
                    onClick={() => setActiveFilter(pill)}
                    style={{
                      padding: '6px 14px', borderRadius: 20, border: '1px solid',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      background: activeFilter === pill ? 'var(--saffron)' : '#FFFFFF',
                      borderColor: activeFilter === pill ? 'var(--saffron)' : 'var(--border)',
                      color: activeFilter === pill ? '#FFFFFF' : 'var(--text-secondary)',
                      boxShadow: activeFilter === pill ? '0 2px 8px rgba(234, 88, 12, 0.3)' : 'none',
                    }}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    {['Case Ref', 'Commodity Name', 'Modality', 'Inspector Name', 'Inspection Time', 'Score', 'Violations', 'Status', 'Action'].map(col => (
                      <th key={col} onClick={() => { setSortCol(col); setSortAsc(v => !v); }}>
                        {col} {sortCol === col ? (sortAsc ? '↑' : '↓') : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredScans.map(scan => (
                    <tr key={scan.id}>
                      <td style={{ fontSize: '0.85rem', color: 'var(--saffron)', fontWeight: 700 }}>{scan.id}</td>
                      <td style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>{scan.product}</td>
                      <td style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{scan.track}</td>
                      <td style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{scan.officer}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>{scan.time}</td>
                      <td>
                        <span style={{
                          fontSize: '0.9rem', fontWeight: 700,
                          color: scan.score >= 80 ? 'var(--india-green)' : scan.score >= 50 ? 'var(--amber)' : 'var(--crimson)',
                        }}>
                          {scan.score}%
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                        <span style={{ color: 'var(--crimson)', fontWeight: 700 }}>{scan.violations.critical} Critical</span>{' '}
                        <span style={{ color: 'var(--amber)', fontWeight: 700 }}>{scan.violations.major} Major</span>
                      </td>
                      <td><StatusBadge status={scan.status} /></td>
                      <td>
                        <button
                          className="btn-outline"
                          style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                          onClick={() => navigate('/results')}
                        >
                          View Official Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .charts-row { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
