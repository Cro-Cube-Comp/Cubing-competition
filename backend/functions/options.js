// This file contains functions that are used to get options that are set in .env file
// For example, DISABLE_RATE_LIMITING
// Empty string or undefined = enabled
// any string other than empty string = disabled
const dotenv = require("dotenv");
dotenv.config();
const isRateLimitingEnabled = !Boolean(process.env.DISABLE_RATE_LIMITING);
const isCorsEnabled = !Boolean(process.env.DISABLE_CORS);
module.exports = {
  isRateLimitingEnabled,
  isCorsEnabled,
};
