import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User, Mail, Phone, MapPin, Eye, EyeOff } from 'lucide-react';

export function Auth({ onComplete }) {
  const [, setProfile] = useLocalStorage('userProfile', null);
  const [, setRecruiter] = useLocalStorage('recruiterProfile', null);
  const [existingUsers] = useLocalStorage('allUsers', []);
  const [, setAllUsers] = useLocalStorage('allUsers', []);
  const [existingRecruiters] = useLocalStorage('allRecruiters', []);
  const [, setAllRecruiters] = useLocalStorage('allRecruiters', []);
  const [userType, setUserType] = useState('candidate'); // 'candidate' or 'recruiter'
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    name: '',
    district: '',
    email: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (userType === 'recruiter') {
      const recruiter = existingRecruiters.find(r => r.email === formData.phone && r.password === formData.password);
      if (!recruiter) {
        setError('Email not found or incorrect password. Please check your credentials.');
        return;
      }
      
      setProfile(null); // Clear candidate profile
      setRecruiter(recruiter);
      console.log('Recruiter logged in:', recruiter);
      window.location.hash = '#/recruiter-dashboard';
      return;
    }

    // Candidate login
    const user = existingUsers.find(u => u.phone === formData.phone);
    
    if (!user) {
      setError('Phone number not found. Please sign up first.');
      return;
    }

    if (user.password !== formData.password) {
      setError('Incorrect password');
      return;
    }

    setRecruiter(null); // Clear recruiter profile
    setProfile(user);
    onComplete();
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    if (userType === 'recruiter') {
      if (existingRecruiters.find(r => r.email === formData.phone)) {
        setError('Email already registered. Please login.');
        return;
      }

      const newRecruiter = {
        id: `REC_${Date.now()}`,
        email: formData.phone,
        password: formData.password,
        name: formData.name,
        company: formData.district, // Using district field as company
        role: 'Recruiter',
        created_at: new Date().toISOString()
      };

      const updatedRecruiters = [...existingRecruiters, newRecruiter];
      setAllRecruiters(updatedRecruiters);
      setProfile(null); // Clear candidate profile
      setRecruiter(newRecruiter);
      console.log('Recruiter created and set:', newRecruiter);
      window.location.hash = '#/recruiter-dashboard';
      return;
    }

    // Candidate signup
    if (existingUsers.find(u => u.phone === formData.phone)) {
      setError('Phone number already registered. Please login.');
      return;
    }

    const newUser = {
      ...formData,
      candidate_id: `USER_${Date.now()}`,
      education_level: '12th',
      skills: [],
      preferred_sectors: [],
      gender: 'not_specified',
      first_gen_flag: false,
      internet_access_level: 'medium',
      created_at: new Date().toISOString()
    };

    const updatedUsers = [...existingUsers, newUser];
    setAllUsers(updatedUsers);
    setRecruiter(null); // Clear recruiter profile
    setProfile(newUser);
    onComplete();
  };

  const handleDemoLogin = () => {
    const demoUser = {
      candidate_id: 'DEMO_USER',
      name: 'Demo User',
      phone: '+91-9999999999',
      district: 'Mumbai',
      email: 'demo@example.com',
      education_level: '12th',
      skills: ['Communication', 'Computer Basics', 'Hindi', 'English'],
      preferred_sectors: ['Technology', 'Education'],
      gender: 'not_specified',
      first_gen_flag: true,
      internet_access_level: 'medium'
    };
    
    setProfile(demoUser);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Join UDAAN platform'}
          </p>
          
          {/* User Type Toggle */}
          <div className="mt-4 flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setUserType('candidate')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                userType === 'candidate'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setUserType('recruiter')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                userType === 'recruiter'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recruiter
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={isLogin ? handleLogin : handleSignup}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {userType === 'recruiter' ? 'Email Address *' : 'Phone Number *'}
              </label>
              <div className="relative">
                {userType === 'recruiter' ? (
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                ) : (
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                )}
                <input
                  type={userType === 'recruiter' ? 'email' : 'tel'}
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={userType === 'recruiter' ? 'hr@company.com' : '+91-9876543210'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder={isLogin ? "Enter password" : "Create password"}
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

            {/* Signup Only Fields */}
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {userType === 'recruiter' ? 'Company Name *' : 'District *'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.district}
                      onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder={userType === 'recruiter' ? 'Enter company name' : 'Enter your district'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn-primary"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ phone: '', password: '', name: '', district: '', email: '' });
            }}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>

        {/* Demo Login */}
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or</span>
            </div>
          </div>
          <button
            onClick={handleDemoLogin}
            className="mt-4 w-full btn-secondary"
          >
            Continue with Demo Account
          </button>
        </div>

        {/* Existing Users Count */}
        {(existingUsers.length > 0 || existingRecruiters.length > 0) && (
          <div className="text-center text-xs text-gray-500">
            {existingUsers.length} candidates, {existingRecruiters.length} recruiters registered
          </div>
        )}
      </div>
    </div>
  );
}