const express = require("express");
const router = express.Router();
const User = require("../../Models/user");
const dotenv = require("dotenv");
const loginLimiter = require("../../rateLimiter/login");
dotenv.config();

router.post("/", loginLimiter, async (req, res) => {
  try {
    if (req.session.user) {
      return res.status(400).json({
        message: "Korisnik je prijavljen.",
      });
    }
    const { username, password } = req.body;

    // Validate the input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Korisničko ime i lozinka su obavezni." });
    }

    // Find the user by username
    const user = await User.findOne({ username: { $eq: username } });
    // Check if the user exists
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ message: "Korisničko ime ili lozinka nisu ispravni." });
    }
    // Authenticate the user
    req.session.user = {
      id: user._id.toString(),
      username: username,
      role: user.role,
    };
    res.status(200).json({
      message: "Korisnik se uspješno prijavio.",
      info: { id: user._id, username: username, role: user.role },
    });
  } catch (err) {
    // Log the error for internal debugging, but don't expose details to the client
    console.error(`Error in login:\n ${err}`);
    res.status(500).json({ message: "Došlo je do pogreške na poslužitelju." });
  }
});

module.exports = router;
