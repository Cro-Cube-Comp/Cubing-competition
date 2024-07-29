console.log(`Running ${__filename}`);
console.time("Imports");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const session = require("express-session");

const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const isCorsEnabled = require("./config/isCorsEnabled");

const compression = require("compression");
const compressionFilter = require("./config/compressionFilter");

const generalLimiter = require("./rateLimiter/general");
const isRateLimitingEnabled = require("./config/isRateLimitingEnabled");

console.timeEnd("Imports");
// Load the environment variables from the .env file
dotenv.config();
// Create an express app
const app = express();
// Use JSON middleware to parse the request body
app.use(express.json());
// Rate limiting middleware
if (isRateLimitingEnabled) {
  app.set("trust proxy", 1);
  app.use(generalLimiter);
} else {
  console.warn(
    "Rate limiting is disabled. It's recommended to enable it. Use only for development purposes."
  );
}
// CORS middleware
if (isCorsEnabled) {
  app.use(cors(corsOptions));
} else {
  console.warn(
    "CORS is disabled. It's recommended to enable it. Use only for development purposes."
  );
}
// Compression middleware
const compressionOptions = {
  filter: compressionFilter,
};
app.use(compression(compressionOptions));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    secure: !process.env.UNSECURE_COOKIES, // Use secure cookies in production
  })
);
// Connect to the MongoDB database using mongoose
console.log("Trying to connect to mongoDB...");
try {
  console.time("Connect to MongoDB");
  await mongoose.connect(process.env.MONGO_URI);
  console.timeEnd("Connect to MongoDB");
} catch (error) {
  console.error("Failed to connect to MongoDB: \n" + error);
  process.exit(1);
}
console.log("Connected to MongoDB");
console.time("Routes");
// Register and login
app.use("/register", require("./routes/users/register"));
app.use("/login", require("./routes/users/login"));
// Admin
app.use("/admin/assign", require("./routes/admin/assign"));
// Solves
app.use("/solves/add", require("./routes/solves/add"));
app.use("/solves/delete", require("./routes/solves/delete"));
app.use("/solves/get", require("./routes/solves/get"));
// Users
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
// Competitions
app.use("/competitions", require("./routes/competitions/create"));
app.use("/competitions", require("./routes/competitions/get"));
app.use("/competitions", require("./routes/competitions/delete"));
app.use("/competitions", require("./routes/competitions/edit"));
app.use("/competitions", require("./routes/competitions/lock"));
// Token validation
app.use("/token", require("./routes/token/validate"));
// Health check
app.use("/health-check", require("./routes/health_check/health_check"));
// Backup
app.use("/backup", require("./routes/backup/get"));
console.timeEnd("Routes");
// Start the server on the specified port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
