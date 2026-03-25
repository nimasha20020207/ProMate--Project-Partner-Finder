const express =require("express");
const cors = require("cors");
const dbconnection=require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

//DB connection
dbconnection();

app.get("/",(req,res)=>res.send("Server is running.."));

const PORT=3000;

//admin
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

app.listen(PORT,()=>console.log(`Server running on PORT ${PORT}`));