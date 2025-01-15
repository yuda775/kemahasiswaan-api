const express = require("express");
const router = express.Router();

const programStudyService = require("../service/programStudy");

router.get("/", programStudyService.getProgramStudies);
router.post("/", programStudyService.createProgramStudy);
router.patch("/:id", programStudyService.updateProgramStudy);
router.delete("/:id", programStudyService.deleteProgramStudy);

module.exports = router;
