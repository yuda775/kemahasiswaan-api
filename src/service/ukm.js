const prisma = require("../config/database");

module.exports = {
  getUkms: async (req, res) => {
    try {
      const ukms = await prisma.uKM.findMany();
      res.json({
        data: ukms,
        message: "UKMs retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving UKMs.",
      });
    }
  },
  getUkmById: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const ukm = await prisma.uKM.findUnique({
        where: { id },
      });
      res.json({
        data: ukm,
        message: "UKM retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving UKM.",
      });
    }
  },
  createUkm: async (req, res) => {
    try {
      const newUkm = await prisma.uKM.create({
        data: req.body,
      });
      res.status(201).json({
        data: newUkm,
        message: "UKM created successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error creating UKM.",
      });
    }
  },
  updateUkm: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updatedUkm = await prisma.uKM.update({
        where: { id },
        data: req.body,
      });
      res.json({
        data: updatedUkm,
        message: "UKM updated successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error updating UKM.",
      });
    }
  },
  deleteUkm: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.uKM.delete({
        where: { id },
      });
      res.status(200).json({
        message: "UKM deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error deleting UKM.",
      });
    }
  },
};
