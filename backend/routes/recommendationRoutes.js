const express = require("express")
const router = express.Router()

const {getRecommendedProjects} = require("../controllers/recommendationController")

router.get("/projects/:studentId",getRecommendedProjects)

module.exports = router