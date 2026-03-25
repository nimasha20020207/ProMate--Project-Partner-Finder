const mongoose = require("mongoose");

const projectMockSchema = new mongoose.Schema({
  title: String,
  description: String,
  teamSize: Number,
  projectType: String,
  academicConstraints: {
    specialization: [String],
    year: Number,
    semester: Number,
    minimumCGPA: Number
  },
  essentialSkills: {
    languages: [String],
    frameworks: [String],
    libraries: [String],
    databases: [String],
    tools: [String]
  },
  optionalSkills: {
    languages: [String],
    frameworks: [String],
    libraries: [String],
    databases: [String],
    tools: [String]
  },
  requiredRoles: [String],
  availabilityRequirement: {
    weeklyHours: Number,
    meetingDays: [String],
    durationWeeks: Number
  },
  domain: [String]
}, { timestamps: true });

module.exports = mongoose.model("Project", projectMockSchema);