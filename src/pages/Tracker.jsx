import { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Trophy } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApplications } from '../hooks/useApplications.jsx';

const STATUS_CONFIG = {
  'Applied': { icon: Clock, color: 'blue', bg: 'bg-blue-100', text: 'text-blue-800' },
  'In Review': { icon: AlertCircle, color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'Shortlisted': { icon: CheckCircle, color: 'green', bg: 'bg-green-100', text: 'text-green-800' },
  'Rejected': { icon: XCircle, color: 'red', bg: 'bg-red-100', text: 'text-red-800' },
  'Offer': { icon: Trophy, color: 'purple', bg: 'bg-purple-100', text: 'text-purple-800' }
};

export function Tracker() {
  const { t } = useLanguage();
  const [profile] = useLocalStorage('userProfile', null);
  const { applications, updateApplicationStatus } = useApplications();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Application Tracker
          </h1>
          <p className="text-gray-600">
            Track all your internship applications in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const count = applications.filter(app => app.status === status).length;
            const Icon = config.icon;
            return (
              <div key={status} className="card text-center">
                <div className={`w-8 h-8 ${config.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <Icon size={16} className={config.text} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                <div className="text-xs text-gray-600">{status}</div>
              </div>
            );
          })}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-600 mb-4">No applications yet</p>
              <p className="text-sm text-gray-500 mb-4">Start applying to internships to see them here</p>
              <a href="#/dashboard" className="btn-primary">Browse Internships</a>
            </div>
          ) : (
            applications.map(application => {
              const statusConfig = STATUS_CONFIG[application.status];
              const Icon = statusConfig.icon;
              
              return (
                <div key={application.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {application.internship_title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {application.organization}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Applied on {formatDate(application.applied_date)}
                      </p>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                      <Icon size={14} className={statusConfig.text} />
                      <span className={`text-sm font-medium ${statusConfig.text}`}>
                        {application.status}
                      </span>
                    </div>
                  </div>

                  {/* Status Update (for prototyping) */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Update Status (Demo):</p>
                    <div className="flex gap-2 flex-wrap">
                      {Object.keys(STATUS_CONFIG).map(status => (
                        <button
                          key={status}
                          onClick={() => updateApplicationStatus(application.id, status)}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            application.status === status
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        {applications.length > 0 && (
          <div className="mt-8 text-center">
            <a href="#/dashboard" className="btn-secondary mr-4">
              Apply to More Jobs
            </a>
            <button 
              onClick={() => {
                const summary = applications.map(app => 
                  `${app.internship_title} - ${app.status}`
                ).join('\n');
                alert(`Application Summary:\n\n${summary}`);
              }}
              className="btn-secondary"
            >
              Export Summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}