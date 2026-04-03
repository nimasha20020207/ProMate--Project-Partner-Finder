const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Suspension = require("../models/Suspension");
const Student = require("../models/Student");

// Suspend student
router.post("/suspend/:id", auth, async (req, res) => {
  try {
    const { reason, additionalComments, suspendDate } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: "Student not found" });

    const suspension = new Suspension({
      studentId: student._id,
      reason,
      additionalComments,
      suspendDate,
      suspendedBy: req.user.id
    });

    await suspension.save();

    // Remove student from active list
    await Student.findByIdAndDelete(req.params.id);

    res.json({ msg: "Student suspended successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error suspending student" });
  }
});

// Get all suspensions
router.get("/suspensions", auth, async (req, res) => {
  try {
    const suspensions = await Suspension.find()
      .populate("studentId", "fullName studentId email")
      .sort({ createdAt: -1 });

    res.json(suspensions);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching suspensions" });
  }
});

module.exports = router;