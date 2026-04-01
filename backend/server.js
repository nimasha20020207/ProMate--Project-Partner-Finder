const express =require("express");
const dbconnection=require("./config/db");
const routes = require("./routes/posts");
const notificationRoutes = require("./routes/notifications");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors({origin:true, Credentials:true}));


//DB connection
dbconnection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.get("/",(req,res)=>res.send("Server is running.."));
app.use("/api/posts",routes);
app.use("/api/notifications", notificationRoutes);

const PORT=3000;

app.listen(PORT,()=>console.log(`Server running on PORT ${PORT}`));