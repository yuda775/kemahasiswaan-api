const express = require("express");
const router = express.Router();
const studentAffairsService = require("../service/studentAffairs");

router.post("/login", studentAffairsService.login);

router.get("/", studentAffairsService.getStudentAffairs);
router.post("/", studentAffairsService.createStudentAffair);
router.patch("/:id", studentAffairsService.updateStudentAffair);
router.delete("/:id", studentAffairsService.deleteStudentAffair);

module.exports = router;
