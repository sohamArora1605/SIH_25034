import { useState } from 'react';
import { MapPin, Clock, IndianRupee, Share2, Bookmark, AlertTriangle, ChevronDown, Upload, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.jsx';
import { analyzeSkillGap } from '../utils/skillParser';

export function JobCard({ internship, onApply, onSave, onShare, candidateSkills = [], profile }) {
  const { t } = useLanguage();
  const [showManualApply, setShowManualApply] = useState(false);
  const [manualFormData, setManualFormData] = useState({
    name: profile?.name || '',
    location: profile?.district || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    resume: null
  });
  
  const skillGap = candidateSkills.length > 0 
    ? analyzeSkillGap(candidateSkills, internship.required_skills)
    : null;

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {internship.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{internship.organization}</p>
        </div>
        {internship.matchPercentage && (
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            {internship.matchPercentage}% match
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <IndianRupee size={14} />
          <span>₹{internship.stipend.toLocaleString()}/{t('duration')}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={14} />
          <span>{internship.location.district}, {internship.location.state}</span>
          {internship.distance && <span>• {internship.distance}km</span>}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={14} />
          <span>{internship.duration_weeks} weeks • {internship.remote_flag ? t('remote') : t('on_site')}</span>
        </div>
      </div>

      {internship.reasons && internship.reasons.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-1">{t('why_recommended')}:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            {internship.reasons.map((reason, index) => (
              <li key={index}>• {reason}</li>
            ))}
          </ul>
        </div>
      )}

      {skillGap && skillGap.missingSkills.length > 0 && (
        <div className="mb-4 p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-orange-600" />
            <p className="text-sm font-medium text-orange-900">Skills to develop:</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {skillGap.missingSkills.slice(0, 3).map(skill => (
              <span key={skill} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                {skill}
              </span>
            ))}
            {skillGap.missingSkills.length > 3 && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                +{skillGap.missingSkills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => onApply(internship)}
            className="btn-primary flex-1"
          >
            Auto Apply
          </button>
          
          <button
            onClick={() => setShowManualApply(!showManualApply)}
            className="btn-secondary flex items-center gap-1 px-4"
          >
            Manual Apply
            <ChevronDown size={14} className={`transition-transform ${showManualApply ? 'rotate-180' : ''}`} />
          </button>
          
          <button
            onClick={() => onSave(internship)}
            className="btn-secondary p-3"
            aria-label={t('save')}
          >
            <Bookmark size={16} />
          </button>
          
          <button
            onClick={() => onShare(internship)}
            className="btn-secondary p-3"
            aria-label={t('share')}
          >
            <Share2 size={16} />
          </button>
        </div>
        
        {showManualApply && (
          <div className="border-t border-neutral-200 pt-6 mt-4 space-y-4 bg-gradient-to-r from-neutral-50 to-neutral-100 -mx-6 px-6 pb-6 rounded-b-2xl">
            <h4 className="font-semibold text-neutral-900 text-lg">Manual Application</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={manualFormData.name}
                  onChange={(e) => setManualFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white hover:border-neutral-400"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={manualFormData.location}
                  onChange={(e) => setManualFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white hover:border-neutral-400"
                  placeholder="Your location"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={manualFormData.phone}
                  onChange={(e) => setManualFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white hover:border-neutral-400"
                  placeholder="+91-9876543210"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={manualFormData.email}
                  onChange={(e) => setManualFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white hover:border-neutral-400"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Upload Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setManualFormData(prev => ({ ...prev, resume: e.target.files[0] }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white hover:border-neutral-400"
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  onApply(internship, manualFormData);
                  setShowManualApply(false);
                }}
                className="btn-primary flex-1"
              >
                Submit Application
              </button>
              <button
                onClick={() => setShowManualApply(false)}
                className="btn-secondary px-6"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}