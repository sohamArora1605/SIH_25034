// Mock skill extraction from resume text
const SKILL_DATABASE = [
  // Programming Languages
  'JavaScript', 'Python', 'Java', 'C++', 'C', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
  'TypeScript', 'Scala', 'Perl', 'R', 'MATLAB', 'Objective-C', 'Dart', 'Lua', 'Shell', 'Bash',
  
  // Web Technologies
  'HTML', 'CSS', 'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
  'Laravel', 'Bootstrap', 'Tailwind', 'jQuery', 'SASS', 'LESS', 'Webpack', 'Vite',
  
  // Databases
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Cassandra',
  'DynamoDB', 'Firebase', 'Elasticsearch', 'Neo4j',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub', 'GitLab',
  'CI/CD', 'Terraform', 'Ansible', 'Linux', 'Ubuntu', 'CentOS',
  
  // Mobile Development
  'Android', 'iOS', 'React Native', 'Flutter', 'Xamarin', 'Ionic',
  
  // Data Science & AI
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
  'Scikit-learn', 'Jupyter', 'Tableau', 'Power BI', 'Apache Spark', 'Hadoop',
  
  // Office & Productivity
  'Excel', 'PowerPoint', 'Word', 'MS Office', 'Google Sheets', 'Google Docs',
  'Outlook', 'Teams', 'Slack', 'Notion', 'Trello', 'Jira', 'Confluence',
  
  // Design & Creative
  'Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Sketch', 'Canva', 'XD',
  'After Effects', 'Premiere Pro', 'Blender', 'AutoCAD', 'SolidWorks',
  
  // Testing & Quality
  'Testing', 'Unit Testing', 'Integration Testing', 'Selenium', 'Jest', 'Cypress',
  'Postman', 'API Testing', 'Load Testing', 'Quality Assurance',
  
  // Soft Skills
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Time Management',
  'Project Management', 'Critical Thinking', 'Creativity', 'Adaptability', 'Negotiation',
  'Presentation', 'Public Speaking', 'Mentoring', 'Coaching', 'Strategic Planning',
  
  // Languages
  'Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Punjabi',
  'Urdu', 'Malayalam', 'Kannada', 'Odia', 'Assamese', 'French', 'German', 'Spanish',
  
  // Business & Finance
  'Accounting', 'Finance', 'Investment', 'Banking', 'Insurance', 'Taxation',
  'Financial Analysis', 'Budgeting', 'Forecasting', 'Risk Management', 'Audit',
  
  // Marketing & Sales
  'Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing', 'Content Marketing',
  'Email Marketing', 'PPC', 'Google Analytics', 'Facebook Ads', 'LinkedIn Marketing',
  'Sales', 'CRM', 'Lead Generation', 'Customer Service', 'Business Development',
  
  // Healthcare & Science
  'Healthcare', 'Nursing', 'Pharmacy', 'Medicine', 'Biology', 'Chemistry', 'Physics',
  'Biotechnology', 'Microbiology', 'Pathology', 'Radiology', 'Surgery',
  
  // Education & Training
  'Teaching', 'Training', 'Curriculum Development', 'E-learning', 'Instructional Design',
  'Educational Technology', 'Classroom Management', 'Assessment', 'Tutoring',
  
  // Other Technical
  'Networking', 'Cybersecurity', 'Ethical Hacking', 'Penetration Testing', 'Firewall',
  'VPN', 'Active Directory', 'Windows Server', 'VMware', 'Hyper-V', 'Backup',
  
  // Emerging Technologies
  'Blockchain', 'Cryptocurrency', 'IoT', 'AR', 'VR', 'Robotics', 'Drone Technology',
  '3D Printing', 'Quantum Computing', 'Edge Computing'
];

// Direct skill extraction from resume text
export function extractSkillsFromText(resumeText) {
  // Clean the text first - remove PDF artifacts
  const cleanText = resumeText
    .replace(/%PDF[\d\.-]+/g, '')
    .replace(/\d+\s+\d+\s+obj/g, '')
    .replace(/endobj/g, '')
    .replace(/stream|endstream/g, '')
    .replace(/[<>&]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
  
  const foundSkills = [];
  
  // More precise matching with word boundaries
  SKILL_DATABASE.forEach(skill => {
    const skillLower = skill.toLowerCase();
    // Use word boundary regex for better matching
    const regex = new RegExp(`\\b${skillLower.replace(/[+]/g, '\\+')}\\b`, 'i');
    if (regex.test(cleanText)) {
      foundSkills.push(skill);
    }
  });
  
  return [...new Set(foundSkills)]; // Remove duplicates
}



// Suggest related skills based on existing skills
export function suggestRelatedSkills(existingSkills) {
  const skillGroups = {
    'Programming': ['JavaScript', 'Python', 'Java', 'C++', 'HTML', 'CSS', 'React', 'Node.js'],
    'Data': ['Excel', 'SQL', 'MongoDB', 'Data Analysis', 'R Programming', 'MATLAB'],
    'Design': ['Photoshop', 'Canva', 'Graphic Design', 'Video Editing', 'AutoCAD'],
    'Office': ['MS Office', 'Word', 'PowerPoint', 'Excel', 'Email', 'Documentation'],
    'Communication': ['Hindi', 'English', 'Communication', 'Content Writing', 'Translation'],
    'Marketing': ['Digital Marketing', 'Social Media', 'SEO', 'WhatsApp Business', 'Sales'],
    'Management': ['Leadership', 'Project Management', 'Time Management', 'HR'],
    'Technical': ['Computer Basics', 'Internet', 'Typing', 'Git', 'Docker', 'AWS']
  };
  
  const suggestions = new Set();
  const existingLower = existingSkills.map(s => s.toLowerCase());
  
  // Find related skills from same groups
  Object.values(skillGroups).forEach(group => {
    const hasSkillInGroup = group.some(skill => 
      existingLower.includes(skill.toLowerCase())
    );
    
    if (hasSkillInGroup) {
      group.forEach(skill => {
        if (!existingLower.includes(skill.toLowerCase())) {
          suggestions.add(skill);
        }
      });
    }
  });
  
  return Array.from(suggestions).slice(0, 8); // Limit suggestions
}



// Analyze skill gaps for specific internships
export function analyzeSkillGap(candidateSkills, requiredSkills) {
  const candidateLower = candidateSkills.map(s => s.toLowerCase());
  const requiredLower = requiredSkills.map(s => s.toLowerCase());
  
  const matchedSkills = requiredSkills.filter(skill => 
    candidateLower.includes(skill.toLowerCase())
  );
  
  const missingSkills = requiredSkills.filter(skill => 
    !candidateLower.includes(skill.toLowerCase())
  );
  
  const matchPercentage = requiredSkills.length > 0 
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 0;
  
  return {
    matchedSkills,
    missingSkills,
    matchPercentage,
    recommendations: suggestRelatedSkills([...candidateSkills, ...missingSkills])
  };
}