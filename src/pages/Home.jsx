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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 via-white to-secondary-500 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-shadow-lg">
            <span className="text-white drop-shadow-lg">Rural India ke liye</span><br/>
            <span className="text-neutral-900 drop-shadow-lg">Smart Internship Platform</span>
          </h1>
          <p className="text-xl mb-10 text-neutral-800 font-semibold drop-shadow-md">
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
                className="w-full pl-10 pr-4 py-4 rounded-xl text-neutral-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 shadow-lg backdrop-blur-sm bg-white/95 border-0"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-white text-primary-600 py-4 px-6 rounded-xl font-bold hover:bg-neutral-100 focus:bg-neutral-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {t('get_matched')}
            </button>
          </form>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="card-interactive text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <Target className="text-primary-600" size={28} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-neutral-800">{t('recommendations')}</h3>
            <p className="text-neutral-600 text-base leading-relaxed">Smart matching based on your skills and location</p>
          </div>
          
          <div className="card-interactive text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <FileText className="text-accent-600" size={28} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-neutral-800">{t('apply')}</h3>
            <p className="text-neutral-600 text-base leading-relaxed">One-click apply with auto-filled forms</p>
          </div>
          
          <div className="card-interactive text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <BarChart3 className="text-secondary-600" size={28} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-neutral-800">{t('tracker')}</h3>
            <p className="text-neutral-600 text-base leading-relaxed">Track all applications in one place</p>
          </div>
        </div>

        {/* How it helps */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-12">{t('how_it_helps')}</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-start gap-4 text-left">
              <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <p className="text-neutral-700 text-lg">{t('help_1')}</p>
            </div>
            <div className="flex items-start gap-4 text-left">
              <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p className="text-neutral-700 text-lg">{t('help_2')}</p>
            </div>
            <div className="flex items-start gap-4 text-left">
              <div className="w-6 h-6 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p className="text-neutral-700 text-lg">{t('help_3')}</p>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}