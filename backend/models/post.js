const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({

  title: {
    type: String
  },

  description: {
    type: String
  },

  teamSize: {
    type: Number
  },

  projectType: {
    type: String
  },

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

module.exports = Post =mongoose.model("project", ProjectSchema);