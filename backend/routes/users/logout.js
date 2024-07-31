const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
  try {
    if (!req.session) {
      return res.status(400).json({
        message: "User is not logged in.",
      });
    }
    req.session.destroy((err) => {
      if (err) {
        throw new Error(`Error destroying session: \n${err}`);
      }
    });
    // Clear the session cookie on the client side
    res.clearCookie("connect.sid");

    return res.status(200).json({
      message: "Successfully logged out.",
    });
  } catch (error) {
    console.error(`Error logging out user: \n${error}`);
    return res.status(500).json({
      message: "There was an error logging out.",
    });
  }
});
module.exports = router;
