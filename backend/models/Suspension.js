const mongoose = require("mongoose");

const SuspensionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  reason: String,
  additionalComments: String,
  suspendDate: Date,
  suspendedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin" // if admin is separate, otherwise "Student" as placeholder
  }
}, { timestamps: true });

module.exports = mongoose.model("Suspension", SuspensionSchema);