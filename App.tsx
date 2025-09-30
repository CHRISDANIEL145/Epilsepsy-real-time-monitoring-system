
import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import PatientDashboard from './components/PatientDashboard';
import { UserRole } from './types';
import type { User } from './types';

// Import lucide-react. In a real app, this would be in package.json.
// For this environment, we rely on a global import if available, or just render empty.
// In a proper setup, you'd use: import { Wifi, LogOut, ... } from 'lucide-react';
const LucideIcons = React.createElement('script', { src: 'https://unpkg.com/lucide@latest' });
const Recharts = React.createElement('script', {src: 'https://unpkg.com/recharts/umd/Recharts.min.js'});


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case UserRole.Patient:
        return <PatientDashboard user={currentUser} onLogout={handleLogout} />;
      // In a full app, other roles would be handled here
      // case UserRole.Doctor:
      //   return <DoctorDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        return (
          <div className="text-center p-8">
            <h1 className="text-2xl">Dashboard for {currentUser.role} not implemented yet.</h1>
            <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-500 rounded">Logout</button>
          </div>
        );
    }
  };

  return (
    <>
        {/* These would be managed by a bundler like Vite/Webpack */}
        {LucideIcons}
        {Recharts}
        
        {currentUser ? renderDashboard() : <LoginPage onLogin={handleLogin} />}
    </>
  );
};

export default App;
