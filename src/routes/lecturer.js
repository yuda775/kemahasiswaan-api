const express = require("express");
const router = express.Router();
const lecturerService = require("../service/lecturer");

router.get("/", lecturerService.getLecturers);
router.post("/", lecturerService.createLecturer);
router.patch("/:id", lecturerService.updateLecturer);
router.delete("/:id", lecturerService.deleteLecturer);

router.post("/login", lecturerService.login);
router.patch("/change-password/:id", lecturerService.changePassword);

module.exports = router;
