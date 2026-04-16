const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({

  projectId: {
    type: String
  },

  itNumber: {
    type: String
  },

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

  specialization:{
    type: String
  },

  year: { 
    type: Number
  },
  semester: { 
    type: Number
  },
  minimumCGPA: { 
    type: Number 
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

  domain: [String],
  
  dueDate: {
    type: Date
  }

}, { timestamps: true });

module.exports = Post =mongoose.model("project", ProjectSchema);