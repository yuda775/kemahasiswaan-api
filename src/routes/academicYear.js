const express = require("express");
const router = express.Router();

const academicYearService = require("../service/academicYear");

router.get("/", academicYearService.getAcademicYears);
router.post("/", academicYearService.createAcademicYear);
router.patch("/:id", academicYearService.updateAcademicYear);
router.delete("/:id", academicYearService.deleteAcademicYear);
router.patch("/set-active/:id", academicYearService.setActiveAcademicYear);

module.exports = router;
