const Request = require("../models/RequestsMock");

// Get all requests
exports.getRequests = async (req, res) => {
  const requests = await Request.find();
  res.json(requests);
};

// Update request (approve/reject)
exports.updateRequest = async (req, res) => {
  const updated = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};