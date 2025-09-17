// Enhanced resume parser with complete structure extraction
import { SKILL_DATABASE } from './skillParser.js';

// Main resume parsing function
export function parseResumeFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target.result;
      const parsedResume = parseResumeStructure(text);
      resolve(parsedResume);
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    if (file.type === 'application/pdf') {
      // For PDF files, we'll simulate extraction (in real app, use PDF.js)
      reader.readAsText(file);
    } else if (file.type.includes('word') || file.name.endsWith('.docx')) {
      // For DOCX files, simulate extraction (in real app, use mammoth.js)
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
  });
}

// Parse complete resume structure
export function parseResumeStructure(resumeText) {
  // Use actual resume text only
  const textToAnalyze = resumeText;
  
  return {
    skills: extractSkillsAdvanced(textToAnalyze)
  };
}

// Extract personal details
function extractPersonalDetails(resumeText) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /[\+]?[91]?[-\s]?[6-9]\d{9}/;
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-]+/i;
  
  return {
    name: extractName(resumeText),
    email: resumeText.match(emailRegex)?.[0] || '',
    phone: resumeText.match(phoneRegex)?.[0] || '',
    linkedin: resumeText.match(linkedinRegex)?.[0] || '',
    address: extractAddress(resumeText)
  };
}

// Extract education with enhanced parsing
function extractEducation(resumeText) {
  const lines = resumeText.split('\n');
  const educationEntries = [];
  let inEducationSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('education') || lowerLine.includes('academic')) {
      inEducationSection = true;
      continue;
    }
    
    if (inEducationSection && line.length > 0) {
      if (lowerLine.includes('experience') || lowerLine.includes('skills') || lowerLine.includes('projects')) {
        break;
      }
      
      if (lowerLine.includes('bachelor') || lowerLine.includes('master') || 
          lowerLine.includes('diploma') || lowerLine.includes('12th') || 
          lowerLine.includes('10th') || lowerLine.includes('graduation')) {
        
        const nextLine = lines[i + 1]?.trim() || '';
        const scoreMatch = resumeText.match(/(?:cgpa|gpa|percentage|marks?)[\s:]*(\d+\.?\d*)/i);
        
        educationEntries.push({
          degree: line,
          institution: nextLine.includes('(') ? nextLine.split('(')[0].trim() : nextLine,
          duration: extractDuration(nextLine),
          score: scoreMatch?.[1] || ''
        });
      }
    }
  }
  
  return educationEntries;
}

// Extract work experience
function extractWorkExperience(resumeText) {
  const lines = resumeText.split('\n');
  const workEntries = [];
  let inWorkSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('experience') || lowerLine.includes('work') || lowerLine.includes('employment')) {
      inWorkSection = true;
      continue;
    }
    
    if (inWorkSection && line.length > 0) {
      if (lowerLine.includes('education') || lowerLine.includes('skills') || lowerLine.includes('projects')) {
        break;
      }
      
      if (lowerLine.includes('intern') || lowerLine.includes('developer') || 
          lowerLine.includes('analyst') || lowerLine.includes('manager') ||
          lowerLine.includes('engineer') || lowerLine.includes('associate')) {
        
        const highlights = [];
        let j = i + 1;
        while (j < lines.length && lines[j].trim().startsWith('•')) {
          highlights.push(lines[j].trim().substring(1).trim());
          j++;
        }
        
        workEntries.push({
          position: line.split(' at ')[0] || line,
          company: line.split(' at ')[1]?.split('(')[0]?.trim() || '',
          duration: extractDuration(line),
          highlights: highlights
        });
      }
    }
  }
  
  return workEntries;
}

