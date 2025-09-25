// arcjet is  written to import it only with ECS6 <import key word> ;
// so you can not use <require> func .
// we will use a dynamic  import

const ENV = require("./env");

let aj;
async function getArcjet() {
  if (aj) return aj; // reuse the instance if it is cashed ;

  //import from the package // this is the dynamic import
  const {
    default: arcjet,
    detectBot,
    slidingWindow,
    shield,
  } = await import("@arcjet/node");

  aj = arcjet({
    key: ENV.ARCJET_KEY, //to call the cloud and use it functions
    //rules to make the SDK of arcjet work as you want .
    rules: [
      shield({ mode: "LIVE" }), //to protects the app from common attacks like e.g SQL injection
      //create a bot detection Rule , prevent any bot to access the website
      detectBot({
        mode: ENV.ARCJET_ENV==="production"? "LIVE":"DRY_RUN", //blocks the requests. for logging only use DRY_RUN .

        //block all bots except the following.
        allow: [
          // this bots only has the access to make a request.
          "CATEGORY:SEARCH_ENGINE", // google , bing , etc
          //   "POSTMAN" // we say don't block postman
          //you can add other bots here  , ex :AI , etc
          //you can add other bots here  , ex :AI , etc
          //you can add other bots here  , ex :AI , etc
        ],
      }),
      slidingWindow({
        mode: "LIVE",
        max: 100,
        interval: 60, // 60s = 1minute
      }),
    ]
  });
  return aj;
}

// exports the function that make the config of arcjet.
module.exports = getArcjet;
