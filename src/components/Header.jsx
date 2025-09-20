import { useLanguage } from '../hooks/useLanguage.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Globe, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function Header() {
  const { t, language, toggleLanguage } = useLanguage();
  const [profile, setProfile] = useLocalStorage('userProfile', null);
  const [recruiter, setRecruiter] = useLocalStorage('recruiterProfile', null);
  const [, setApplications] = useLocalStorage('applications', []);
  const [, setSavedJobs] = useLocalStorage('savedJobs', []);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [authState, setAuthState] = useState({ profile, recruiter });

  const userMenuRef = useRef(null);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? This will clear all your data.')) {
      setProfile(null);
      setRecruiter(null);
      setApplications([]);
      setSavedJobs([]);
      setShowUserMenu(false);
      window.location.hash = '#/';
      window.location.reload();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setAuthState({ profile, recruiter });
  }, [profile, recruiter]);

  useEffect(() => {
    const syncAuth = () => {
      setAuthState({
        profile: JSON.parse(localStorage.getItem("userProfile")),
        recruiter: JSON.parse(localStorage.getItem("recruiterProfile"))
      });
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="#/" className="text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-200">
              {t('app_name')}
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            {authState.profile && (
              <nav className="hidden md:flex items-center gap-4">
                <a href="#/dashboard" className="nav-link focus:outline-none">Dashboard</a>
                <a href="#/tracker" className="nav-link focus:outline-none">Tracker</a>
                <a href="#/profile" className="nav-link focus:outline-none">Profile</a>
              </nav>
            )}
            
            {authState.recruiter && (
              <nav className="hidden md:flex items-center gap-4">
                <a href="#/recruiter-dashboard" className="nav-link focus:outline-none">Dashboard</a>
                <span className="text-sm text-gray-500">{authState.recruiter?.company}</span>
              </nav>
            )}
            
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 focus:text-primary-600 rounded-lg hover:bg-neutral-100 transition-all duration-200"
              aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
            >
              <Globe size={16} />
              <span>{language === 'en' ? 'हिं' : 'EN'}</span>
            </button>

            {!authState.profile && !authState.recruiter && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600 font-medium">Job Seeker:</span>
                  <a href="#/job-seeker-login" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">Login</a>
                  <span className="text-neutral-300">|</span>
                  <a href="#/signup" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">Sign Up</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-600 font-medium">Recruiter:</span>
                  <a href="#/recruiter-login" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">Login</a>
                  <span className="text-neutral-300">|</span>
                  <a href="#/recruiter-signup" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">Sign Up</a>
                </div>
              </div>
            )}

            {(authState.profile || authState.recruiter) && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 focus:text-primary-600 rounded-xl hover:bg-neutral-100 transition-all duration-200 focus:outline-none"
                >
                  <User size={16} />
                  <span className="hidden sm:block">{authState.profile?.name || authState.recruiter?.name}</span>
                  <ChevronDown size={14} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 backdrop-blur-md">
                    <a
                      href={authState.profile ? "#/profile" : "#/recruiter-dashboard"}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-200 rounded-lg mx-2"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        {authState.profile ? "My Profile" : "Dashboard"}
                      </div>
                    </a>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-200 rounded-lg mx-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
