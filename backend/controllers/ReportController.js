const Student = require("../models/StudentsMock");
const Project = require("../models/ProjectsMock");
const Request = require("../models/RequestsMock");

// ✅ Reports
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

// ✅ Specialization Stats (SEPARATE FUNCTION)
exports.getSpecializationStats = async (req, res) => {
  try {
    const stats = await Student.aggregate([
      {
        $group: {
          _id: "$academicInfo.specialization",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          specialization: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};