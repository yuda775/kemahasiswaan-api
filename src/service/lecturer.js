const prisma = require("../config/database");
const bcrypt = require("bcryptjs");

module.exports = {
  getLecturers: async (req, res) => {
    try {
      const lecturers = await prisma.lecturer.findMany({
        where: { deletedAt: null },
      });
      res.json({
        data: lecturers,
        message: "Lecturers retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving lecturers.",
      });
    }
  },

  getLecturerById: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const lecturer = await prisma.lecturer.findUnique({
        where: { id },
      });
      res.json({
        data: lecturer,
        message: "Lecturer retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving lecturer.",
      });
    }
  },

  createLecturer: async (req, res) => {
    const { name, employeeNumber, email, password } = req.body;

    try {
      const [existingLecturer, existingEmail] = await Promise.all([
        prisma.lecturer.findUnique({ where: { employeeNumber } }),
        prisma.lecturer.findUnique({ where: { email } }),
      ]);

      if (existingLecturer || existingEmail) {
        return res.status(400).json({
          message: "Lecturer or email already exists.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newLecturer = await prisma.lecturer.create({
        data: {
          name,
          employeeNumber,
          email,
          password: hashedPassword,
        },
      });
      res.status(201).json({
        data: newLecturer,
        message: "Lecturer created successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error creating lecturer.",
      });
    }
  },

  updateLecturer: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updatedLecturer = await prisma.lecturer.update({
        where: { id },
        data: req.body,
      });
      res.json({
        data: updatedLecturer,
        message: "Lecturer updated successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error updating lecturer.",
      });
    }
  },

  deleteLecturer: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.lecturer.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      res.status(200).json({
        message: "Lecturer soft-deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error soft-deleting lecturer.",
      });
    }
  },
};