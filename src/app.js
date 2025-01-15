// src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Sample route to check if server is working
app.get("/", (req, res) => {
  res.send("Welcome to Kemahasiswaan API");
});

app.use("/api/admin", require("./routes/admin"));
app.use("/api/student", require("./routes/student"));
app.use("/api/student-affairs", require("./routes/studentAffairs"));
app.use("/api/student-activity", require("./routes/studentActivity"));
app.use("/api/proposal", require("./routes/proposal"));
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
