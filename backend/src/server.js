const express = require("express");
const authRoutes = require("./routes/auth.route");
const connectDB = require("./lib/db");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 3000;

// connect to DB before server listening  to port for running the app
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port: ${PORT}`);
    });
  })
  .catch((e) => {
    console.log("Failed to connect to mongoDB:", e.message);
    process.exit(1);
  });
