const prisma = require("../config/database");
const fs = require("fs");
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

  getAccumulationByStudentId: async (req, res) => {
    try {
      const { id } = req.params;
      const totalSubmissions = await prisma.studentActivity.aggregate({
        _sum: {
          point: true,
        },
        where: {
          studentId: parseInt(id, 10),
          advisorVerification: "APPROVED",
          studentAffairVerification: "APPROVED",
        },
      });

      res.json({
        data: totalSubmissions._sum.point || 0,
        message: "Total submissions calculated successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error calculating total submissions.",
      });
    }
  },

  getStudentActivityByStudentId: async (req, res) => {
    try {
      const { id } = req.params;
      const { academicYearId, advisorVerification, studentAffairVerification } =
        req.query;
      const filters = {
        studentId: parseInt(id, 10),
      };
      if (academicYearId) {
        filters.academicYearId = parseInt(academicYearId, 10);
      }
      if (advisorVerification) {
        filters.advisorVerification = advisorVerification;
      }
      if (studentAffairVerification) {
        filters.studentAffairVerification = studentAffairVerification;
      }

      const studentActivities = await prisma.studentActivity.findMany({
        where: {
          ...filters,
        },
        orderBy: {
          id: "desc",
        },
        include: {
          academicYear: {
            select: {
              year: true,
              semester: true,
            },
          },
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
      const { academicYearId, status } = req.query;

      const filters = {
        student: {
          advisorId: parseInt(req.params.id, 10),
        },
      };
      if (academicYearId) {
        filters.academicYearId = parseInt(academicYearId, 10);
      }
      if (status) {
        filters.advisorVerification = status;
      }
      const studentActivities = await prisma.student.findMany({
        where: {
          advisorId: parseInt(id, 10),
          activities: {
            some: {
              academicYearId: parseInt(academicYearId, 10),
            },
          },
        },
        select: {
          id: true,
          name: true,
          npm: true,
          activities: {
            where: {
              academicYearId: parseInt(academicYearId, 10),
            },
            select: {
              id: true,
              activityName: true,
              activityCategory: true,
              point: true,
              filePath: true,
              advisorVerification: true,
              comments: true,
            },
          },
        },
      });

      // const studentActivities = await prisma.studentActivity.findMany({
      //   where: {
      //     ...filters,
      //   },
      //   orderBy: {
      //     id: "desc",
      //   },
      //   include: {
      //     academicYear: {
      //       select: {
      //         year: true,
      //         semester: true,
      //       },
      //     },
      //     student: {
      //       select: {
      //         name: true,
      //         npm: true,
      //       },
      //     },
      //   },
      // });
      res.json({
        data: { student: studentActivities },
        message: "Student activities retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving student activities by advisor ID.",
      });
    }
  },

  getStudentActivityByStudentAffair: async (req, res) => {
    const { academicYearId, status } = req.query;

    const filters = {
      advisorVerification: "APPROVED",
    };

    if (academicYearId) {
      filters.academicYearId = parseInt(academicYearId, 10);
    }

    if (status) {
      filters.studentAffairVerification = status;
    }

    const studentActivities = await prisma.student.findMany({
      where: {
        activities: {
          some: {
            academicYearId: parseInt(academicYearId, 10),
          },
        },
      },
      select: {
        id: true,
        name: true,
        npm: true,
        activities: {
          where: {
            academicYearId: parseInt(academicYearId, 10),
            advisorVerification: "APPROVED",
          },
          select: {
            id: true,
            activityName: true,
            activityCategory: true,
            point: true,
            filePath: true,
            advisorVerification: true,
            studentAffairVerification: true,
            comments: true,
          },
        },
      },
    });

    res.json({
      data: { student: studentActivities },
      message: "Student activities retrieved successfully.",
    });
  },

  createStudentActivity: async (req, res) => {
    const { filePath: file } = req.files;

    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    try {
      const academicYear = await prisma.academicYear.findFirst({
        where: { isActive: true },
      });

      const student = await prisma.student.findUnique({
        where: { id: parseInt(req.body.studentId, 10) },
      });

      if (!academicYear) {
        return res.status(400).json({ error: "No active academic year found" });
      }

      const uploadDir = path.join(__dirname, "../../public/student-activity");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const newFileName = `${Date.now()}-${file.name}`;
      const filePathFull = path.join(uploadDir, newFileName);

      await file.mv(filePathFull);

      const newStudentActivity = await prisma.studentActivity.create({
        data: {
          point: parseInt(req.body.point, 10),
          filePath: newFileName,
          activityCategory: req.body.activityCategory,
          activityName: req.body.activityName,
          activityDate: new Date(req.body.activityDate).toISOString(),
          student: {
            connect: {
              id: parseInt(req.body.studentId, 10),
            },
          },
          academicYear: {
            connect: {
              id: parseInt(academicYear.id, 10),
            },
          },
        },
      });

      res.status(201).json({
        data: newStudentActivity,
        message: "Student activity created successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error creating student activity.",
      });
    }
  },

  abortStudentActivity: async (req, res) => {
    try {
      const { id } = req.params;

      const studentActivity = await prisma.studentActivity.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (studentActivity.advisorVerification === "PENDING") {
        const deletedStudentActivity = await prisma.studentActivity.delete({
          where: { id: parseInt(id, 10) },
        });

        if (deletedStudentActivity.filePath) {
          const filePath = path.resolve(
            __dirname,
            "../../public/student-activity/",
            deletedStudentActivity.filePath
          );
          if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
          }
        }

        res.json({
          data: deletedStudentActivity,
          message: "Kegiatan mahasiswa dibatalkan berhasil.",
        });
      } else {
        res.status(400).json({
          message:
            "Kegiatan mahasiswa tidak dapat dibatalkan karena telah diverifikasi oleh dosen.",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error aborting student activity.",
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
