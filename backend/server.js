const express = require("express");
const dbconnection = require("./config/db");

const app = express();

const path = require('path');

// Middleware
app.use(express.json({ extended: false }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS headers if needed natively or using cors package
const cors = require('cors');
app.use(cors());

// DB connection
dbconnection();

app.get("/", (req, res) => res.send("Server is running.."));

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));