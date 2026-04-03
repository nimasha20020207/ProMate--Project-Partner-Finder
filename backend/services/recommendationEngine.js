// function getSkills(student){

// return [
// ...student.skills.languages,
// ...student.skills.frameworks,
// ...student.skills.libraries,
// ...student.skills.databases,
// ...student.skills.tools

// ]

// }

// function getProjectSkills(project){

// return [

// ...project.essentialSkills.languages,
// ...project.essentialSkills.frameworks,
// ...project.essentialSkills.libraries,
// ...project.essentialSkills.databases,
// ...project.essentialSkills.tools

// ]

// }

// function calculateScore(student,project){

// // Academic filter
// if(!project.academicConstraints.specialization.includes(student.academicInfo.specialization))
// return null

// if(student.academicInfo.cgpa < project.academicConstraints.minimumCGPA)
// return null

// const studentSkills = getSkills(student)
// const projectSkills = getProjectSkills(project)

// const matchedSkills = projectSkills.filter(skill=>studentSkills.includes(skill))

// const skillScore = matchedSkills.length / projectSkills.length

// const availabilityScore =
// student.availability.weeklyHours >= project.availabilityRequirement.weeklyHours
// ? 1
// : student.availability.weeklyHours / project.availabilityRequirement.weeklyHours

// const interestMatch = project.domain.filter(d=>student.interests.includes(d))

// const interestScore = interestMatch.length / project.domain.length

// const finalScore =
// (skillScore * 0.5) +
// (availabilityScore * 0.3) +
// (interestScore * 0.2)

// return {

// score:finalScore,

// explanation:
// `Matched ${matchedSkills.length} skills, availability aligned and domain interest matched`,

// details: {
//     matchedSkills,
//     totalRequiredSkills: projectSkills.length,

//     interestMatches: interestMatch
//   }

// }

// }

// module.exports = {calculateScore}

// recommendationEngine.js

// Helper to flatten student's skills
function getSkills(student) {
  return [
    ...(student.skills?.languages || []),
    ...(student.skills?.frameworks || []),
    ...(student.skills?.libraries || []),
    ...(student.skills?.databases || []),
    ...(student.skills?.tools || [])
  ];
}

// Helper to flatten project's essential skills
function getProjectSkills(project) {
  return [
    ...(project.essentialSkills?.languages || []),
    ...(project.essentialSkills?.frameworks || []),
    ...(project.essentialSkills?.libraries || []),
    ...(project.essentialSkills?.databases || []),
    ...(project.essentialSkills?.tools || [])
  ];
}

// Normalize text for comparison (fixes AI vs Artificial Intelligence mismatch)
function normalize(text) {
  return text?.toLowerCase().trim();
}

// Main scoring function
function calculateScore(student, project) {

  console.log("=== calculateScore ===");
console.log("Student specialization:", student.academicInfo?.specialization);
console.log("Project specialization:", project.specialization);

  // 1️⃣ Academic filter
  const studentSpec = normalize(student.academicInfo?.specialization);
  const projectSpec = normalize(project.specialization);

  if (!studentSpec || !projectSpec) return null;

  // Check specialization match (basic contains check)
  if (!projectSpec.includes(studentSpec)) {
    return null;
  }

  // CGPA check
  if ((student.academicInfo?.cgpa || 0) < (project.minimumCGPA || 0)) {
    return null;
  }

  // 2️⃣ Skills matching
  const studentSkills = getSkills(student);
  const projectSkills = getProjectSkills(project);

  const matchedSkills = projectSkills.filter(skill =>
    studentSkills.includes(skill)
  );

  const skillScore = projectSkills.length > 0
    ? matchedSkills.length / projectSkills.length
    : 0;

  // 3️⃣ Availability matching
  const availabilityScore =
    (student.availability?.weeklyHours || 0) >= (project.availabilityRequirement?.weeklyHours || 0)
      ? 1
      : ((student.availability?.weeklyHours || 0) / (project.availabilityRequirement?.weeklyHours || 1));

  // 4️⃣ Domain/Interest matching
  const studentInterests = student.interests || [];
  const projectDomain = project.domain || [];

  const interestMatch = projectDomain.filter(d =>
    studentInterests.includes(d)
  );

  const interestScore = projectDomain.length > 0
    ? interestMatch.length / projectDomain.length
    : 0;

  // 5️⃣ Weighted final score
  const finalScore = (skillScore * 0.5) + (availabilityScore * 0.3) + (interestScore * 0.2);

  // 6️⃣ Return structured result
  return {
    score: finalScore,
    explanation: `Matched ${matchedSkills.length} skills, availability aligned, domain interest matched`,
    details: {
      matchedSkills,
      totalRequiredSkills: projectSkills.length,
      interestMatches: interestMatch
    }
  };
}

module.exports = { calculateScore };