
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  comments: {
    type: String,
    required: true,
    maxlength: 300,
  },

  improvementAreas: [
    {
      type: String,
      enum: ["skills", "availability", "interest", "other"],
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);