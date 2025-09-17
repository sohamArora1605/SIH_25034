import { useState } from 'react';
import { Search, Target, FileText, BarChart3 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function Home({ onGetStarted }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [profile] = useLocalStorage('userProfile', null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (profile) {
      onGetStarted();
    } else {
      // Redirect to signup
      window.location.hash = '#/signup';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Rural India ke liye Smart Internship Platform
          </h1>
          <p className="text-xl mb-8 text-primary-100">
            Apni skills match karo, ek click mein apply karo
          </p>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 bg-white text-primary-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 focus:bg-gray-100 transition-colors"
            >
              {t('get_matched')}
            </button>
          </form>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="text-primary-600" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t('recommendations')}</h3>
            <p className="text-gray-600 text-sm">Smart matching based on your skills and location</p>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="text-accent-600" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t('apply')}</h3>
            <p className="text-gray-600 text-sm">One-click apply with auto-filled forms</p>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-secondary-600" size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t('tracker')}</h3>
            <p className="text-gray-600 text-sm">Track all applications in one place</p>
          </div>
        </div>

        {/* How it helps */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('how_it_helps')}</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-start gap-4 text-left">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <p className="text-gray-700">{t('help_1')}</p>
            </div>
            <div className="flex items-start gap-4 text-left">
              <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p className="text-gray-700">{t('help_2')}</p>
            </div>
            <div className="flex items-start gap-4 text-left">
              <div className="w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p className="text-gray-700">{t('help_3')}</p>
            </div>
          </div>
        </div>

        {!profile && (
          <div className="text-center mt-12 space-y-4">
            <a
              href="#/signup"
              className="btn-primary inline-flex"
            >
              {t('sign_up')}
            </a>
            <div>
              <a
                href="#/recruiter-login"
                className="text-primary-600 hover:text-primary-700 underline text-sm"
              >
                Recruiter Portal →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}