const express = require("express");
const router = express.Router();
const studentService = require("../service/student");

router.post("/login", studentService.login);
router.post("/register", studentService.register);

router.get("/", studentService.getStudents);
router.patch("/:id", studentService.updateStudent);
router.patch("/change-password/:id", studentService.changePassword);
router.delete("/:id", studentService.deleteStudent);

module.exports = router;
