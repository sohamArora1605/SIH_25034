import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { JobSeekerLogin } from './pages/JobSeekerLogin';
import { RecruiterLogin } from './pages/RecruiterLogin';
import { Signup } from './pages/Signup';
import { RecruiterSignup } from './pages/RecruiterSignup';
import { Dashboard } from './pages/Dashboard';
import { Tracker } from './pages/Tracker';
import { Profile } from './pages/Profile';
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

  useEffect(() => {
    // Redirect logged-in users away from auth pages
    if (profile && (currentPage === 'home')) {
      setCurrentPage('dashboard');
      window.location.hash = '#/dashboard';
    }
    if (recruiter && (currentPage === 'home')) {
      setCurrentPage('recruiter-dashboard');
      window.location.hash = '#/recruiter-dashboard';
    }
  }, [profile, recruiter, currentPage]);

  const handleSignupComplete = () => {
    setCurrentPage('dashboard');
    window.location.hash = '#/dashboard';
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'job-seeker-login':
        return <JobSeekerLogin />;
      case 'recruiter-login':
        return <RecruiterLogin />;
      case 'signup':
        return <Signup onComplete={handleSignupComplete} />;
      case 'recruiter-signup':
        return <RecruiterSignup />;
      case 'dashboard':
        return <Dashboard />;
      case 'tracker':
        return <Tracker />;
      case 'profile':
        return <Profile />;
      case 'recruiter-dashboard':
        return <RecruiterDashboard />;
      default:
        return <Home />;
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