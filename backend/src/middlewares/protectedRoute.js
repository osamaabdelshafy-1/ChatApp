const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const httpsStatusText = require("../utils/httpsStatusText");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return next(
        appError.create(
          "unauthorized - no token provided",
          401,
          httpsStatusText.FAIL
        )
      );
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return next(
        appError.create(
          "unauthorized - Invalid provided",
          401,
          httpsStatusText.FAIL
        )
      );
    }
    const user = await User.findById(decodedToken.userId).select("-password") //get user from db and exclude the password field.
    if (!user) {
      return next(
        appError.create("user is not found", 404, httpsStatusText.FAIL)
      );
    }

    req.user = user; //  include the user in the req to use it in the next middleware | handler
    next();
  } catch (error) {
    console.log(error.message);
  }
};
