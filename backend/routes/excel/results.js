const express = require("express");
const User = require("../../Models/user");
const getCompetitionById = require("../../functions/getCompetitionById");
const getResultsInExcel = require("../../routes/excel/results-controller");
const verifyToken = require("../../middleware/verifyToken");
const cache = require("../../middleware/cache");
const isAdmin = require("../../utils/helpers/isAdmin");
const router = express.Router();
router.get(
  "/:competitionId",
  cache(10),
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const users = await User.find();
      const competition = await getCompetitionById(req.params.competitionId);
      const workbook = await getResultsInExcel(users, competition);
      // Set the headers to prompt download on the client side
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

      // Pipe the workbook to the response
      workbook.xlsx.write(res).then(() => {
        res.end();
      });
    } catch (error) {
      console.error("Failed to generate results in excel format:");
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);
module.exports = router;
