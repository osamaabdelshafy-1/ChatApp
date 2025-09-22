const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const { MONGO_URL } = process.env;
    if (!MONGO_URL) throw new Error("MONGO_URL is not set to .env");
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("MONGODB CONNECTED:", conn.connection.host);
  } catch (e) {
    console.error("Error connection t MONGODB", e.message);
    process.exit(1); // terminate the running scripts or all project
  }
};
module.exports = connectDB;
