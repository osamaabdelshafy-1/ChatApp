const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const upload = require("../middlewares/multer");
const arcjetProtection = require("../middlewares/arcject.middleware.js");

//use the rate limiting middleware in all routes
router.use(arcjetProtection) ; 

router.route("/signup").post(authController.signUp);

router.route("/login").post(authController.logIn);

router.route("/logout").post(authController.logOut);

router.put(
  "/updateProfile",
  upload.single("image"),
  protectedRoute,
  authController.updateProfile
);

router.route("/check").get(protectedRoute, (req, res) =>
  res.status(200).json({
    data: req.user,
    message: "user is authorized",
  })
);



//for testing the rate limiting
// router.get("/test" , arcjetProtection, (req, res) => {
//   res.status(200).json({ test: "done" });
// });

module.exports = router;
