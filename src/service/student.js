const prisma = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  register: async (req, res) => {
    const { id, advisorId, programId, ...rest } = req.body;
    try {
      const [lecturer, programStudy] = await Promise.all([
        prisma.lecturer.findUnique({ where: { id: parseInt(advisorId) } }),
        prisma.programStudy.findUnique({
          where: { id: parseInt(programId) },
        }),
      ]);
      console.log("lecturer:", lecturer);
      console.log("programStudy:", programStudy);
      if (!lecturer || !programStudy) {
        return res.status(400).json({
          message: "Lecturer or program study not found.",
        });
      }

      const student = await prisma.student.create({
        data: {
          ...rest,
          birthDate: req.body.birthDate.split("T")[0],
          password: await bcrypt.hash(req.body.password, 10),
          program: {
            connect: {
              id: parseInt(programId),
            },
          },
          advisor: {
            connect: {
              id: parseInt(advisorId),
            },
          },
        },
      });
      console.log("student:", student);
      res.json({
        data: student,
        message: "Student created successfully.",
      });
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({
        error: error.message,
        message: "Error creating student.",
      });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const student = await prisma.student.findUnique({
        where: { email },
        include: {
          advisor: {
            select: {
              name: true,
              employeeNumber: true,
            },
          },
        },
      });
      if (!student || !(await bcrypt.compare(password, student.password))) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }
      const token = jwt.sign(
        {
          id: student.id,
          name: student.name,
          npm: student.npm,
          email: student.email,
          role: "student",
          enrollmentYear: student.enrollmentYear,
          graduationYear: student.graduationYear,
          advisor: {
            name: student.advisor.name,
            nip: student.advisor.employeeNumber,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "30h" }
      );
      res.json({
        data: { token, student },
        message: "Login successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error logging in.",
      });
    }
  },
  getStudents: async (req, res) => {
    try {
      const students = await prisma.student.findMany({
        include: {
          advisor: {
            select: {
              name: true,
            },
          },
          program: {
            select: {
              code: true,
            },
          },
        },
      });
      res.json({
        data: students,
        message: "Students retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving students.",
      });
    }
  },
  updateStudent: async (req, res) => {
    const id = parseInt(req.params.id);

    try {
      const { password, programId, advisorId, ...rest } = req.body;

      if (!programId || isNaN(programId)) {
        return res
          .status(400)
          .json({ message: "Program ID is required and must be a number." });
      }

      const updateData = {
        ...rest,
        program: {
          connect: {
            id: parseInt(programId),
          },
        },
      };

      if (advisorId && !isNaN(advisorId)) {
        updateData.advisor = {
          connect: {
            id: parseInt(advisorId),
          },
        };
      }

      // Lakukan pembaruan dengan Prisma
      const updatedStudent = await prisma.student.update({
        where: { id },
        data: updateData,
      });

      // Kirim respon sukses
      res.json({
        data: updatedStudent,
        message: "Student updated successfully.",
      });
    } catch (error) {
      // Tangani error
      res.status(500).json({
        error: error.message,
        stack: error.stack,
        message: "Error updating student.",
      });
    }
  },
  changePassword: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updatedStudent = await prisma.student.update({
        where: { id },
        data: {
          password: await bcrypt.hash(req.body.password, 10),
        },
      });
      res.json({
        data: updatedStudent,
        message: "Password changed successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error changing password.",
      });
    }
  },
  deleteStudent: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.student.delete({ where: { id } });
      res.status(200).json({
        message: "Student deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error deleting student.",
      });
    }
  },
};
