
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const { sendOTP } = require("../utils/mailer");
const auth = require("../middleware/auth"); // You'll need to create this

router.post("/register", async (req, res) => {
    const { fullName, studentId, email, password, department, yearOfStudy, degreeProgram, specialization, semester, bio, contactNumber, preferredRoles } = req.body;

    try {
        // Basic validation
        if (!fullName || !studentId || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (studentId.length !== 10) {
            return res.status(400).json({ message: "Student ID must be exactly 10 characters" });
        }

        const emailRegex = /^\S+@\S+\.\S+$/i;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }

        // Check if user already exists
        let existingUser = await Student.findOne({ 
            $or: [{ email }, { studentId }] 
        });
        
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email already in use" });
            }
            if (existingUser.studentId === studentId) {
                return res.status(400).json({ message: "Student ID already in use" });
            }
        }

        let user = new Student({
            fullName,
            studentId,
            email,
            password,
            department,
            degreeProgram,
            bio,
            contactNumber: contactNumber || "",
            preferredRoles: preferredRoles || [],
            academicInfo: {
                specialization: specialization || "",
                year: yearOfStudy ? parseInt(yearOfStudy.toString().replace(/\D/g, ''), 10) : null,
                semester: semester ? parseInt(semester.toString().replace(/\D/g, ''), 10) : null
            }
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || "promate_secret_key",
            { expiresIn: 3600000 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        email: user.email,
                        studentId: user.studentId,
                        role: user.role
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({ 
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use` 
            });
        }
        res.status(500).json({ message: "Server error during registration" });
    }
});

// @route   POST api/auth/check-availability
// @desc    Check if email or studentId is already taken
// @access  Public
router.post("/check-availability", async (req, res) => {
    const { email, studentId } = req.body;
    console.log(`Checking availability for: ${email || studentId}`);

    try {
        if (email) {
            const user = await Student.findOne({ email });
            return res.json({ 
                available: !user, 
                message: user ? "This email is already registered" : "Email is available" 
            });
        }

        if (studentId) {
            const user = await Student.findOne({ studentId });
            return res.json({ 
                available: !user, 
                message: user ? "Student ID already in use" : "Student ID is available" 
            });
        }

        return res.status(400).json({ message: "Email or Student ID is required" });
    } catch (err) {
        console.error("Availability check error:", err.message);
        res.status(500).json({ message: "Server error during availability check" });
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
    const { identifier, password } = req.body;

    try {
        if (!identifier || !password) {
            return res.status(400).json({ message: "Email/ID and password are required" });
        }

        // Check user by email or studentId
        let user = await Student.findOne({
            $or: [{ email: identifier }, { studentId: identifier }]
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email/ID or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email/ID or password" });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || "promate_secret_key",
            { expiresIn: 3600000 },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        email: user.email,
                        studentId: user.studentId,
                        role: user.role,
                        department: user.department,
                        degreeProgram: user.degreeProgram,
                        academicInfo: user.academicInfo,
                        skills: user.skills,
                        availability: user.availability,
                        interests: user.interests,
                        preferredRoles: user.preferredRoles,
                        contactNumber: user.contactNumber,
                        profilePhoto: user.profilePhoto
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error during login" });
    }
});

// @route   GET api/auth/me
// @desc    Get current user data
// @access  Private
router.get("/me", auth, async (req, res) => {
    try {
        const user = await Student.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
    try {
        const user = await Student.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true }
        ).select("-password");
        res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST api/auth/forgot-password
// @desc    Generate OTP and send email
// @access  Public
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) return res.status(400).json({ message: "Email is required" });
        
        let user = await Student.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Expire in 15 minutes
        user.resetPasswordOtp = otpCode;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        await sendOTP(email, otpCode);

        res.json({ message: "OTP sent to your email" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST api/auth/verify-otp
// @desc    Verify incoming OTP Code
// @access  Public
router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });
        
        let user = await Student.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.resetPasswordOtp !== otp || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        res.json({ message: "OTP verified successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   POST api/auth/reset-password
// @desc    Use verified OTP to set new password
// @access  Public
router.post("/reset-password", async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields required" });
        }
        
        let user = await Student.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.resetPasswordOtp !== otp || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordOtp = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;