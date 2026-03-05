const express =require("express");
const dbconnection=require("./config/db");

const app = express();

//DB connection
dbconnection();

app.get("/",(req,res)=>res.send("Server is running.."));

//RecEngine
const recommendationRoutes = require("./routes/recommendationRoutes")
app.use("/api/recommendations",recommendationRoutes)

const PORT=3000;

app.listen(PORT,()=>console.log(`Server running on PORT ${PORT}`));