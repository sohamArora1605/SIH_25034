import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Building2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const DEMO_RECRUITERS = [
  {
    id: 'REC001',
    email: 'hr@techcorp.com',
    password: 'recruiter123',
    company: 'TechCorp Solutions',
    name: 'Priya Gupta',
    role: 'HR Manager'
  },
  {
    id: 'REC002', 
    email: 'hiring@startupinc.com',
    password: 'recruiter123',
    company: 'StartupInc',
    name: 'Rahul Sharma',
    role: 'Talent Acquisition'
  }
];

export function RecruiterLogin({ onLogin }) {
  const [, setRecruiter] = useLocalStorage('recruiterProfile', null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const recruiter = DEMO_RECRUITERS.find(
      r => r.email === formData.email && r.password === formData.password
    );

    if (recruiter) {
      setRecruiter(recruiter);
      onLogin();
    } else {
      setError('Invalid email or password');
    }
  };

  const handleDemoLogin = (recruiter) => {
    setRecruiter(recruiter);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Recruiter Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your recruitment dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-primary"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Demo Accounts</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {DEMO_RECRUITERS.map(recruiter => (
              <button
                key={recruiter.id}
                onClick={() => handleDemoLogin(recruiter)}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{recruiter.company}</div>
                <div className="text-sm text-gray-600">{recruiter.email}</div>
                <div className="text-xs text-gray-500">{recruiter.name} - {recruiter.role}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <a href="#/" className="text-sm text-primary-600 hover:text-primary-700">
            ← Back to Candidate Portal
          </a>
        </div>
      </div>
    </div>
  );
}