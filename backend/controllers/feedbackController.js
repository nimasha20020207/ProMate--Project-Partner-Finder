const Feedback = require("../models/feedbackModel");

// 👉 Submit Feedback
const submitFeedback = async (req, res) => {
  try {
    const { studentId, rating, comments, improvementAreas } = req.body;

    // VALIDATION
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

    // Prevent duplicate feedback
    const existing = await Feedback.findOne({ studentId });
    if (existing) {
      return res.status(400).json({ message: "Feedback already submitted" });
    }

    const feedback = new Feedback({
      studentId,
      rating,
      comments,
      improvementAreas: improvementAreas || [],
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

// 👉 Get All Feedback
const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbackList);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// 👉 Stats
const getFeedbackStats = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          total: { $sum: 1 },
        },
      },
    ]);

    res.json({
      averageRating: stats[0]?.avgRating || 0,
      totalFeedbacks: stats[0]?.total || 0,
    });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  getFeedbackStats,
};