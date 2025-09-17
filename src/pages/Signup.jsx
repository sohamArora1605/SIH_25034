import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ChevronRight, ChevronLeft, Check, User, Phone, Lock, MapPin, GraduationCap, Award, Briefcase } from 'lucide-react';

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
  const [existingUsers] = useLocalStorage('allUsers', []);
  const [, setAllUsers] = useLocalStorage('allUsers', []);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    district: '',
    education_level: '',
    stream: '',
    skills: [],
    preferred_sectors: [],
    gender: '',
    first_gen_flag: false,
    internet_access_level: 'medium'
  });

  const steps = [
    { id: 1, title: 'Personal Info', icon: User, fields: ['name', 'phone', 'password'] },
    { id: 2, title: 'Location & Education', icon: MapPin, fields: ['district', 'education_level'] },
    { id: 3, title: 'Skills', icon: Award, fields: ['skills'] },
    { id: 4, title: 'Preferences', icon: Briefcase, fields: ['preferred_sectors'] }
  ];

  const hashPassword = (password) => {
    return btoa(password + 'salt123');
  };

  const isStepValid = (stepId) => {
    const step = steps.find(s => s.id === stepId);
    return step.fields.every(field => {
      if (field === 'skills') return formData.skills.length > 0;
      return formData[field] && formData[field].toString().trim() !== '';
    });
  };

  const nextStep = () => {
    if (isStepValid(currentStep)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (existingUsers.find(u => u.phone === formData.phone)) {
      alert('Phone number already registered. Please login.');
      return;
    }

    const profile = {
      ...formData,
      password: hashPassword(formData.password),
      candidate_id: `CAND${Date.now()}`,
      college_type: 'rural',
      language_pref: 'Hindi',
      preferred_locations: [formData.district],
      created_at: new Date().toISOString()
    };
    
    const updatedUsers = [...existingUsers, profile];
    setAllUsers(updatedUsers);
    
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <User className="text-primary-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Personal Information</h2>
              <p className="text-neutral-600">Let's start with your basic details</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('name')} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('phone')} *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="input-field"
                placeholder="+91-9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="input-field"
                placeholder="Create a secure password"
                minLength={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Upload Resume (Optional)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFormData(prev => ({ ...prev, resume: e.target.files[0] }))}
                className="input-field"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <MapPin className="text-accent-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Location & Education</h2>
              <p className="text-neutral-600">Help us understand your background</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('district')} *
              </label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                className="input-field"
                placeholder="Enter your district"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                {t('education')} *
              </label>
              <select
                required
                value={formData.education_level}
                onChange={(e) => setFormData(prev => ({ ...prev, education_level: e.target.value }))}
                className="input-field"
              >
                <option value="">Select education level</option>
                {EDUCATION_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <Award className="text-secondary-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your Skills</h2>
              <p className="text-neutral-600">Select skills that match your abilities</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SKILL_OPTIONS.map(skill => (
                <label key={skill} className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 hover:border-primary-300 transition-all duration-200 group">
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium group-hover:text-primary-600 transition-colors duration-200">{skill}</span>
                </label>
              ))}
            </div>
            
            {formData.skills.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-xl border border-neutral-200">
                <p className="text-sm font-semibold text-neutral-700 mb-3">Selected Skills ({formData.skills.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <span key={skill} className="skill-tag text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-200 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <Briefcase className="text-primary-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Preferences</h2>
              <p className="text-neutral-600">Tell us about your interests</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Preferred Sectors
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SECTORS.map(sector => (
                  <label key={sector} className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 hover:border-secondary-300 transition-all duration-200 group">
                    <input
                      type="checkbox"
                      checked={formData.preferred_sectors.includes(sector)}
                      onChange={() => handleSectorToggle(sector)}
                      className="rounded border-neutral-300 text-secondary-600 focus:ring-secondary-500"
                    />
                    <span className="text-sm font-medium group-hover:text-secondary-600 transition-colors duration-200">{sector}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="input-field"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-all duration-200">
                <input
                  type="checkbox"
                  checked={formData.first_gen_flag}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_gen_flag: e.target.checked }))}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium">I am a first-generation learner</span>
              </label>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-primary-600 text-white' :
                    isCurrent ? 'bg-primary-100 text-primary-600 ring-4 ring-primary-200' :
                    'bg-neutral-200 text-neutral-500'
                  }`}>
                    {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      isCompleted ? 'bg-primary-600' : 'bg-neutral-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <p className="text-sm text-neutral-600">Step {currentStep} of {steps.length}</p>
          </div>
        </div>

        <div className="card animate-fade-in">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            <div className="flex justify-between mt-8 pt-6 border-t border-neutral-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  currentStep === 1 
                    ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                    : 'btn-tertiary hover:bg-neutral-200'
                }`}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isStepValid(currentStep) 
                      ? 'btn-primary' 
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isStepValid(currentStep)}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isStepValid(currentStep) 
                      ? 'btn-primary' 
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  Create Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}