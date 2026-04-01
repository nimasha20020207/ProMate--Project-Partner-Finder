const express = require("express");
const cors = require("cors");
const path = require("path");
const dbconnection = require("./config/db");

const app = express();

// DB connection
dbconnection();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json()); // ✅ REQUIRED

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get("/", (req, res) => res.send("Server is running.."));

// Recommendation Routes
const recommendationRoutes = require("./routes/recommendationRoutes");
app.use("/api/recommendations", recommendationRoutes);

// Feedback Routes
const feedbackRoutes = require("./routes/feedbackRoutes"); // ✅ fixed name
app.use("/api/feedback", feedbackRoutes);

// Auth & Profile Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));