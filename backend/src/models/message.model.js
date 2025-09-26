const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // make a reference ID to the User model that contains all user
      require: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    text: {
      type: String,
      required: false,
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

//make an indexes to faster the operation of searching
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, senderId: 1, createdAt: -1 });

//require at least one of the text or image.
messageSchema.pre("validate", function (next) {
  if (!this.text && !this.image) {
    return next(new Error("Either text or image is required"));
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
