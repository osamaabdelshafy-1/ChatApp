const express = require("express");
const authRoutes = require("./routes/auth.route");
const connectDB = require("./lib/db");
const httpsStatusText = require("./utils/httpsStatusText");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.use("/api" , (req, res) => {

  return res.status(404).json({
    status: httpsStatusText.ERROR,
    data: null,
    message: "Route not found",
  });
});
app.use((error, req, res, next) => {

  return res.status(error.statusCode || 500).json({
    status: error.statusText || httpsStatusText.ERROR,
    data: null,
    message: error.message || "Internal Server Error",
    code: error.statusCode || 500,
  });
});
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
