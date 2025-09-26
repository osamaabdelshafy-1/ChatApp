const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messages.controller");
const protectedRoute = require("../middlewares/protectedRoute");
const arcjectProtection = require("../middlewares/arcject.middleware");

// the req will move on the this middleware before go to it route
//we protect the route<rate limiting & bot detection>  before authorize it
// in case it is a hacker or bot => block it before hitting the auth middleware
router.use(arcjectProtection, protectedRoute);

//make sure you set the routes in  the right order.
router.get("/contacts", messagesController.getAllContacts);
router.get("/chats", messagesController.getChatsPartners);
router.get("/:id", messagesController.getMessagesByUserId);
router.post("/send/:id", messagesController.sendMessage);

module.exports = router;
