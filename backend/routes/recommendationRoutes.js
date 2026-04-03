const express = require("express")
const router = express.Router()

const {
    getRecommendedProjects,
    getRecommendedStudents,
} = require("../controllers/recommendationController");

// ✅ Import your auth middleware
const auth = require("../middleware/auth");  // <-- THIS LINE

// router.get("/projects/:studentId",getRecommendedProjects)
router.get("/projects", auth, getRecommendedProjects);

// 🔥 NEW
router.get("/students/:projectId", getRecommendedStudents);

module.exports = router;