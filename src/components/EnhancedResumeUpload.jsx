import { useState } from 'react';
import { Upload, FileText, X, Plus, User, Briefcase, GraduationCap, Award, Code, CheckCircle } from 'lucide-react';
import { parseResumeFile } from '../utils/resumeParser';

export function EnhancedResumeUpload({ onResumeProcessed, existingProfile = {} }) {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [parsedResume, setParsedResume] = useState(null);
  const [selectedSections, setSelectedSections] = useState({
    skills: true
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    setProcessing(true);
    try {
      const resumeData = await parseResumeFile(file);
      setParsedResume(resumeData);
    } catch (error) {
      console.error('Error parsing resume:', error);
      alert('Error parsing resume. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const toggleSection = (section) => {
    setSelectedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const confirmSelection = () => {
    const selectedData = {};
    Object.keys(selectedSections).forEach(section => {
      if (selectedSections[section] && parsedResume[section]) {
        selectedData[section] = parsedResume[section];
      }
    });
    onResumeProcessed(selectedData);
  };

  const getSectionIcon = (section) => {
    const icons = {
      personalDetails: User,
      education: GraduationCap,
      workExperience: Briefcase,
      skills: Code,
      projects: FileText,
      certifications: Award
    };
    return icons[section] || FileText;
  };

  const getSectionTitle = (section) => {
    const titles = {
      personalDetails: 'Personal Details',
      education: 'Education',
      workExperience: 'Work Experience',
      skills: 'Skills',
      projects: 'Projects',
      certifications: 'Certifications'
    };
    return titles[section] || section;
  };

  const renderSectionPreview = (section, data) => {
    if (!data || (Array.isArray(data) && data.length === 0)) return null;

    switch (section) {
      case 'personalDetails':
        return (
          <div className="text-sm text-gray-600">
            <p>{data.name}</p>
            <p>{data.email} | {data.phone}</p>
            {data.address && <p>{data.address}</p>}
          </div>
        );
      
      case 'education':
        return (
          <div className="text-sm text-gray-600">
            {data.slice(0, 2).map((edu, idx) => (
              <p key={idx}>{edu.degree} - {edu.institution}</p>
            ))}
            {data.length > 2 && <p>+{data.length - 2} more</p>}
          </div>
        );
      
      case 'workExperience':
        return (
          <div className="text-sm text-gray-600">
            {data.slice(0, 2).map((work, idx) => (
              <p key={idx}>{work.position} at {work.company}</p>
            ))}
            {data.length > 2 && <p>+{data.length - 2} more</p>}
          </div>
        );
      
      case 'skills':
        return (
          <div className="flex flex-wrap gap-1">
            {data.slice(0, 6).map(skill => (
              <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {skill}
              </span>
            ))}
            {data.length > 6 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{data.length - 6} more
              </span>
            )}
          </div>
        );
      
      case 'projects':
        return (
          <div className="text-sm text-gray-600">
            {data.slice(0, 2).map((project, idx) => (
              <p key={idx}>{project.name}</p>
            ))}
            {data.length > 2 && <p>+{data.length - 2} more</p>}
          </div>
        );
      
      case 'certifications':
        return (
          <div className="text-sm text-gray-600">
            {data.slice(0, 2).map((cert, idx) => (
              <p key={idx}>{cert.title} - {cert.issuer}</p>
            ))}
            {data.length > 2 && <p>+{data.length - 2} more</p>}
          </div>
        );
      
      default:
        return <p className="text-sm text-gray-600">Data available</p>;
    }
  };

  if (processing) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing your resume...</p>
        <p className="text-sm text-gray-500">Extracting skills, experience, and education</p>
      </div>
    );
  }

  if (parsedResume) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-green-600 mb-4">
          <CheckCircle size={20} />
          <span className="font-medium">Resume processed successfully!</span>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Select sections to import:</h3>
          
          {Object.keys(parsedResume).map(section => {
            const data = parsedResume[section];
            const hasData = data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0);
            
            if (!hasData) return null;

            const Icon = getSectionIcon(section);
            
            return (
              <div key={section} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedSections[section]}
                    onChange={() => toggleSection(section)}
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className="text-primary-600" />
                      <span className="font-medium text-gray-900">
                        {getSectionTitle(section)}
                      </span>
                    </div>
                    {renderSectionPreview(section, data)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={confirmSelection}
            className="flex-1 btn-primary"
          >
            Import Selected Data
          </button>
          <button
            onClick={() => setParsedResume(null)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Upload Different Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Upload your resume for smart parsing
        </p>
        <p className="text-sm text-gray-600 mb-4">
          We'll extract your skills, experience, education, and projects automatically
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Supports PDF, DOCX, and TXT files
        </p>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileInput}
          className="hidden"
          id="resume-upload"
        />
        <label
          htmlFor="resume-upload"
          className="btn-primary cursor-pointer"
        >
          Choose Resume File
        </label>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">What we'll extract:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>Personal Details</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap size={14} />
            <span>Education</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={14} />
            <span>Work Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <Code size={14} />
            <span>Skills & Technologies</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={14} />
            <span>Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={14} />
            <span>Certifications</span>
          </div>
        </div>
      </div>
    </div>
  );
}