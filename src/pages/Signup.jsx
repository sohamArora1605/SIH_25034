import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { EnhancedResumeUpload } from '../components/EnhancedResumeUpload';

const EDUCATION_LEVELS = ['10th', '12th', 'Graduation', 'Post-Graduation'];
const SKILL_OPTIONS = [
  'Communication', 'Computer Basics', 'Excel', 'Hindi', 'English', 
  'Teaching', 'Social Media', 'WhatsApp Business', 'MS Office', 
  'Hindi Typing', 'Customer Service', 'Data Entry'
];
const SECTORS = ['Education', 'Healthcare', 'Administration', 'Marketing', 'Technology', 'Agriculture'];

export function Signup({ onComplete }) {
  const { t } = useLanguage();
  const [, setProfile] = useLocalStorage('userProfile', null);
  const [skillInputMethod, setSkillInputMethod] = useState('manual'); // 'manual' or 'resume'
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: '',
    education_level: '',
    stream: '',
    skills: [],
    preferred_sectors: [],
    gender: '',
    first_gen_flag: false,
    internet_access_level: 'medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const profile = {
      ...formData,
      candidate_id: `CAND${Date.now()}`,
      college_type: 'rural',
      language_pref: 'Hindi',
      preferred_locations: [formData.district]
    };
    
    setProfile(profile);
    onComplete();
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSectorToggle = (sector) => {
    setFormData(prev => ({
      ...prev,
      preferred_sectors: prev.preferred_sectors.includes(sector)
        ? prev.preferred_sectors.filter(s => s !== sector)
        : [...prev.preferred_sectors, sector]
    }));
  };

  const handleResumeData = (resumeData) => {
    const updatedFormData = { ...formData };
    
    // Merge skills only
    if (resumeData.skills) {
      updatedFormData.skills = [...new Set([...updatedFormData.skills, ...resumeData.skills])];
    }
    
    setFormData(updatedFormData);
    setSkillInputMethod('manual'); // Switch back to manual view
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('sign_up')}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('name')} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('phone')} *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('district')} *
              </label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('education')} *
              </label>
              <select
                required
                value={formData.education_level}
                onChange={(e) => setFormData(prev => ({ ...prev, education_level: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select education level</option>
                {EDUCATION_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('skills')} *
              </label>
              
              {/* Skill Input Method Selection */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSkillInputMethod('manual')}
                  className={`px-4 py-2 text-sm rounded-lg ${
                    skillInputMethod === 'manual' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Select Manually
                </button>
                <button
                  type="button"
                  onClick={() => setSkillInputMethod('resume')}
                  className={`px-4 py-2 text-sm rounded-lg ${
                    skillInputMethod === 'resume' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Upload Resume
                </button>
              </div>

              {skillInputMethod === 'manual' ? (
                <div className="grid grid-cols-2 gap-2">
                  {SKILL_OPTIONS.map(skill => (
                    <label key={skill} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.skills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm">{skill}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <EnhancedResumeUpload 
                  onResumeProcessed={handleResumeData}
                  existingProfile={formData}
                />
              )}
              
              {/* Show selected skills */}
              {formData.skills.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected Skills ({formData.skills.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Sectors
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SECTORS.map(sector => (
                  <label key={sector} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.preferred_sectors.includes(sector)}
                      onChange={() => handleSectorToggle(sector)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">{sector}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.first_gen_flag}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_gen_flag: e.target.checked }))}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">I am a first-generation learner</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={!formData.name || !formData.phone || !formData.district || !formData.education_level || formData.skills.length === 0}
            >
              Create Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}