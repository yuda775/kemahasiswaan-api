const express = require("express");
const app = express();
const router = express.Router();
const studentActivityService = require("../service/studentActivity");

router.get("/", studentActivityService.getStudentActivities);
router.get(
  "/student/:id",
  studentActivityService.getStudentActivityByStudentId
);
router.get(
  "/advisor/:id",
  studentActivityService.getStudentActivityByAdvisorId
);
router.get(
  "/student-affair",
  studentActivityService.getStudentActivityByAtudentAffair
);

router.post("/", studentActivityService.createStudentActivity);
router.delete("/:id", studentActivityService.abortStudentActivity);
router.patch("/:id", studentActivityService.updateStudentActivity);

// comments
router.post("/comments", studentActivityService.createStudentActivityComment);
// router.patch(
//   "/comments/:id",
//   studentActivityService.updateStudentActivityComment
// );
// router.delete(
//   "/comments/:id",
//   studentActivityService.deleteStudentActivityComment
// );

module.exports = router;
