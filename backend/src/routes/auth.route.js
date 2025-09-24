const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const upload = require("../middlewares/multer");

router.route("/signup").post(authController.signUp);

router.route("/login").post(authController.logIn);

router.route("/logout").post(authController.logOut);

router.put("/updateProfile" ,upload.single("image") , protectedRoute, authController.updateProfile )

router.route("/check").get(protectedRoute, (req, res) =>
  res.status(200).json({
    data: req.user,
    message: "user is authorized",
  })
);
module.exports = router;
