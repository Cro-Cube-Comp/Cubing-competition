const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
const defaultCsrfTokenLength =
  parseInt(process.env.DEFAULT_CSRF_TOKEN_LENGTH) || 32;
/**
 *
 * @param {number} length - length of the token in characters
 * @returns {string} - the token
 */
function createCsrfToken(length = defaultCsrfTokenLength) {
  if (typeof length !== "number") {
    throw new Error("Invalid argument: length must be a number.");
  }
  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex");
}
/**
 *
 * @param {Express.Request} req - the request object
 * @param {Express.Response} res - the response object
 * @param {Express.NextFunction} next - the next function
 * @returns {void}
 */
function csrfProtection(req, res, next) {
  try {
    if (!req.session.csrfToken) {
      throw new Error(
        "csrfProtection middleware got called, but request session does not have a csrfToken"
      );
    }
    const token =
      req.body.csrfToken || req.headers["x-csrf-token"] || req.query.csrfToken;
    if (!token) {
      return res.status(403).json({
        message: "Missing CSRF token",
      });
    }
    if (token !== req.session.csrfToken) {
      return res.status(401).json({
        message: "Invalid CSRF token",
      });
    }
    return next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
module.exports = { csrfProtection, createCsrfToken };
