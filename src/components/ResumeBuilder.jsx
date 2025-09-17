import { useState } from 'react';
import { Download, Eye, Palette, FileText } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const RESUME_TEMPLATES = [
  { id: 'modern', name: 'Modern', color: 'blue', description: 'Clean and professional' },
  { id: 'creative', name: 'Creative', color: 'purple', description: 'Stand out design' },
  { id: 'minimal', name: 'Minimal', color: 'gray', description: 'Simple and elegant' },
  { id: 'corporate', name: 'Corporate', color: 'green', description: 'Traditional format' }
];

export function ResumeBuilder() {
  const [profile] = useLocalStorage('userProfile', null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showPreview, setShowPreview] = useState(false);

  if (!profile) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto mb-4 text-gray-400" size={48} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your Profile First</h3>
        <p className="text-gray-600 mb-4">You need a complete profile to build your resume</p>
        <a href="#/signup" className="btn-primary">Create Profile</a>
      </div>
    );
  }

  const generateResumeHTML = () => {
    const template = RESUME_TEMPLATES.find(t => t.id === selectedTemplate);
    const colorClasses = {
      blue: 'text-blue-600 border-blue-600',
      purple: 'text-purple-600 border-purple-600',
      gray: 'text-gray-600 border-gray-600',
      green: 'text-green-600 border-green-600'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${profile.name} - Resume</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .name { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
          .contact { font-size: 14px; color: #666; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 18px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
          .item { margin-bottom: 10px; }
          .item-title { font-weight: bold; }
          .item-subtitle { color: #666; font-style: italic; }
          .skills { display: flex; flex-wrap: wrap; gap: 8px; }
          .skill { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${profile.name}</div>
          <div class="contact">
            ${profile.phone}${profile.email ? ' | ' + profile.email : ''} | ${profile.district}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Education</div>
          <div class="item">
            <div class="item-title">${profile.education_level}</div>
            <div class="item-subtitle">${profile.stream || 'General'} | ${profile.district}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills">
            ${profile.skills?.map(skill => `<span class="skill">${skill}</span>`).join('') || '<span class="skill">No skills listed</span>'}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Preferred Sectors</div>
          <div class="item">
            ${profile.preferred_sectors?.join(', ') || 'Open to all sectors'}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Additional Information</div>
          <div class="item">
            <div>First Generation Learner: ${profile.first_gen_flag ? 'Yes' : 'No'}</div>
            <div>Internet Access: ${profile.internet_access_level || 'Not specified'}</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const downloadResume = () => {
    const htmlContent = generateResumeHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.replace(/\s+/g, '_')}_Resume.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    // In a real app, you'd use a library like jsPDF or Puppeteer
    alert('PDF download feature coming soon! For now, you can print the HTML version as PDF.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Builder</h2>
        <p className="text-gray-600">Create a professional resume from your profile</p>
      </div>

      {/* Template Selection */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Palette size={20} />
          Choose Template
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RESUME_TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                selectedTemplate === template.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">{template.name}</div>
              <div className="text-sm text-gray-600">{template.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Resume Preview */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Eye size={20} />
            Resume Preview
          </h3>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn-secondary"
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {showPreview && (
          <div className="border rounded-lg p-6 bg-white max-h-96 overflow-y-auto">
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-gray-600">
                {profile.phone}{profile.email ? ' | ' + profile.email : ''} | {profile.district}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-3">Education</h2>
                <div>
                  <div className="font-semibold">{profile.education_level}</div>
                  <div className="text-gray-600 italic">{profile.stream ? profile.stream + ' | ' : ''}{profile.district}</div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-gray-100 rounded text-sm">
                      {skill}
                    </span>
                  )) || <span className="text-gray-500">No skills listed</span>}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-3">Preferred Sectors</h2>
                <p>{profile.preferred_sectors?.join(', ') || 'Open to all sectors'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Download Options */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Download size={20} />
          Download Resume
        </h3>
        <div className="flex gap-4">
          <button
            onClick={downloadResume}
            className="btn-primary flex items-center gap-2"
          >
            <Download size={16} />
            Download HTML
          </button>
          <button
            onClick={downloadPDF}
            className="btn-secondary flex items-center gap-2"
          >
            <FileText size={16} />
            Download PDF (Coming Soon)
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          HTML version can be printed as PDF from your browser
        </p>
      </div>

      {/* Profile Completeness */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">Improve Your Resume</h3>
        <div className="space-y-2 text-sm">
          {!profile.email && (
            <p className="text-blue-800">• Add email address to your profile</p>
          )}
          {(!profile.skills || profile.skills.length < 3) && (
            <p className="text-blue-800">• Add more skills (recommended: 5+ skills)</p>
          )}
          {(!profile.preferred_sectors || profile.preferred_sectors.length === 0) && (
            <p className="text-blue-800">• Select preferred job sectors</p>
          )}
        </div>
        <a href="#/profile" className="btn-secondary mt-3 inline-block">
          Update Profile
        </a>
      </div>
    </div>
  );
}