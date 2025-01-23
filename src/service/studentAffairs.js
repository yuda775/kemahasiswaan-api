const prisma = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const studentAffair = await prisma.studentAffairs.findUnique({
        where: { email },
      });
      if (
        !studentAffair ||
        !(await bcrypt.compare(password, studentAffair.password))
      ) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }
      const token = jwt.sign(
        { id: studentAffair.id, name, email, role: "student-affairs" },
        process.env.JWT_SECRET,
        { expiresIn: "30h" }
      );
      res.json({
        data: { token, studentAffair },
        message: "Login successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error logging in.",
      });
    }
  },

  getStudentAffairs: async (req, res) => {
    try {
      const studentAffairs = await prisma.studentAffairs.findMany();
      res.json({
        data: studentAffairs,
        message: "Student Affairs retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving Student Affairs.",
      });
    }
  },

  createStudentAffair: async (req, res) => {
    try {
      const newStudentAffair = await prisma.studentAffairs.create({
        data: {
          ...req.body,
          password: await bcrypt.hash(req.body.password, 10),
        },
      });
      res.status(201).json({
        data: newStudentAffair,
        message: "Student Affair created successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error creating Student Affair.",
      });
    }
  },

  updateStudentAffair: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updatedStudentAffair = await prisma.studentAffairs.update({
        where: { id },
        data: req.body,
      });
      res.json({
        data: updatedStudentAffair,
        message: "Student Affair updated successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error updating Student Affair.",
      });
    }
  },

  deleteStudentAffair: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.studentAffairs.delete({
        where: { id },
      });
      res.status(200).json({
        message: "Student Affair deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error deleting Student Affair.",
      });
    }
  },
};
