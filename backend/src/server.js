require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./lib/db");
const httpsStatusText = require("./utils/httpsStatusText");
const authRoutes = require("./routes/auth.route");
const messageRoutes = require("./routes/message.route");
const PORT = process.env.PORT || 3000;
const app = express();


app.use(express.json({ limit: "5MB" })); //added limits size to data that will be sended in body.
app.use(cookieParser()); // middleware for parsing the  cookie in case of the authentication
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages" , messageRoutes);


app.use("/api", (req, res) => {
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
