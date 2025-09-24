const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const generateToken = require("../utils/generateToken.js");
const sendMail = require("../emails/emailSend.js");
const asyncWrapper = require("../middlewares/asyncWrapper.js");
const appError = require("../utils/appError.js");
const httpsStatusText = require("../utils/httpsStatusText.js");
const cloudinary = require("../lib/cloudinary.js");
const ENV = require("../lib/env.js");

const signUp = asyncWrapper(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    const error = appError.create(
      "All fields are required",
      400,
      httpsStatusText.FAIL
    );

    return next(error);
  }
  if (password.length < 6) {
    return next(
      appError.create(
        "password must be at least 6 characters",
        400,
        httpsStatusText.FAIL
      )
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return next(
      appError.create("Invalid email format", 400, httpsStatusText.FAIL)
    );
  }
  const user = await User.findOne({ email });
  if (user) {
    return next(
      appError.create("email already exits !", 400, httpsStatusText.FAIL)
    );
  }

  //convert the password to hashed password for encryption
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create the user
  const newUser = new User({ fullName, email, password: hashedPassword });

  if (!newUser) {
    return next(
      appError.create("Invalid user data", 400, httpsStatusText.FAIL)
    );
  }

  //save the user in the database
  const savedUser = await newUser.save();

  if (!savedUser) {
    return next(
      appError.create(
        "User doesn't be saved in  DB!",
        500,
        httpsStatusText.ERROR
      )
    );
  }

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

  //   //sending welcome email by resend
  //   try {
  //     await sendWelcomeEmail(
  //       newUser.email,
  //       newUser.fullName,
  //       process.env.CLIENT_URL
  //     );
  //     console.log("calling the function");
  //   } catch (e) {
  //     console.error("failed to send welcome email,", e.message);
  //   }

  try {
    await sendMail(newUser.fullName, newUser.email, process.env.CLIENT_URL);
  } catch (error) {
    console.log(error.message);
  }
});

const logIn = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password"); //include the password on the result

  if (!user)
    return next(
      appError.create("Invalid credentials", 400, httpsStatusText.FAIL)
    );

  const checkedPassword = await bcrypt.compare(password, user.password);
  if (!checkedPassword)
    return next(
      appError.create("Invalid credentials", 400, httpsStatusText.FAIL)
    );

  generateToken(user._id, res);

  res.status(200).json({
    data: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    },
    message: "user is registered",
  });
});

const logOut = asyncWrapper(async (_, res, next) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "logged out successfully" });
});

const updateProfile = asyncWrapper(async (req, res, next) => {
  const userId = req.user._id;
  const prevProfilePicId = req.user.profilePicId;
  //upload the file as form-data
  if (!req.file) {
    return next(
      appError.create(
        "No profile picture is uploaded",
        400,
        httpsStatusText.FAIL
      )
    );
  }

  const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
    folder: "profiles",
  });

  //if no error happing on operation of uploading
  if (uploadResponse) {
    if (prevProfilePicId) {
      //destroy the previous photo after the upload the new one
      await cloudinary.uploader.destroy(prevProfilePicId);
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      profilePic: uploadResponse.secure_url,
      profilePicId: uploadResponse.public_id, // store the Id of picture on cloudinary cloud to remove it in case of update & upload the new one
    },
    { new: true } // return the new object updated user .
  );

  if (!updatedUser) {
    // delete by public_id : in case of error on updating the user .
    try {
      await cloudinary.uploader.destroy(uploadResponse.public_id);
    } catch (error) {
      console.log(
        "error happen in cloudinary server on deleting the photo",
        error.message
      );
    }

    return next(appError.create("User not found", 404, httpsStatusText.FAIL));
  }

  res.status(200).json({
    data: updatedUser,
    statusText: httpsStatusText.SUCCESS,
    message: "The user profile picture is updated successfully",
  });
});

module.exports = { signUp, logIn, logOut, updateProfile };
