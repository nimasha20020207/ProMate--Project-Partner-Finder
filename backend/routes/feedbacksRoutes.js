// routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();

const {
  submitFeedback,
  getAllFeedback,
} = require("../controllers/feedbacksController");

// POST → Submit feedback
router.post("/", submitFeedback);

// GET → Fetch all feedback
router.get("/", getAllFeedback);

module.exports = router;