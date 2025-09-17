import { MapPin, Clock, IndianRupee, Share2, Bookmark, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.jsx';
import { analyzeSkillGap } from '../utils/skillParser';

export function JobCard({ internship, onApply, onSave, onShare, candidateSkills = [] }) {
  const { t } = useLanguage();
  
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

      <div className="flex gap-2">
        <button
          onClick={() => onApply(internship)}
          className="btn-primary flex-1"
        >
          {t('apply_now')}
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
    </div>
  );
}