import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AIAssistant from './pages/AIAssistant';
import Layout from './components/Layout';
import BottomNav from './components/BottomNav';
import { AuthProvider, useAuth } from './context/AuthContext';

import Auth from './pages/Auth';

// Patient Module
import PatientHome from './pages/PatientHome';
import GuardianTimer from './pages/GuardianTimer';
import FirstAidAcademy from './pages/FirstAidAcademy';
import FamilyRadar from './pages/FamilyRadar';
import MedicalVault from './pages/MedicalVault';
import Community from './pages/Community';
import LifeKeyPage from './pages/LifeKeyPage';

// Doctor Module
import DoctorHome from './pages/DoctorHome';
import DoctorScanner from './pages/DoctorScanner';
import PatientProfile from './pages/PatientProfile';
import PatientManagement from './pages/DoctorDashboard/PatientManagement';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import DoctorCommunity from './pages/DoctorCommunity';

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
        {/* Common routes for logged-in users */}
        <Route path="/ai" element={<PageWrapper><AIAssistant /></PageWrapper>} />

        {role === 'patient' ? (
          <>
            <Route path="/" element={<PageWrapper><PatientHome /></PageWrapper>} />
            <Route path="/timer" element={<PageWrapper><GuardianTimer /></PageWrapper>} />
            <Route path="/academy" element={<PageWrapper><FirstAidAcademy /></PageWrapper>} />
            <Route path="/radar" element={<PageWrapper><FamilyRadar /></PageWrapper>} />
            <Route path="/vault" element={<PageWrapper><MedicalVault /></PageWrapper>} />
            <Route path="/community" element={<PageWrapper><Community /></PageWrapper>} />
            <Route path="/lifekey" element={<PageWrapper><LifeKeyPage /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/doctor" element={<PageWrapper><DoctorHome /></PageWrapper>} />
            <Route path="/doctor/scan" element={<PageWrapper><DoctorScanner /></PageWrapper>} />
            <Route path="/doctor/patients" element={<PageWrapper><PatientManagement /></PageWrapper>} />
            <Route path="/doctor/profile/:userId" element={<PageWrapper><PatientProfile /></PageWrapper>} />
            <Route path="/doctor/analytics" element={<PageWrapper><AnalyticsDashboard /></PageWrapper>} />
            <Route path="/doctor/community" element={<PageWrapper><DoctorCommunity /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/doctor" replace />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
}

import { SocketProvider } from './context/SocketContext';

import { ThemeProvider } from './context/ThemeContext';
import { EmergencyProvider } from './context/EmergencyContext';
import EmergencyOverlay from './components/EmergencyOverlay';
import ThemeSwitcher from './components/ThemeSwitcher';

function MainApp() {
  const { user, token, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#020617] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-cyan-500 font-black uppercase tracking-widest text-xs">Loading Identity...</p>
        </div>
      </div>
    );
  }

  return (
    <SocketProvider token={token}>
      <EmergencyProvider>
        <Router>
          <Layout>
            {user && (
              <div className="absolute top-4 right-4 z-[40] flex items-center gap-3">
                <ThemeSwitcher />
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
          <EmergencyOverlay />
        </Router>
      </EmergencyProvider>
    </SocketProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </AuthProvider>
  );
}


export default App;
