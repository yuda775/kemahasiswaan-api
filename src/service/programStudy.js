const prisma = require("../config/database");

module.exports = {
  getProgramStudies: async (req, res) => {
    try {
      const programStudies = await prisma.programStudy.findMany();
      res.json({
        data: programStudies,
        message: "Program studies retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving program studies.",
      });
    }
  },

  createProgramStudy: async (req, res) => {
    try {
      const newProgramStudy = await prisma.programStudy.create({
        data: req.body,
      });
      res.status(201).json({
        data: newProgramStudy,
        message: "Program study created successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error creating program study.",
      });
    }
  },

  updateProgramStudy: async (req, res) => {
    const id = parseInt(req.params.id);

    try {
      const updatedProgramStudy = await prisma.programStudy.update({
        where: { id },
        data: req.body,
      });
      res.json({
        data: updatedProgramStudy,
        message: "Program study updated successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error updating program study.",
      });
    }
  },

  deleteProgramStudy: async (req, res) => {
    const programStudyId = parseInt(req.params.id, 10);

    try {
      const studentUsingProgramStudy = await prisma.student.findFirst({
        where: {
          programId: programStudyId,
        },
      });

      if (studentUsingProgramStudy) {
        return res.status(400).json({
          message:
            "Tidak dapat menghapus program studi karena sedang digunakan oleh mahasiswa.",
        });
      }

      await prisma.programStudy.delete({ where: { id: programStudyId } });

      res.status(200).json({
        message: "Program study deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error deleting program study.",
      });
    }
  },
};
