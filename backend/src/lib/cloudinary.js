//import v2  name space from the package
const { v2 } = require("cloudinary");

//sett the config to use the service of the cloud
v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = v2;
