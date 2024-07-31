const express = require("express");
const verifyUser = require("../../middleware/verifyUser");
const router = express.Router();
router.get("/validate", verifyUser, (req, res) => {
  try {
    res.status(200).json({ message: "Session is valid" });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500);
  }
});
module.exports = router;