// Enhanced skill extraction
function extractSkillsAdvanced(resumeText) {
  // Clean the text first - remove PDF artifacts
  const cleanText = resumeText
    .replace(/%PDF[\d\.-]+/g, '')
    .replace(/\d+\s+\d+\s+obj/g, '')
    .replace(/endobj/g, '')
    .replace(/stream|endstream/g, '')
    .replace(/[<>]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
  
  const skillCategories = {
    programming: ['JavaScript', 'Python', 'Java', 'C++', 'C', 'React', 'Node.js', 'HTML', 'CSS', 'Angular', 'Vue'],
    tools: ['Git', 'Docker', 'AWS', 'MongoDB', 'SQL', 'MySQL', 'PostgreSQL', 'Excel', 'Photoshop', 'Figma'],
    frameworks: ['Spring', 'Django', 'Flask', 'Express', 'Bootstrap', 'Tailwind'],
    languages: ['Hindi', 'English', 'Tamil', 'Bengali', 'Marathi', 'Gujarati'],
    soft: ['Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Management']
  };
  
  const foundSkills = [];
  
  // More precise matching with word boundaries
  Object.values(skillCategories).flat().forEach(skill => {
    const skillLower = skill.toLowerCase();
    // Use word boundary regex for better matching
    const regex = new RegExp(`\\b${skillLower.replace(/[+]/g, '\\+')}\\b`, 'i');
    if (regex.test(cleanText)) {
      foundSkills.push(skill);
    }
  });
  
  return [...new Set(foundSkills)]; // Remove duplicates
}

// Extract projects
function extractProjects(resumeText) {
  const lines = resumeText.split('\n');
  const projects = [];
  let inProjectSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('project') || lowerLine.includes('portfolio')) {
      inProjectSection = true;
      continue;
    }
    
    if (inProjectSection && line.length > 0) {
      if (lowerLine.includes('certification') || lowerLine.includes('education') || lowerLine.includes('skills')) {
        break;
      }
      
      if (!line.startsWith('•') && !lowerLine.includes('project')) {
        const description = lines[i + 1]?.trim() || '';
        const techStack = extractTechStack(resumeText, i);
        
        projects.push({
          name: line,
          description: description.startsWith('•') ? '' : description,
          technologies: techStack,
          url: extractUrl(resumeText, i)
        });
      }
    }
  }
  
  return projects;
}

// Extract certifications
function extractCertifications(resumeText) {
  const lines = resumeText.split('\n');
  const certifications = [];
  let inCertSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes('certification') || lowerLine.includes('certificate') || lowerLine.includes('award')) {
      inCertSection = true;
      continue;
    }
    
    if (inCertSection && line.length > 0) {
      if (lowerLine.includes('education') || lowerLine.includes('experience')) {
        break;
      }
      
      if (!line.startsWith('•')) {
        const issuer = lines[i + 1]?.trim() || '';
        const year = extractYear(line + ' ' + issuer);
        
        certifications.push({
          title: line,
          issuer: issuer.includes('(') ? issuer.split('(')[0].trim() : issuer,
          year: year,
          description: lines[i + 2]?.trim() || ''
        });
      }
    }
  }
  
  return certifications;
}

// Helper functions
function extractName(resumeText) {
  const lines = resumeText.split('\n').filter(line => line.trim().length > 0);
  return lines[0]?.trim() || '';
}

function extractAddress(resumeText) {
  const addressPattern = /([A-Za-z\s]+,\s*[A-Za-z\s]+)/;
  const match = resumeText.match(addressPattern);
  return match?.[0] || '';
}

function extractDuration(text) {
  const durationPattern = /\(([^)]+)\)/;
  const match = text.match(durationPattern);
  return match?.[1] || '';
}

function extractYear(text) {
  const yearPattern = /\b(19|20)\d{2}\b/;
  const match = text.match(yearPattern);
  return match?.[0] || '';
}

function extractTechStack(resumeText, startIndex) {
  const techKeywords = ['React', 'Node.js', 'Python', 'JavaScript', 'MongoDB', 'SQL', 'AWS'];
  const nearbyText = resumeText.split('\n').slice(startIndex, startIndex + 3).join(' ');
  
  return techKeywords.filter(tech => 
    nearbyText.toLowerCase().includes(tech.toLowerCase())
  );
}

function extractUrl(resumeText, startIndex) {
  const urlPattern = /https?:\/\/[^\s]+/;
  const nearbyText = resumeText.split('\n').slice(startIndex, startIndex + 3).join(' ');
  const match = nearbyText.match(urlPattern);
  return match?.[0] || '';
}