import { useState, useEffect } from 'react';
import { JobCard } from '../components/JobCard';
import { useLanguage } from '../hooks/useLanguage.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApplications } from '../hooks/useApplications.jsx';
import { getRecommendations } from '../utils/recommendations';
import internshipsData from '../data/internships.json';

export function Dashboard() {
  const { t } = useLanguage();
  const [profile] = useLocalStorage('userProfile', null);
  const [postedJobs] = useLocalStorage('postedJobs', []);
  const { applications, savedJobs, addApplication, saveJob } = useApplications();
  const [recommendations, setRecommendations] = useState([]);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);
  const [showSavedJobs, setShowSavedJobs] = useState(false);

  useEffect(() => {
    if (profile) {
      // Combine static internships with recruiter-posted jobs
      const allJobs = [...internshipsData, ...postedJobs];
      const recs = getRecommendations(profile, allJobs);
      setRecommendations(recs);
    }
  }, [profile, postedJobs]);

  const handleApply = (internship) => {
    addApplication(internship, profile);
  };

  const handleSave = (internship) => {
    saveJob(internship);
  };

  const handleShare = (internship) => {
    const message = `Check out this internship: ${internship.title} at ${internship.organization}. Stipend: ₹${internship.stipend}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Please create your profile first</h2>
          <a href="#/signup" className="btn-primary">Sign Up</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {profile.name}!
          </h1>
          <p className="text-gray-600">
            Here are your personalized internship recommendations
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('recommendations')} ({recommendations.length})
          </h2>
          
          {recommendations.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-600 mb-4">No recommendations found matching your profile.</p>
              <p className="text-sm text-gray-500">Try updating your skills or location preferences.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(showAllRecommendations ? recommendations : recommendations.slice(0, 3)).map(internship => (
                <JobCard
                  key={internship.intern_id}
                  internship={internship}
                  candidateSkills={profile.skills}
                  profile={profile}
                  onApply={handleApply}
                  onSave={handleSave}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}
        </div>

        {recommendations.length > 3 && (
          <div className="text-center">
            <button 
              onClick={() => setShowAllRecommendations(!showAllRecommendations)}
              className="btn-secondary"
            >
              {showAllRecommendations ? 'Show Less' : `View All Recommendations (${recommendations.length})`}
            </button>
          </div>
        )}
        
        {showAllRecommendations && recommendations.length > 3 && (
          <div className="space-y-4 mt-6">
            {recommendations.slice(3).map(internship => (
              <JobCard
                key={internship.intern_id}
                internship={internship}
                candidateSkills={profile.skills}
                profile={profile}
                onApply={handleApply}
                onSave={handleSave}
                onShare={handleShare}
              />
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <a href="#/tracker" className="card text-center hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {applications.length}
            </div>
            <div className="text-sm text-gray-600">Applications</div>
            <div className="text-xs text-primary-600 mt-1">View Tracker →</div>
          </a>
          <div className="card text-center cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowSavedJobs(!showSavedJobs)}>
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {savedJobs.length}
            </div>
            <div className="text-sm text-gray-600">Saved Jobs</div>
            <div className="text-xs text-primary-600 mt-1">Click to view →</div>
          </div>
        </div>
        
        {/* Saved Jobs Section */}
        {showSavedJobs && savedJobs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Saved Jobs ({savedJobs.length})
            </h2>
            <div className="space-y-4">
              {savedJobs.map(internship => (
                <JobCard
                  key={internship.intern_id}
                  internship={internship}
                  candidateSkills={profile.skills}
                  profile={profile}
                  onApply={handleApply}
                  onSave={handleSave}
                  onShare={handleShare}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}