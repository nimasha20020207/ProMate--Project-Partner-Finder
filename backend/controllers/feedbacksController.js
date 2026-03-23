// controllers/feedbackController.js
const Feedback = require("../models/feedbacksModel");

// 👉 Submit Feedback
const submitFeedback = async (req, res) => {
  try {
    const { studentId, rating, comments, improvementAreas } = req.body;

    // ✅ VALIDATIONS
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (!comments || comments.trim().length === 0) {
      return res.status(400).json({ message: "Comments are required" });
    }

    if (comments.length > 300) {
      return res.status(400).json({ message: "Comments max length is 300" });
    }

    // ✅ CREATE OBJECT
    const feedback = new Feedback({
      studentId,
      rating,
      comments,
      improvementAreas,
    });

    await feedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// 👉 Get All Feedback (for admin/testing)
const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
};