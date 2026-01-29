import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import BottomNav from './components/BottomNav';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth
import Auth from './pages/Auth';

// Patient Module
import PatientHome from './pages/PatientHome';
import GuardianTimer from './pages/GuardianTimer';
import FirstAidAcademy from './pages/FirstAidAcademy';
import FamilyRadar from './pages/FamilyRadar';
import MedicalVault from './pages/MedicalVault';
import Community from './pages/Community';

// Doctor Module
import DoctorHome from './pages/DoctorHome';
import DoctorScanner from './pages/DoctorScanner';
import PatientProfile from './pages/PatientProfile';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="flex-1 flex flex-col"
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key="auth-flow">
          <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </AnimatePresence>
    );
  }

  const role = user.role.toLowerCase();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {role === 'patient' ? (
          <>
            <Route path="/" element={<PageWrapper><PatientHome /></PageWrapper>} />
            <Route path="/timer" element={<PageWrapper><GuardianTimer /></PageWrapper>} />
            <Route path="/academy" element={<PageWrapper><FirstAidAcademy /></PageWrapper>} />
            <Route path="/radar" element={<PageWrapper><FamilyRadar /></PageWrapper>} />
            <Route path="/vault" element={<PageWrapper><MedicalVault /></PageWrapper>} />
            <Route path="/community" element={<PageWrapper><Community /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/doctor" element={<PageWrapper><DoctorHome /></PageWrapper>} />
            <Route path="/doctor/scan" element={<PageWrapper><DoctorScanner /></PageWrapper>} />
            <Route path="/doctor/profile" element={<PageWrapper><PatientProfile /></PageWrapper>} />
            <Route path="/doctor/analytics" element={<PageWrapper><AnalyticsDashboard /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/doctor" replace />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
}

function MainApp() {
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  return (
    <Router>
      <Layout>
        {user && (
          <div className="absolute top-4 right-4 z-[60]">
            <button
              onClick={logout}
              className="text-[9px] bg-red-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-red-500/20 hover:bg-red-500/20 transition-all text-red-500 font-black tracking-[0.2em] uppercase shadow-lg shadow-red-500/10 active:scale-95"
            >
              Sign Out
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <AnimatedRoutes />
          {user && <BottomNav role={user.role.toLowerCase() as 'patient' | 'doctor'} />}
        </div>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;