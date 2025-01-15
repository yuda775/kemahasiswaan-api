const prisma = require("../config/database");
const fs = require("fs");
const { get } = require("http");
const path = require("path");

module.exports = {
  getStudentActivities: async (req, res) => {
    try {
      const studentActivities = await prisma.studentActivity.findMany({
        include: {
          comments: true,
        },
      });
      res.json({
        data: studentActivities,
        message: "Student activities retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving student activities.",
      });
    }
  },

  getStudentActivityByStudentId: async (req, res) => {
    try {
      const { id } = req.params;
      const studentActivities = await prisma.studentActivity.findMany({
        where: {
          studentId: parseInt(id, 10),
        },
      });
      res.json({
        data: studentActivities,
        message: "Student activities retrieved successfully.",
      });
    } catch (error) {}
  },

  getStudentActivityByAdvisorId: async (req, res) => {
    try {
      const { id } = req.params;
      const studentActivities = await prisma.studentActivity.findMany({
        where: {
          student: {
            advisorId: parseInt(id, 10),
          },
        },
      });
      res.json({
        data: studentActivities,
        message: "Student activities retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving student activities by advisor ID.",
      });
    }
  },

  createStudentActivity: async (req, res) => {
    const { filePath } = req.files;

    if (!filePath) {
      return res.status(400).json({ error: "File is required" });
    }

    try {
      const academicYear = await prisma.academicYear.findFirst({
        where: { isActive: true },
      });

      const student = await prisma.student.findUnique({
        where: { id: parseInt(req.body.studentId, 10) }, // Konversi ke integer
      });

      if (!academicYear) {
        return res.status(400).json({ error: "No active academic year found" });
      }

      const uploadDir = path.join(
        __dirname,
        "../../public/student-activity/",
        academicYear.year.replace(/\//g, "-"),
        "/",
        academicYear.semester,
        "/",
        student.npm
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const newFileName = `${Date.now()}-${filePath.name}`;
      const filePathFull = path.join(uploadDir, newFileName);

      await filePath.mv(filePathFull);

      const newStudentActivity = await prisma.studentActivity.create({
        data: {
          studentId: parseInt(req.body.studentId, 10),
          point: parseInt(req.body.point, 10),
          filePath: filePathFull.replace("public/", ""),
          academicYearId: parseInt(academicYear.id, 10),
          activityCategory: req.body.activityCategory,
          activityName: req.body.activityName,
          activityDate: new Date(req.body.activityDate).toISOString(), // Konversi ke ISO-8601 DateTime
        },
      });

      res.status(201).json({
        data: newStudentActivity,
        message: "Student activity created successfully.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: error.message,
        message: "Error creating student activity.",
      });
    }
  },

  abortStudentActivity: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedStudentActivity = await prisma.studentActivity.delete({
        where: {
          id: parseInt(id, 10),
          advisorVerification: "PENDING",
        },
      });

      res.json({
        data: deletedStudentActivity,
        message: "Student activity aborted successfully.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: error.message,
        message: "Error deleting student activity.",
      });
    }
  },

  updateStudentActivity: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedStudentActivity = await prisma.studentActivity.update({
        where: { id: parseInt(id, 10) },
        data: req.body,
      });
      res.json({
        data: updatedStudentActivity,
        message: "Student activity updated successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error updating student activity.",
      });
    }
  },

  // comments
  createStudentActivityComment: async (req, res) => {
    try {
      const newComment = await prisma.activityComment.create({
        data: req.body,
      });
      res.status(201).json({
        data: newComment,
        message: "Comment created successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error creating comment.",
      });
    }
  },
};
