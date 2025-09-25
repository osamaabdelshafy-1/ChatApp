const httpsStatusText = require("../utils/httpsStatusText");
const appError = require("../utils/appError");
const getArcjet = require("../lib/arcjet");
async function loadIsSpoofedBot() {
  const { isSpoofedBot } = await import("@arcjet/inspect");
  return isSpoofedBot;
}

//will return error because it think postman is a bot
//handle it at the arcjet file in configuration

module.exports = async (req, res, next) => {
  try {
    // await the Arcjet instance
    const aj = await getArcjet();

    // run protection
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return next(
          appError.create(
            "Rate limit exceeded. please try again later.",
            429,
            httpsStatusText.ERROR
          )
        );
      } else if (decision.reason.isBot()) {
        return next(
          appError.create("Bot access denied", 403, httpsStatusText.ERROR)
        );
      } else {
        return next(
          appError.create(
            "Access denied by security policy",
            403,
            httpsStatusText.ERROR
          )
        );
      }
    }

    //check for spoofed bots , it is a bots behave like humans and it is so difficult to detect it
    const isSpoofedBot = await loadIsSpoofedBot();
    if (decision.results.some(isSpoofedBot)) {
      return next(
        appError.create("spoofed bot detected", 403, httpsStatusText.ERROR)
      );
    }

   
    //nothing is detected >> go to the next handler.
    next();
  } catch (error) {
    console.log("Arcjet protection Error:", error);
  }
};
