const express = require("express");
const cors = require("cors");
const dbconnection = require("./config/db");

const app = express();

// DB connection
dbconnection();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json()); // ✅ REQUIRED

// Test route
app.get("/", (req, res) => res.send("Server is running.."));

// recommendation Routes
const recommendationRoutes = require("./routes/recommendationRoutes");
app.use("/api/recommendations", recommendationRoutes);

//feedback routes
const feedbackRoutes = require("./routes/feedbackRoutes"); // ✅ fixed name
app.use("/api/feedback", feedbackRoutes);

// Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));