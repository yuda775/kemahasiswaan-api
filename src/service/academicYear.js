const prisma = require("../config/database");

module.exports = {
  getAcademicYears: async (req, res) => {
    try {
      const academicYears = await prisma.academicYear.findMany();
      res.json({
        data: academicYears,
        message: "Academic years retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving academic years.",
      });
    }
  },

  createAcademicYear: async (req, res) => {
    try {
      const newAcademicYear = await prisma.academicYear.create({
        data: req.body,
      });
      res.status(201).json({
        data: newAcademicYear,
        message: "Academic year created successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error creating academic year.",
      });
    }
  },

  updateAcademicYear: async (req, res) => {
    const id = parseInt(req.params.id);
    // try {
    //   const updatedAcademicYear = await prisma.academicYear.update({
    //     where: { id },
    //     data: req.body,
    //   });
    //   res.json({
    //     data: updatedAcademicYear,
    //     message: "Academic year updated successfully.",
    //   });
    // } catch (error) {
    //   res.status(500).json({
    //     error: error.message,
    //     message: "Error updating academic year.",
    //   });
    // }
    try {
      await prisma.academicYear.updateMany({
        data: { isActive: false },
      });
      const activeAcademicYear = await prisma.academicYear.update({
        where: { id: parseInt(id) },
        data: { isActive: true },
      });
      res.json({
        data: activeAcademicYear,
        message: "Academic year set as active successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error setting active academic year.",
      });
    }
  },

  deleteAcademicYear: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const relatedData = await prisma.studentActivity.findFirst({
        where: { academicYearId: id },
      });

      if (relatedData) {
        return res.status(400).json({
          message:
            "Tidak dapat menghapus tahun akademik karena ada data berelasi.",
        });
      }

      await prisma.academicYear.delete({ where: { id } });
      res.status(200).json({ message: "Academic year deleted successfully." });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error deleting academic year.",
      });
    }
  },

  setActiveAcademicYear: async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.academicYear.updateMany({
        data: { isActive: false },
      });
      const activeAcademicYear = await prisma.academicYear.update({
        where: { id: parseInt(id) },
        data: { isActive: true },
      });
      res.json({
        data: activeAcademicYear,
        message: "Academic year set as active successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error setting active academic year.",
      });
    }
  },
};
