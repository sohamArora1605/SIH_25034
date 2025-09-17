import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Plus, Users, Briefcase, Eye, Edit, Trash2, Calendar, MapPin, IndianRupee } from 'lucide-react';

export function RecruiterDashboard() {
  const [recruiter] = useLocalStorage('recruiterProfile', null);
  const [postedJobs, setPostedJobs] = useLocalStorage('postedJobs', []);
  const [applications] = useLocalStorage('applications', []);
  const [showJobForm, setShowJobForm] = useState(false);

  if (!recruiter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Please login as recruiter</h2>
          <p className="text-sm text-gray-600 mb-4">Debug: No recruiter profile found</p>
          <a href="#/auth" className="btn-primary">Login</a>
        </div>
      </div>
    );
  }
  
  console.log('Recruiter Dashboard - Recruiter:', recruiter);

  const myJobApplications = applications.filter(app => 
    postedJobs.some(job => job.intern_id === app.internship.intern_id)
  );

  const handleDeleteJob = (jobId) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      setPostedJobs(prev => prev.filter(job => job.intern_id !== jobId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {recruiter.name}
            </h1>
            <p className="text-gray-600">{recruiter.company} - {recruiter.role}</p>
          </div>
          <button
            onClick={() => setShowJobForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Post New Job
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <Briefcase className="mx-auto mb-2 text-primary-600" size={24} />
            <div className="text-2xl font-bold text-gray-900">{postedJobs.length}</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </div>
          <div className="card text-center">
            <Users className="mx-auto mb-2 text-secondary-600" size={24} />
            <div className="text-2xl font-bold text-gray-900">{myJobApplications.length}</div>
            <div className="text-sm text-gray-600">Applications Received</div>
          </div>
          <div className="card text-center">
            <Eye className="mx-auto mb-2 text-accent-600" size={24} />
            <div className="text-2xl font-bold text-gray-900">
              {myJobApplications.filter(app => app.status === 'In Review').length}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>
        </div>

        {/* Posted Jobs */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Job Postings</h2>
          {postedJobs.length === 0 ? (
            <div className="card text-center py-8">
              <Briefcase className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-gray-600 mb-4">Start by posting your first internship opportunity</p>
              <button
                onClick={() => setShowJobForm(true)}
                className="btn-primary"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {postedJobs.map(job => (
                <div key={job.intern_id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {job.location.district}, {job.location.state}
                        </div>
                        <div className="flex items-center gap-1">
                          <IndianRupee size={14} />
                          ₹{job.stipend}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {job.duration_weeks} weeks
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.required_skills.slice(0, 4).map(skill => (
                          <span key={skill} className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {job.required_skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{job.required_skills.length - 4} more
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Applications: {myJobApplications.filter(app => app.internship.intern_id === job.intern_id).length}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteJob(job.intern_id)}
                        className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Applications</h2>
          {myJobApplications.length === 0 ? (
            <div className="card text-center py-8">
              <Users className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600">Applications will appear here once candidates apply to your jobs</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myJobApplications.slice(0, 5).map(application => (
                <div key={application.id} className="card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{application.candidate.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">Applied for: {application.internship.title}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Applied: {new Date(application.applied_date).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          application.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                          application.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                    <button className="btn-secondary text-sm">
                      View Application
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <JobPostingForm 
          recruiter={recruiter}
          onClose={() => setShowJobForm(false)}
          onJobPosted={(job) => {
            setPostedJobs(prev => [...prev, job]);
            setShowJobForm(false);
          }}
        />
      )}
    </div>
  );
}

function JobPostingForm({ recruiter, onClose, onJobPosted }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    required_skills: [],
    location: { district: '', state: '' },
    stipend: '',
    duration_weeks: '',
    deadline: '',
    remote_flag: false,
    required_education: '12th'
  });

  const [skillInput, setSkillInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newJob = {
      intern_id: `JOB_${Date.now()}`,
      ...formData,
      organization: recruiter.company,
      posted_date: new Date().toISOString(),
      contact_phone: recruiter.email,
      tags: formData.required_skills.slice(0, 3),
      language: 'English',
      application_link: '#/apply'
    };

    onJobPosted(newJob);
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.required_skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        required_skills: [...prev.required_skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.filter(s => s !== skill)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Post New Internship</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Software Developer Intern"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                rows="3"
                placeholder="Job description and responsibilities"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                <input
                  type="text"
                  required
                  value={formData.location.district}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, district: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={formData.location.state}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, state: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stipend (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.stipend}
                  onChange={(e) => setFormData(prev => ({ ...prev, stipend: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (weeks) *</label>
                <input
                  type="number"
                  required
                  value={formData.duration_weeks}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_weeks: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Add a skill"
                />
                <button type="button" onClick={addSkill} className="btn-secondary">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.required_skills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-800 rounded text-sm">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-primary-600">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remote"
                checked={formData.remote_flag}
                onChange={(e) => setFormData(prev => ({ ...prev, remote_flag: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="remote" className="text-sm text-gray-700">Remote work allowed</label>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-1 btn-primary">Post Job</button>
              <button type="button" onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}