const Student = require("../models/StudentsMock");
const Project = require("../models/ProjectsMock");
const Request = require("../models/RequestsMock");

exports.getReports = async (req, res) => {
  const totalStudents = await Student.countDocuments();
  const totalProjects = await Project.countDocuments();
  const totalRequests = await Request.countDocuments();
  const pendingRequests = await Request.countDocuments({ status: "Pending" });

  res.json({
    totalStudents,
    totalProjects,
    totalRequests,
    pendingRequests
  });
};