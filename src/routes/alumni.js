const express = require("express");
const router = express.Router();

const alumniService = require("../service/alumni");

router.get(
  "/questionnaire-submissions",
  alumniService.getQuestionnaireSubmissions
);
router.get(
  "/questionnaire-submissions/:studentId",
  alumniService.getQuestionnaireSubmissionsByAlumni
);
router.post(
  "/questionnaire-submission",
  alumniService.createQuestionnaireSubmission
);
router.patch(
  "/questionnaire-submission/:id",
  alumniService.updateQuestionnaireSubmission
);

router.post("/answer-questionnaire", alumniService.answerQuestionnaire);
router.delete(
  "/answer-questionnaire/:questionnaireSubmissionId/:studentId",
  alumniService.cancleAnswerQuestionnaire
);

module.exports = router;
