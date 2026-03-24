export const calculateProfileCompleteness = (user) => {
  if (!user) return { percentage: 0, checks: {} };

  const checks = {
    personalInfo: !!(user.fullName && user.department && user.degreeProgram),
    skills: false,
    interests: !!(user.interests && user.interests.length > 0),
    roles: !!(user.preferredRoles && user.preferredRoles.length > 0),
    availability: !!(user.availability && user.availability.weeklyHours > 0 && user.availability.preferredDays && user.availability.preferredDays.length > 0),
    bio: !!(user.bio && user.bio.trim().length > 0)
  };

  if (user.skills) {
    const hasAnySkill = Object.values(user.skills).some(cat => Array.isArray(cat) && cat.length > 0);
    checks.skills = hasAnySkill;
  }

  let filled = 0;
  const total = 6;
  if (checks.personalInfo) filled++;
  if (checks.skills) filled++;
  if (checks.interests) filled++;
  if (checks.roles) filled++;
  if (checks.availability) filled++;
  if (checks.bio) filled++;

  const percentage = Math.round((filled / total) * 100);

  return { percentage, checks };
};
