// const students = require("../dummydata/dummystudents")
// const projects = require("../dummydata/dummyprojects")

// const {calculateScore} = require("../services/recommendationEngine")

// const getRecommendedProjects = (req,res)=>{

// const studentId = req.params.studentId

// const student = students.find(s=>s.id===studentId)

// if(!student)
// return res.status(404).json({message:"student not found"})

// let results=[]

// projects.forEach(project=>{

// const result = calculateScore(student,project)

// if(result){

// results.push({

// project,
// score:result.score,
// explanation:result.explanation

// })

// }

// })

// results.sort((a,b)=>b.score-a.score)

// res.json(results)

// }

// // 🔥 NEW FUNCTION
// exports.getRecommendedStudents = (req, res) => {
//   const { projectId } = req.params;

//   // 1. Find project
//   const project = projects.find(p => p.id === projectId);

//   if (!project) {
//     return res.status(404).json({ message: "Project not found" });
//   }

//   // 2. Loop all students
//   const results = students
//     .map(student => {
//       const result = calculateScore(student, project);

//       if (!result) return null;

//       return {
//         student,
//         score: result.score,
//         explanation: result.explanation,
//         details: result.details
//       };
//     })
//     .filter(r => r !== null) // remove failed filters
//     .sort((a, b) => b.score - a.score); // sort highest first

//   res.json(results);
// };

// module.exports = {getRecommendedProjects}

const students = require("../dummydata/dummystudents");
const projects = require("../dummydata/dummyprojects");
const { calculateScore } = require("../services/recommendationEngine");

// ✅ Student → Projects
const getRecommendedProjects = (req, res) => {
  const studentId = req.params.studentId;

  const student = students.find(s => s.id === studentId);

  if (!student) {
    return res.status(404).json({ message: "student not found" });
  }

  let results = [];

  projects.forEach(project => {
    const result = calculateScore(student, project);

    if (result) {
      results.push({
        project,
        score: result.score,
        explanation: result.explanation,
        details: result.details
      });
    }
  });

  results.sort((a, b) => b.score - a.score);

  res.json(results);
};

// ✅ Project → Students
const getRecommendedStudents = (req, res) => {
  const { projectId } = req.params;

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const results = students
    .map(student => {
      const result = calculateScore(student, project);

      if (!result) return null;

      return {
        student,
        score: result.score,
        explanation: result.explanation,
        details: result.details
      };
    })
    .filter(r => r !== null)
    .sort((a, b) => b.score - a.score);

  res.json(results);
};

module.exports = {
  getRecommendedProjects,
  getRecommendedStudents
};