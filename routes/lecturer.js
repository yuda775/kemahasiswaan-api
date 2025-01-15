const express = require("express");
const router = express.Router();
const lecturerService = require("../service/lecturer");

router.get("/", lecturerService.getLecturers);
router.post("/", lecturerService.createLecturer);
router.patch("/:id", lecturerService.updateLecturer);
router.delete("/:id", lecturerService.deleteLecturer);

module.exports = router;
