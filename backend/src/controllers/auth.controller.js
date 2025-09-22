const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const generateToken = require("../utils/generateToken.js");
const sendWelcomeEmail = require("../emails/emailHandler.js");
const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName | !email | !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format. " });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email has already exited" });
    }

    //convert the password to hashed password for encryption
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the user
    const newUser = new User({ fullName, email, password: hashedPassword });
    if (newUser) {
      //save the user in the database
      const savedUser = await newUser.save();

      //generate a token to use it for accessing the routes
      // payload , res object to save the token inside it
      generateToken(savedUser._id, res);
      res.status(201).json({
        data: {
          _id: savedUser._id,
          fullName: savedUser.fullName,
          email: savedUser.email,
          profilePic: savedUser.profilePic,
        },
        message: "A new user is registered. ",
      });
      //sending welcome email
      try {
        await sendWelcomeEmail(
          newUser.email,
          newUser.fullName,
          process.env.CLIENT_URL
        );
        console.log("calling the function");
      } catch (e) {
        console.error("failed to send welcome email,", e.message);
      }
    } else {
      return res.status(400).json({
        message: "Invalid user data.",
      });
    }
  } catch (e) {
    console.log("Error in operation of the singUp ,", e.message);
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = { signUp };
