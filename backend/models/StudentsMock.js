const mongoose = require("mongoose");

const studentMockSchema = new mongoose.Schema({
  fullName: String,
  studentId: String,
  email: String,
  degreeProgram: String,
  department: String,
  academicInfo: {
    specialization: String,
    year: Number,
    semester: Number,
    cgpa: Number
  },
  skills: {
    languages: [String],
    frameworks: [String],
    libraries: [String],
    databases: [String],
    tools: [String]
  },
  availability: {
    weeklyHours: Number,
    preferredDays: [String],
    preferredTime: [String]
  },
  interests: [String],
  preferredRoles: [String]
}, { timestamps: true });

module.exports = mongoose.model("StudentsMock", studentMockSchema);