// src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());

// Sample route to check if server is working
app.get("/", (req, res) => {
  res.send("Welcome to Kemahasiswaan API");
});

app.use("/api/student", require("./routes/Student"));
app.use("/api/program-study", require("./routes/programStudy"));
app.use("/api/academic-year", require("./routes/academicYear"));
app.use("/api/activity-category", require("./routes/activityCategory"));
app.use("/api/lecturer", require("./routes/lecturer"));
app.use("/api/ukm", require("./routes/ukm"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
