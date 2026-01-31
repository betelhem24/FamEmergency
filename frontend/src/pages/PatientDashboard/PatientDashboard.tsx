import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import BottomNav from '../../components/layout/BottomNav';
import ProfilTab from '../../components/dashboard/ProfileTab';
import EmergencyTab from '../../components/dashboard/EmergencyTab';
import FirstAidTab from '../../components/dashboard/FirstAidTab';
import MapTab from '../../components/dashboard/MapTab';
import FamilyTab from '../../components/dashboard/FamilyTab';
import AnalyticsTab from '../../components/dashboard/AnalyticsTab';
import ResponderTab from '../../components/dashboard/ResponderTab';
import GuardianTimer from '../../components/dashboard/emergency/GuardianTimer';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';

const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('emergency');
  const { user } = useAuth();

  // HEALT_SYNC: Broadcast vital signs to doctors in real-time
  useEffect(() => {
    const socket = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') }
    });

    const broadcastHealth = () => {
      socket.emit('health:update', {
        status: 'nominal',
        heartRate: 70 + Math.floor(Math.random() * 10), // Simulated real-world data
        userName: user?.name
      });
    };

    const interval = setInterval(broadcastHealth, 5000);
    broadcastHealth();

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [user]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'emergency': return <EmergencyTab />;
      case 'guardian': return <div className="py-12 animate-in slide-in-from-bottom duration-700"><GuardianTimer /></div>;
      case 'firstaid': return <FirstAidTab />;
      case 'map': return <MapTab />;
      case 'family': return <FamilyTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'responder': return <ResponderTab />;
      default: return <EmergencyTab />;
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 bg-slate-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <main className="transition-all duration-300">
          {renderContent()}
        </main>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default PatientDashboard;