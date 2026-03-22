const express = require("express")
const router = express.Router()

const {
    getRecommendedProjects,
    getRecommendedStudents,
} = require("../controllers/recommendationController");

router.get("/projects/:studentId",getRecommendedProjects)

// 🔥 NEW
router.get("/students/:projectId", getRecommendedStudents);

module.exports = router