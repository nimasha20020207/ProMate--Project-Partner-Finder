const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  studentId: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^it\d{8}$/i.test(v);
      },
      message: props => `${props.value} is not a valid student ID! It must be 'IT' followed by exactly 8 digits.`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  isEmailVerified: { type: Boolean, default: false },
  resetPasswordOtp: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  password: { type: String, required: true },
  degreeProgram: { type: String, default: "" },
  department: { type: String, default: "" },
  bio: { type: String, default: "" },

  academicInfo: {
    specialization: { type: String, default: "" },
    year: { type: Number, default: null },
    semester: { type: Number, default: null },
    cgpa: { type: Number, default: null }
  },

  profilePicture: { type: String, default: "" },

  socialLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" }
  },

  skills: {
    languages: [String],
    frameworks: [String],
    libraries: [String],
    databases: [String],
    tools: [String]
  },

  availability: {
    weeklyHours: { type: Number, default: null },
    preferredDays: [String],
    preferredTime: [String] // allow multiple times
  },

  interests: [String], // multiple domains
  preferredRoles: [String] // multiple roles

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
