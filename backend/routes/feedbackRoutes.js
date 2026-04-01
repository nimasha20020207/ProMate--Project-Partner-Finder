const express = require("express");
const router = express.Router();

const {
  submitFeedback,
  getAllFeedback,
  getFeedbackStats,
} = require("../controllers/feedbackController");

router.post("/", submitFeedback);
router.get("/", getAllFeedback);
router.get("/stats", getFeedbackStats);

module.exports = router;