import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User, Phone, Eye, EyeOff } from 'lucide-react';

export function JobSeekerLogin() {
  const [, setProfile] = useLocalStorage('userProfile', null);
  const [existingUsers] = useLocalStorage('allUsers', []);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const hashPassword = (password) => {
    return btoa(password + 'salt123');
  };

  const verifyPassword = (password, hash) => {
    return hashPassword(password) === hash;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.phone?.trim() || !formData.password?.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const user = existingUsers.find(u => u.phone === formData.phone);
    
    if (!user) {
      setError('Phone number not found. Please sign up first.');
      return;
    }

    if (!verifyPassword(formData.password, user.password)) {
      setError('Incorrect password');
      return;
    }

    setProfile(user);
    window.location.hash = '#/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-6 text-3xl font-bold text-neutral-900">
            Job Seeker Login
          </h2>
          <p className="mt-2 text-base text-neutral-600">
            Sign in to find your next opportunity
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-field pl-10"
                  placeholder="+91-9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="input-field pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
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

        <div className="text-center">
          <a
            href="#/signup"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
          >
            Don't have an account? Sign up
          </a>
        </div>
      </div>
    </div>
  );
}