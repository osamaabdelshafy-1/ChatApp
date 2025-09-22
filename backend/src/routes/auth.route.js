const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.route("/signup").post(authController.signUp);

router.route("/signin").post((req, res) => {
  res.send("signin");
});

router.route("/logout").post((res, req) => {
  res.json("login");
});

module.exports = router;
