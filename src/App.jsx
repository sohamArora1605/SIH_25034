import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Tracker } from './pages/Tracker';
import { Profile } from './pages/Profile';
import { ResumeBuilderPage } from './pages/ResumeBuilder';
import { RecruiterLogin } from './pages/RecruiterLogin';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { LanguageProvider } from './hooks/useLanguage.jsx';
import { ApplicationProvider } from './hooks/useApplications.jsx';
import { useLocalStorage } from './hooks/useLocalStorage';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [profile] = useLocalStorage('userProfile', null);
  const [recruiter] = useLocalStorage('recruiterProfile', null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('/')) {
        const page = hash.slice(1) || 'home';
        setCurrentPage(page);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleGetStarted = () => {
    if (profile) {
      setCurrentPage('dashboard');
      window.location.hash = '#/dashboard';
    } else if (recruiter) {
      setCurrentPage('recruiter-dashboard');
      window.location.hash = '#/recruiter-dashboard';
    } else {
      setCurrentPage('auth');
      window.location.hash = '#/auth';
    }
  };

  const handleSignupComplete = () => {
    if (recruiter) {
      setCurrentPage('recruiter-dashboard');
      window.location.hash = '#/recruiter-dashboard';
    } else {
      setCurrentPage('dashboard');
      window.location.hash = '#/dashboard';
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
      case 'signup':
        return <Auth onComplete={handleSignupComplete} />;
      case 'dashboard':
        return recruiter ? <RecruiterDashboard /> : <Dashboard />;
      case 'tracker':
        return recruiter ? <RecruiterDashboard /> : <Tracker />;
      case 'profile':
        return recruiter ? <RecruiterDashboard /> : <Profile />;
      case 'resume-builder':
        return recruiter ? <RecruiterDashboard /> : <ResumeBuilderPage />;
      case 'recruiter-login':
        return <RecruiterLogin onLogin={() => setCurrentPage('recruiter-dashboard')} />;
      case 'recruiter-dashboard':
        return <RecruiterDashboard />;
      default:
        return <Home onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ApplicationProvider>
        <AppContent />
      </ApplicationProvider>
    </LanguageProvider>
  );
}

export default App;