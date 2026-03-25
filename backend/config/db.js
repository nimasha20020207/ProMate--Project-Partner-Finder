const mongoose = require("mongoose");

const dns=require("dns"); dns.setServers(["1.1.1.1","8.8.8.8"]);
//const dburl="mongodb+srv://it23259584_db_user:FvhFJL6ufxdrM9mh@cluster0.jrpbwzi.mongodb.net/?appName=Cluster0";
const dburl = "mongodb+srv://it23259584_db_user:FvhFJL6ufxdrM9mh@cluster0.jrpbwzi.mongodb.net/ProMateDB?retryWrites=true&w=majority";

mongoose.set("strictQuery",true,"useNewUrlParser",true);

const connectDB = async () => {
  try {
    await mongoose.connect(dburl);
    console.log("MongoDB connected");
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};

module.exports = connectDB;