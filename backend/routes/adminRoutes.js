// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const adminAuth = require("../middleware/adminAuth");

const studentController = require("../controllers/StudentsController");
const projectController = require("../controllers/ProjectsController");
const requestController = require("../controllers/RequestsController");
const reportController = require("../controllers/ReportController");

/*
// Admin Login Route (Public) - Replaced by main auth route
router.post("/login", async (req, res) => {
    const email = req.body.email || req.body.identifier;
    const password = req.body.password;
    const adminEmail = process.env.ADMIN_EMAIL || "admin@promate.com";
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";

    if (email === adminEmail && password === adminPass) {
        const payload = { user: { role: "admin", email } };
        jwt.sign(payload, process.env.JWT_SECRET || "promate_secret_key", { expiresIn: 3600000 }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { email, role: "admin" } });
        });
    } else {
        res.status(401).json({ message: "Invalid Admin Credentials" });
    }
});
*/

// Protect all routes below this line
router.use(adminAuth);

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
router.get("/specialization-stats", reportController.getSpecializationStats);

module.exports = router;