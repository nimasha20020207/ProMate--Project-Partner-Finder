const Student = require("../models/Student");
const Project = require("../models/post");
const { calculateScore } = require("../services/recommendationEngine");

// // ✅ Student → Projects
// const getRecommendedProjects = (req, res) => {
//   const studentId = req.params.studentId;

//   const student = students.find(s => s.id === studentId);

//   if (!student) {
//     return res.status(404).json({ message: "student not found" });
//   }

//   let results = [];

//   projects.forEach(project => {
//     const result = calculateScore(student, project);

//     if (result) {
//       results.push({
//         project,
//         score: result.score,
//         explanation: result.explanation,
//         details: result.details
//       });
//     }
//   });

//   results.sort((a, b) => b.score - a.score);

//   res.json(results);
// };

const getRecommendedProjects = async (req, res) => {
  try {
    const studentId = req.user?.id || req.params.studentId;

    const student = await Student.findById(studentId);
    if (!student) return res.json([]); // ✅ return empty array instead of object

    const allProjects = await Project.find();

    const results = allProjects
      .map(project => {
        const result = calculateScore(student, project);
        return result ? {
          project,
          score: result.score,
          explanation: result.explanation,
          details: result.details
        } : null;
      })
      .filter(r => r !== null)
      .sort((a, b) => b.score - a.score);

    res.json(results); // always an array
  } catch (err) {
    console.error(err);
    res.json([]); // ✅ fallback empty array
  }
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

