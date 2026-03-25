const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  studentFullName: String,
  projectTitle: String,
  roleRequested: String,
  status: { type: String, default: "Pending" } // Pending / Accepted / Rejected
});

module.exports = mongoose.model("RequestsMock", requestSchema);