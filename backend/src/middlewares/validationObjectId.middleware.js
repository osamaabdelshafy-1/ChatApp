const mongoose = require("mongoose");
const appError = require("../utils/appError");
const httpsStatusText = require("../utils/httpsStatusText");

module.exports = (paramName) => {
  return (req, res, next) => {
    const val = req.params[paramName];
    // check the object is valid
    if (!mongoose.Types.ObjectId.isValid(val)) {
      return next(
        appError.create("Invalid user id.", 100, httpsStatusText.FAIL)
      );
    }
    next();
  };
};
