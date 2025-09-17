import { useState } from 'react';
import { Users, Check } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DEMO_USERS = [
  {
    candidate_id: 'DEMO001',
    name: 'Priya Sharma',
    phone: '+91-9876543201',
    district: 'Sitapur',
    education_level: '12th',
    skills: ['Communication', 'Hindi', 'Computer Basics', 'Customer Service'],
    preferred_sectors: ['Education', 'Healthcare'],
    gender: 'female',
    first_gen_flag: true,
    college_type: 'rural',
    language_pref: 'Hindi'
  },
  {
    candidate_id: 'DEMO002',
    name: 'Rahul Kumar',
    phone: '+91-9876543202',
    district: 'Hardoi',
    education_level: 'Graduation',
    skills: ['Teaching', 'Hindi', 'English', 'MS Office', 'Leadership'],
    preferred_sectors: ['Education', 'Administration'],
    gender: 'male',
    first_gen_flag: true,
    college_type: 'rural',
    language_pref: 'Hindi'
  },
  {
    candidate_id: 'DEMO003',
    name: 'Anita Devi',
    phone: '+91-9876543203',
    district: 'Barabanki',
    education_level: '10th',
    skills: ['Data Entry', 'Hindi Typing', 'Computer Basics'],
    preferred_sectors: ['Administration', 'Banking'],
    gender: 'female',
    first_gen_flag: true,
    college_type: 'rural',
    language_pref: 'Hindi'
  }
];

export function UserSwitcher({ onClose }) {
  const [profile, setProfile] = useLocalStorage('userProfile', null);
  const [, setApplications] = useLocalStorage('applications', []);
  const [, setSavedJobs] = useLocalStorage('savedJobs', []);

  const switchUser = (user) => {
    setProfile(user);
    setApplications([]); // Clear applications for new user
    setSavedJobs([]); // Clear saved jobs for new user
    onClose();
    window.location.hash = '#/dashboard';
  };

  const clearProfile = () => {
    setProfile(null);
    setApplications([]);
    setSavedJobs([]);
    onClose();
    window.location.hash = '#/';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-primary-600" size={24} />
            <h2 className="text-lg font-semibold text-gray-900">Switch User (Demo)</h2>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Switch between demo profiles to test different user experiences
          </p>

          <div className="space-y-2">
            {DEMO_USERS.map(user => (
              <button
                key={user.candidate_id}
                onClick={() => switchUser(user)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  profile?.candidate_id === user.candidate_id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">
                      {user.education_level} • {user.district} • {user.skills.length} skills
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {user.skills.slice(0, 3).join(', ')}
                      {user.skills.length > 3 && ` +${user.skills.length - 3} more`}
                    </div>
                  </div>
                  {profile?.candidate_id === user.candidate_id && (
                    <Check className="text-primary-600" size={20} />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={clearProfile}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear Profile
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}