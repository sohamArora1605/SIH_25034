import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Briefcase } from 'lucide-react';

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+'];
const INDUSTRIES = ['Technology', 'Healthcare', 'Education', 'Manufacturing', 'Finance', 'Retail', 'Agriculture', 'Government'];

export function RecruiterSignup() {
  const [, setRecruiter] = useLocalStorage('recruiterProfile', null);
  const [existingRecruiters] = useLocalStorage('allRecruiters', []);
  const [, setAllRecruiters] = useLocalStorage('allRecruiters', []);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    designation: '',
    phone: '',
    company_size: '',
    industry: '',
    location: ''
  });

  const hashPassword = (password) => {
    return btoa(password + 'salt123');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if email already exists
    if (existingRecruiters.find(r => r.email === formData.email)) {
      alert('Email already registered. Please login.');
      return;
    }

    const recruiter = {
      ...formData,
      password: hashPassword(formData.password),
      recruiter_id: `REC${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    // Add to recruiters database
    const updatedRecruiters = [...existingRecruiters, recruiter];
    setAllRecruiters(updatedRecruiters);
    
    setRecruiter(recruiter);
    window.location.hash = '#/recruiter-dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-6">
            <Briefcase className="mx-auto h-12 w-12 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900 mt-4">
              Recruiter Sign Up
            </h1>
            <p className="text-gray-600 mt-2">
              Create your account to post jobs and find candidates
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Create a password"
                minLength={6}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="ABC Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation *
                </label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="HR Manager"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="+91-9876543210"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size *
                </label>
                <select
                  required
                  value={formData.company_size}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_size: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select company size</option>
                  {COMPANY_SIZES.map(size => (
                    <option key={size} value={size}>{size} employees</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry *
                </label>
                <select
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="City, State"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={!formData.name || !formData.email || !formData.password || !formData.company || !formData.designation || !formData.phone || !formData.company_size || !formData.industry || !formData.location}
            >
              Create Account
            </button>
          </form>

          <div className="text-center mt-6">
            <a
              href="#/recruiter-login"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Already have an account? Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}