const express = require("express");
const competitions = require("../../Models/competitions");
const isAdmin = require("../../utils/helpers/isAdmin");
const verifyToken = require("../../middleware/verifyToken");
const router = express.Router();
router.put("/edit/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ message: "ID je krivo unesen ili nedostaje." });
  }
  try {
    const competition = await competitions.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (competition) {
      return res.status(200).json({ message: "Natjecanje je izmenjeno." });
    } else {
      return res.status(404).json({ message: "Natjecanje ne postoji." });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Greška prilikom izmenu natjecanja" });
  }
});
module.exports = router;
