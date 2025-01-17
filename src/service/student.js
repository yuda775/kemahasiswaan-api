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
          password: await bcrypt.hash(req.body.password, 10),
          program: {
            connect: {
              id: parseInt(programId),
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
      });
      if (!student || !(await bcrypt.compare(password, student.password))) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }
      const token = jwt.sign(
        { id: student.id, email: student.email, role: "student" },
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
      const { password, ...rest } = req.body;
      const updatedStudent = await prisma.student.update({
        where: { id },
        data: rest,
      });
      res.json({
        data: updatedStudent,
        message: "Student updated successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error updating student.",
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
