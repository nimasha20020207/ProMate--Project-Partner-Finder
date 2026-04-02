require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbconnection = require("./config/db");

// Import routes
const recommendationRoutes = require("./routes/recommendationRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const postRoutes = require("./routes/posts");
const notificationRoutes = require("./routes/notifications");
const adminRoutes = require("./routes/adminRoutes"); // from geeth

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB connection
dbconnection();

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get("/", (req, res) => res.send("Server is running.."));

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes); // geeth branch

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));