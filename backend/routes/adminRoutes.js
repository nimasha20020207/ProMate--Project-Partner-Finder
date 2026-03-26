// routes/adminRoutes.js
const express = require("express");
const router = express.Router();

const studentController = require("../controllers/StudentsController");
const projectController = require("../controllers/ProjectsController");
const requestController = require("../controllers/RequestsController");
const reportController = require("../controllers/ReportController");

// Students
router.get("/students", studentController.getStudents);
router.put("/students/:id", studentController.updateStudent);
router.delete("/students/:id", studentController.deleteStudent);
router.post("/students", studentController.createStudent);

// Projects
router.get("/projects", projectController.getProjects);
router.put("/projects/:id", projectController.updateProject);
router.delete("/projects/:id", projectController.deleteProject);
router.post("/projects", projectController.createProject);

// Requests
router.get("/requests", requestController.getRequests);
router.put("/requests/:id", requestController.updateRequest);

// Reports
router.get("/reports", reportController.getReports);

module.exports = router;