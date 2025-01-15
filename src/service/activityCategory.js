const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getActivityCategories: async (req, res) => {
    try {
      const activityCategories = await prisma.activityCategory.findMany({
        where: {
          deletedAt: null,
        },
      });
      res.json({
        data: activityCategories,
        message: "Activity categories retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving activity categories.",
      });
    }
  },
  createActivityCategory: async (req, res) => {
    try {
      const newActivityCategory = await prisma.activityCategory.create({
        data: req.body,
      });
      res.status(201).json({
        data: newActivityCategory,
        message: "Activity category created successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error creating activity category.",
      });
    }
  },
  updateActivityCategory: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updatedActivityCategory = await prisma.activityCategory.update({
        where: { id },
        data: req.body,
      });
      res.json({
        data: updatedActivityCategory,
        message: "Activity category updated successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error updating activity category.",
      });
    }
  },
  deleteActivityCategory: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.activityCategory.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      res.status(200).json({
        message: "Activity category soft-deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error soft-deleting activity category.",
      });
    }
  },
};
