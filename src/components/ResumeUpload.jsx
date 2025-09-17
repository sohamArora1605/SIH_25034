import { useState } from 'react';
import { Upload, FileText, X, Plus } from 'lucide-react';
import { extractSkillsFromText, suggestRelatedSkills } from '../utils/skillParser';

export function ResumeUpload({ onSkillsExtracted, existingSkills = [] }) {
  const [dragActive, setDragActive] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [resumeText, setResumeText] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);

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

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (text && text.trim().length > 0) {
        processResumeText(text);
      } else {
        alert('Could not extract text from file. Please try pasting text manually.');
      }
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);
  };

  const handleTextSubmit = () => {
    if (resumeText.trim()) {
      processResumeText(resumeText);
    }
  };

  const processResumeText = (text) => {
    const skills = extractSkillsFromText(text);
    const suggestions = suggestRelatedSkills([...existingSkills, ...skills]);
    
    setExtractedSkills(skills);
    setSuggestedSkills(suggestions);
  };

  const addSkill = (skill) => {
    const newSkills = [...extractedSkills, skill];
    setExtractedSkills(newSkills);
    setSuggestedSkills(prev => prev.filter(s => s !== skill));
    onSkillsExtracted(newSkills);
  };

  const removeSkill = (skill) => {
    const newSkills = extractedSkills.filter(s => s !== skill);
    setExtractedSkills(newSkills);
    onSkillsExtracted(newSkills);
  };

  const confirmSkills = () => {
    onSkillsExtracted(extractedSkills);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setShowTextInput(false)}
            className={`px-4 py-2 text-sm rounded-lg ${!showTextInput ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Upload Resume
          </button>
          <button
            onClick={() => setShowTextInput(true)}
            className={`px-4 py-2 text-sm rounded-lg ${showTextInput ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Paste Text
          </button>
        </div>

        {!showTextInput ? (
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
              Upload your resume
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Drag and drop or click to select (PDF, DOC, TXT)
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
              Choose File
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              onClick={handleTextSubmit}
              className="btn-primary"
              disabled={!resumeText.trim()}
            >
              Extract Skills
            </button>
          </div>
        )}
      </div>

      {/* Extracted Skills */}
      {extractedSkills.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Extracted Skills</h3>
          <div className="flex flex-wrap gap-2">
            {extractedSkills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:text-green-600"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Skills */}
      {suggestedSkills.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">Suggested Skills</h3>
          <p className="text-sm text-gray-600">
            Based on your profile, you might also have these skills:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map(skill => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                <Plus size={14} />
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {extractedSkills.length > 0 && (
        <button
          onClick={confirmSkills}
          className="w-full btn-primary"
        >
          Use These Skills ({extractedSkills.length})
        </button>
      )}
    </div>
  );
}