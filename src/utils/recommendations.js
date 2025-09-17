// Haversine distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Skill matching using simple term overlap
function calculateSkillMatch(candidateSkills, requiredSkills) {
  const candidateSet = new Set(candidateSkills.map(s => s.toLowerCase()));
  const requiredSet = new Set(requiredSkills.map(s => s.toLowerCase()));
  
  let matches = 0;
  for (const skill of requiredSet) {
    if (candidateSet.has(skill)) matches++;
  }
  
  return requiredSkills.length > 0 ? matches / requiredSkills.length : 0;
}

// Main recommendation algorithm
export function getRecommendations(candidate, internships, candidateLocation = null) {
  const scored = internships.map(internship => {
    // Hard filters - more flexible education matching
    const educationLevels = ['10th', '12th', 'Graduation', 'Post-Graduation'];
    const candidateLevel = educationLevels.indexOf(candidate.education_level);
    const requiredLevel = educationLevels.indexOf(internship.required_education);
    const educationMatch = candidateLevel >= requiredLevel;
    
    const deadlineValid = new Date(internship.deadline) > new Date();
    
    // Allow jobs even if education doesn't match perfectly (just lower score)
    if (!deadlineValid) {
      return { ...internship, score: 0, reasons: [] };
    }
    
    // Education penalty if not matching
    const educationBonus = educationMatch ? 1 : 0.7;

    // Skill match score
    const skillScore = calculateSkillMatch(candidate.skills, internship.required_skills);
    
    // Distance score (default to 0.5 if no location)
    let distanceScore = 0.5;
    let distance = null;
    if (candidateLocation && internship.location) {
      distance = calculateDistance(
        candidateLocation.lat, candidateLocation.lon,
        internship.location.lat, internship.location.lon
      );
      distanceScore = distance <= 10 ? 1 : distance <= 50 ? 0.8 : 0.5;
    }

    // Priority boosts
    let priorityMultiplier = 1;
    if (candidate.first_gen_flag) priorityMultiplier += 0.2;
    if (candidate.gender === 'female') priorityMultiplier += 0.1;

    // Composite score with education bonus
    const baseScore = (skillScore * 0.6) + (distanceScore * 0.4);
    const finalScore = baseScore * priorityMultiplier * educationBonus;

    // Generate reasons - more lenient
    const reasons = [];
    if (skillScore > 0) {
      const matchedSkills = candidate.skills.filter(skill => 
        internship.required_skills.some(req => req.toLowerCase() === skill.toLowerCase())
      );
      if (matchedSkills.length > 0) {
        reasons.push(`Matched skills: ${matchedSkills.join(', ')} - ${Math.round(skillScore * 100)}%`);
      }
    }
    if (!educationMatch) {
      reasons.push('Education level below requirement');
    }
    if (distance && distance <= 50) {
      reasons.push(`${Math.round(distance)}km away`);
    }
    if (candidate.first_gen_flag) {
      reasons.push('Priority for first-generation learners');
    }

    return {
      ...internship,
      score: finalScore,
      matchPercentage: Math.round(finalScore * 100),
      reasons,
      distance: distance ? Math.round(distance) : null
    };
  });

  return scored
    .filter(item => item.score > 0.1) // Very low threshold to show more results
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}