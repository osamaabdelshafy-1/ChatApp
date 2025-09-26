const asyncWrapper = require("../middlewares/asyncWrapper");
const Message = require("../models/message.model");
const appError = require("../utils/appError");
const httpsStatusText = require("../utils/httpsStatusText");
const User = require("../models/user.model");
const cloudinary = require("../lib/cloudinary");

const getAllContacts = asyncWrapper(async (req, res, next) => {
  const loggedInUserId = req.user._id;
  if (!loggedInUserId)
    return next(
      appError.create("the user is not logged", 500, httpsStatusText.FAIL)
    );
  //get all users except you
  const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }).select(
    "-password"
  );

  res.status(200).json({
    data: filteredUser,
    message: "all users contacts",
    status: httpsStatusText.SUCCESS,
  });
});

// i want to get the users that i has chat with them
// so in this case i am a sender and receiver .

const getChatsPartners = asyncWrapper(async (req, res, next) => {
  const loggedInUserId = req.user._id;
  if (!loggedInUserId) {
    return next(
      appError.create("the user is not logged", 500, httpsStatusText.FAIL)
    );
  }

  // find all message where the logged-in user is either sender or receiver .
  const messages = await Message.find({
    $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
  }); //the result is an array of messages object <document> .
 
  // use to string because it may be an object . to avoid comparison on references
  //use set to remove the duplicates
  const chatPartnerIds = [
    ...new Set(
      messages.map((msg) =>
        msg.senderId.toString() === loggedInUserId.toString()
          ? msg.receiverId.toString()
          : msg.senderId.toString()
      )
    ),
  ];

  const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select(
    "-password"
  );

  res.status(200).json({
    data: chatPartners,
    message: "All chat partners",
    status: httpsStatusText.SUCCESS,
  });
});

//get your owns chat with other users
const getMessagesByUserId = asyncWrapper(async (req, res, next) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;

  if (!myId) {
    return next(
      appError.create("the user is not logged", 404, httpsStatusText.FAIL)
    );
  }

  //find all messages between my and specific user that i send to him , and he send to me.
  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  }).sort({ createdAt: 1 }); // optional: sort by oldest → newest

  res.status(200).json({
    data: messages,
    messages: "successful  transaction : All messages are fetched ",
    status: httpsStatusText.SUCCESS,
  });
});

const sendMessage = asyncWrapper(async (req, res, next) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  let imageUrl = null;

  if (image) {
    // if there are image upload it
    //upload based64 photo to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "chats_images",
    });
    imageUrl = uploadResponse.secure_url;
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });

  await newMessage.save();

  if (!newMessage) {
    return next(
      appError.create(
        "Error on saving the new message",
        500,
        httpsStatusText.FAIL
      )
    );
  }
  //todo: send message in real-time if user is online -socket.io.
  //implemented later .

  res.status(201).json({
    data: newMessage,
    status: httpsStatusText.SUCCESS,
    message: "Message is saved successfully.",
  });
});

module.exports = {
  getAllContacts,
  getChatsPartners,
  getMessagesByUserId,
  sendMessage,
};
