import { useState } from 'react';
import { Edit2, User, MapPin, GraduationCap, Briefcase, Award, Plus, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApplications } from '../hooks/useApplications.jsx';
import { analyzeSkillGap, suggestRelatedSkills } from '../utils/skillParser';
import internshipsData from '../data/internships.json';

export function Profile() {
  const { t } = useLanguage();
  const [profile, setProfile] = useLocalStorage('userProfile', null);
  const { applications } = useApplications();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile || {});
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

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

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const addSkill = (skill) => {
    setEditForm(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
  };

  const removeSkill = (skill) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Analyze skill gaps across all internships
  const skillGapAnalysis = () => {
    const allRequiredSkills = new Set();
    internshipsData.forEach(internship => {
      internship.required_skills.forEach(skill => allRequiredSkills.add(skill));
    });

    const analysis = analyzeSkillGap(profile.skills, Array.from(allRequiredSkills));
    return analysis;
  };

  const gapAnalysis = skillGapAnalysis();
  const suggestedSkills = suggestRelatedSkills(profile.skills);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your profile and skills</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit2 size={16} />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <User className="text-primary-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <input
                      type="text"
                      value={editForm.district || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, district: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button onClick={handleSave} className="btn-primary">Save Changes</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Name:</span>
                    <span>{profile.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Phone:</span>
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span>{profile.district}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap size={16} className="text-gray-500" />
                    <span>{profile.education_level}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Award className="text-primary-600" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                </div>
                <button
                  onClick={() => setShowSkillSuggestions(!showSkillSuggestions)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  {showSkillSuggestions ? 'Hide' : 'Show'} Suggestions
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {(isEditing ? editForm.skills : profile.skills)?.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-primary-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {showSkillSuggestions && suggestedSkills.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Suggested Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => isEditing && addSkill(skill)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                          isEditing 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer' 
                            : 'bg-gray-100 text-gray-600 cursor-default'
                        }`}
                        disabled={!isEditing}
                      >
                        <Plus size={14} />
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Skill Gap Analysis */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="text-primary-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Skill Gap Analysis</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Market Skill Match</span>
                    <span className="text-sm font-bold text-primary-600">{gapAnalysis.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${gapAnalysis.matchPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {gapAnalysis.missingSkills.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Skills in High Demand:</h3>
                    <div className="flex flex-wrap gap-2">
                      {gapAnalysis.missingSkills.slice(0, 8).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Consider learning these skills to improve your job match rate
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Application Stats */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Application Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Applied</span>
                  <span className="font-semibold">{applications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Review</span>
                  <span className="font-semibold">
                    {applications.filter(app => app.status === 'In Review').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shortlisted</span>
                  <span className="font-semibold text-green-600">
                    {applications.filter(app => app.status === 'Shortlisted').length}
                  </span>
                </div>
              </div>
              <a href="#/tracker" className="btn-secondary w-full mt-4">
                View All Applications
              </a>
              <a href="#/resume-builder" className="btn-primary w-full mt-2">
                Build Resume
              </a>
            </div>

            {/* Profile Completeness */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Profile Completeness</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Basic Info</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skills ({profile.skills?.length || 0})</span>
                  <span className={profile.skills?.length >= 3 ? "text-green-600" : "text-orange-600"}>
                    {profile.skills?.length >= 3 ? "✓" : "!"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Preferences</span>
                  <span className={profile.preferred_sectors?.length > 0 ? "text-green-600" : "text-orange-600"}>
                    {profile.preferred_sectors?.length > 0 ? "✓" : "!"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}