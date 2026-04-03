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