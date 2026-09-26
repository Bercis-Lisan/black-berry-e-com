const mongoose = require("mongoose");

async function connectDB() {
  const uri = "mongodb://bercislisan569_db_user:CpF1Mx826eH3WiGE@ac-alldnvh-shard-00-00.bl96iwa.mongodb.net:27017,ac-alldnvh-shard-00-01.bl96iwa.mongodb.net:27017,ac-alldnvh-shard-00-02.bl96iwa.mongodb.net:27017/blackberry?ssl=true&replicaSet=atlas-l93oxe-shard-0&authSource=admin&appName=Cluster0";
  if (!uri) {
    console.warn("MONGO_URI not set — skipping MongoDB connection.");
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
}

module.exports = connectDB;
