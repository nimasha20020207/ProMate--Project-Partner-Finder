const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Student = require("../models/Student");

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            return res.json({ role: 'admin', email: req.user.email, fullName: "Administrator" });
        }

        const profile = await Student.findById(req.user.id).select("-password");
        if (!profile) {
            return res.status(400).json({ message: "There is no profile for this user" });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   PUT api/profile
// @desc    Update user profile details
// @access  Private
router.put("/", auth, async (req, res) => {
    try {
        // Only update fields that exist in the body
        let updateData = { ...req.body };
        // Prevent updating password, identifiers, and MongoDB internals via this route
        delete updateData._id;
        delete updateData.__v;
        delete updateData.password;
        delete updateData.email;
        delete updateData.studentId;

        let profile = await Student.findById(req.user.id);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        profile = await Student.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true }
        ).select("-password");

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/profile/:user_id
// @desc    Get profile by user ID (Public View)
// @access  Public (or Private depending on requirements, let's keep it Private so only logged in students can see)
router.get("/:user_id", auth, async (req, res) => {
    try {
        const isObjectId = req.params.user_id.match(/^[0-9a-fA-F]{24}$/);
        const query = isObjectId ? { _id: req.params.user_id } : { studentId: req.params.user_id };
        const profile = await Student.findOne(query).select(
            "-password -availability.preferredTime -availability.preferredDays" // Hide some private details
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(400).json({ message: "Profile not found" });
        }
        res.status(500).send("Server Error");
    }
});

// @route   GET api/profile
// @desc    Get all profiles (limit for discovery/search)
// @access  Private
router.get("/", auth, async (req, res) => {
    try {
        const profiles = await Student.find().select("-password");
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/profile/upload
// @desc    Upload user profile picture
// @access  Private
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, req.user.id + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post("/upload", auth, upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        
        // Return the constructed image URL
        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        
        // Update user profile picture in DB immediately
        let profile = await Student.findByIdAndUpdate(
            req.user.id,
            { $set: { profilePicture: imageUrl } },
            { new: true }
        ).select("-password");

        res.json({ message: "Image uploaded successfully", url: imageUrl, profile });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/profile/delete-account
// @desc    Delete user account
// @access  Private
router.post("/delete-account", auth, async (req, res) => {
    const { password } = req.body;
    try {
        const student = await Student.findById(req.user.id);
        if (!student) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password. Account deletion denied." });

        await Student.findByIdAndDelete(req.user.id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

const bcrypt = require("bcryptjs");
// @route   PUT api/profile/me/password
// @desc    Change user password
// @access  Private
router.put("/me/password", auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const student = await Student.findById(req.user.id);
        if (!student) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, student.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid current password" });

        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(newPassword, salt);
        await student.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
