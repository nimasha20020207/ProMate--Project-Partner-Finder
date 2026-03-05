function getSkills(student){

return [

...student.skills.languages.map(s=>s.name),
...student.skills.frameworks.map(s=>s.name),
...student.skills.libraries.map(s=>s.name),
...student.skills.databases.map(s=>s.name),
...student.skills.tools.map(s=>s.name)

]

}

function getProjectSkills(project){

return [

...project.essentialSkills.languages,
...project.essentialSkills.frameworks,
...project.essentialSkills.libraries,
...project.essentialSkills.databases,
...project.essentialSkills.tools

]

}

function calculateScore(student,project){

// Academic filter
if(!project.academicConstraints.specialization.includes(student.academicInfo.specialization))
return null

if(student.academicInfo.cgpa < project.academicConstraints.minimumCGPA)
return null

const studentSkills = getSkills(student)
const projectSkills = getProjectSkills(project)

const matchedSkills = projectSkills.filter(skill=>studentSkills.includes(skill))

const skillScore = matchedSkills.length / projectSkills.length

const availabilityScore =
student.availability.weeklyHours >= project.availabilityRequirement.weeklyHours
? 1
: student.availability.weeklyHours / project.availabilityRequirement.weeklyHours

const interestMatch = project.domain.filter(d=>student.interests.includes(d))

const interestScore = interestMatch.length / project.domain.length

const finalScore =
(skillScore * 0.5) +
(availabilityScore * 0.3) +
(interestScore * 0.2)

return {

score:finalScore,

explanation:
`Matched ${matchedSkills.length} skills, availability aligned and domain interest matched`

}

}

module.exports = {calculateScore}