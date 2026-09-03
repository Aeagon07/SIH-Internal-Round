import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import DemoModal from '@/components/modals/DemoModal';
import Landing from '@/pages/Landing';
import Scanner from '@/pages/Scanner';
import Processing from '@/pages/Processing';
import Results from '@/pages/Results';
import Dashboard from '@/pages/Dashboard';
import Manufacturer from '@/pages/Manufacturer';

const PAGES_WITHOUT_NAVBAR = ['/dashboard', '/manufacturer'];

// Page transition wrapper
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const hideNavbar = PAGES_WITHOUT_NAVBAR.some(p => location.pathname.startsWith(p));

  return (
    <>
      {!hideNavbar && <Navbar />}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/scan" element={<PageWrapper><Scanner /></PageWrapper>} />
          <Route path="/processing" element={<PageWrapper><Processing /></PageWrapper>} />
          <Route path="/results" element={<PageWrapper><Results /></PageWrapper>} />
          <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="/manufacturer" element={<PageWrapper><Manufacturer /></PageWrapper>} />
          {/* Fallback */}
          <Route path="*" element={<PageWrapper><Landing /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      <DemoModal />
    </>
  );
}
