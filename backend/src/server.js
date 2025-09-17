const express = require("express");
const app = express();
const authRoutes = require("./routes/auth.route");

require("dotenv").config();

app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
