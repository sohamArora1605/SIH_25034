import { useLanguage } from '../hooks/useLanguage.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Globe, LogOut, User, ChevronDown, Users } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { UserSwitcher } from './UserSwitcher';

export function Header() {
  const { t, language, toggleLanguage } = useLanguage();
  const [profile, setProfile] = useLocalStorage('userProfile', null);
  const [recruiter, setRecruiter] = useLocalStorage('recruiterProfile', null);
  const [, setApplications] = useLocalStorage('applications', []);
  const [, setSavedJobs] = useLocalStorage('savedJobs', []);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? This will clear all your data.')) {
      setProfile(null);
      setRecruiter(null);
      setApplications([]);
      setSavedJobs([]);
      setShowUserMenu(false);
      window.location.hash = '#/';
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

  return (
    <>
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="#/" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {t('app_name')}
            </a>
          </div>
          
          <div className="flex items-center gap-4">
            {profile && !recruiter && (
              <nav className="hidden md:flex items-center gap-4">
                <a href="#/dashboard" className="text-sm font-medium text-gray-700 hover:text-primary-600">Dashboard</a>
                <a href="#/tracker" className="text-sm font-medium text-gray-700 hover:text-primary-600">Tracker</a>
                <a href="#/profile" className="text-sm font-medium text-gray-700 hover:text-primary-600">Profile</a>
                <a href="#/resume-builder" className="text-sm font-medium text-gray-700 hover:text-primary-600">Resume</a>
              </nav>
            )}
            
            {recruiter && (
              <nav className="hidden md:flex items-center gap-4">
                <a href="#/recruiter-dashboard" className="text-sm font-medium text-gray-700 hover:text-primary-600">Dashboard</a>
                <span className="text-sm text-gray-500">{recruiter.company}</span>
              </nav>
            )}
            
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 focus:text-primary-600"
              aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
            >
              <Globe size={16} />
              <span>{language === 'en' ? 'हिं' : 'EN'}</span>
            </button>

            {!profile && !recruiter && (
              <a
                href="#/auth"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                <User size={16} />
                <span>Login / Sign Up</span>
              </a>
            )}

            {profile && !recruiter && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 focus:text-primary-600 rounded-lg hover:bg-gray-50"
                >
                  <User size={16} />
                  <span className="hidden sm:block">{profile.name}</span>
                  <ChevronDown size={14} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <a
                      href="#/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        My Profile
                      </div>
                    </a>
                    <button
                      onClick={() => {
                        setShowUserSwitcher(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Users size={16} />
                      Switch User (Demo)
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {recruiter && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 focus:text-primary-600 rounded-lg hover:bg-gray-50"
                >
                  <User size={16} />
                  <span className="hidden sm:block">{recruiter.name}</span>
                  <ChevronDown size={14} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <a
                      href="#/recruiter-dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        Dashboard
                      </div>
                    </a>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
    
    {showUserSwitcher && (
      <UserSwitcher onClose={() => setShowUserSwitcher(false)} />
    )}
    </>
  );
}