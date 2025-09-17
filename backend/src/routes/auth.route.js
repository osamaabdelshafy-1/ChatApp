const express = require("express");
const router = express.Router();

router.route("/signup").post((req, res) => {
  res.send("hello");
});

router.route("/signin").post((req, res) => {
  res.send("signin");
});

router.route("/logout").post((res, req) => {
  res.json("login");
});

module.exports = router;
