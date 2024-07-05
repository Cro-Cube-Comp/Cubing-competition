const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const isCorsEnabled = require("./functions/options").isCorsEnabled;

const compression = require("compression");

const generalLimiter = require("./rateLimiter/general");
const isRateLimitingEnabled =
  require("./functions/options").isRateLimitingEnabled;

console.log(`Running ${__filename}`);
// Load the environment variables from the .env file
dotenv.config();

// Create an express app
const app = express();
// Use JSON middleware to parse the request body
app.use(express.json());
if (isRateLimitingEnabled) {
  app.set("trust proxy", 1);
  app.use(generalLimiter);
} else {
  console.warn(
    "Rate limiting is disabled. It's recommended to enable it. Use only for development purposes."
  );
}
if (isCorsEnabled) {
  app.use(cors(corsOptions));
} else {
  console.warn(
    "CORS is disabled. It's recommended to enable it. Use only for development purposes."
  );
}
const compressionOptions = {
  level: 8,
  threshold: 100 * 1024, // Ignore smaller than 100KB
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) {
      // don't compress responses with this request header
      return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
  },
};
app.use(compression(compressionOptions));
// Connect to the MongoDB database using mongoose
console.log("Trying to connect to mongoDB...");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {})
  .catch((err) => console.error("Failed to connect to MongoDB: \n" + err));
// Redirect
app.get("/", (req, res) => {
  return res.redirect(308, "https://cutt.ly/CroComp");
});
// register and login
app.use("/register", require("./routes/users/register"));
app.use("/login", require("./routes/users/login"));
// admin
app.use("/admin/assign", require("./routes/admin/assign"));
// solves
app.use("/solves/add", require("./routes/solves/add"));
app.use("/solves/delete", require("./routes/solves/delete"));
app.use("/solves/get", require("./routes/solves/get"));
// users
app.use("/users", require("./routes/users/all"));
app.use("/users", require("./routes/users/get"));
app.use("/users", require("./routes/users/delete"));
app.use("/users", require("./routes/users/change-password"));
// Posts
app.use("/posts", require("./routes/posts/new"));
app.use("/posts", require("./routes/posts/get"));
app.use("/posts", require("./routes/posts/delete"));
app.use("/posts", require("./routes/posts/edit"));
// Results in excel
app.use("/results", require("./routes/excel/results"));
// Winner
app.use("/winner", require("./routes/winner/announce"));
app.use("/winner", require("./routes/winner/get"));
// Scrambles
app.use("/scrambles", require("./routes/scrambles/passwords"));
// Token validation
app.use("/token", require("./routes/token/validate"));
app.use("/health-check", require("./routes/health_check/health_check"));
// Competitions
app.use("/competitions", require("./routes/competitions/create"));
app.use("/competitions", require("./routes/competitions/get"));
app.use("/backup", require("./routes/backup/get"));
// Start the server on the specified port
const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
