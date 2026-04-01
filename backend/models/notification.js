const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  senderIt: {
    type: String,
    required: true
  },
  targetIt: {
    type: String
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true // 'join_request', 'accepted', 'rejected'
  }
}, { timestamps: true });

module.exports = mongoose.model("notification", NotificationSchema);
