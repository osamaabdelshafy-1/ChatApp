const jwt = require("jsonwebtoken");
const ENV = require("../lib/env.js");
module.exports = function generateToken(userId, res) {
  //   check the secret key in the .env
  const JWT_SECRET = ENV.JWT_SECRET;

  if (!JWT_SECRET) throw new Error("the JWT_SECRET is not set");

  //    payload , secret key
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
  //cookie name ,value , options
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //  milliseconds
    httpOnly: true, //prevent XSS attacks:cross-site scripting , only access the token by http request , not js from the client side
    sameSite: true, // prevent CSRF attacks
    // http for development
    // https for production => more secure use the tls
    secure: process.env.NODE_ENV === "development" ? false : true,
  });
  return token;
};
