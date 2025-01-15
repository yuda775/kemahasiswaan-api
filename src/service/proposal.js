const prisma = require("../config/database");

module.exports = {
  // Create a new proposal
  createProposal: async (req, res) => {
    console.log(req.files);

    // try {
    //   const newProposal = await prisma.proposal.create({
    //     data: req.body,
    //   });
    //   res.status(201).json({
    //     data: newProposal,
    //     message: "Proposal created successfully.",
    //   });
    // } catch (error) {
    //   res.status(500).json({
    //     error: error.message,
    //     message: "Error creating proposal.",
    //   });
    // }
  },

  // Retrieve all proposals
  getProposals: async (req, res) => {
    try {
      const proposals = await prisma.proposal.findMany();
      res.json({
        data: proposals,
        message: "Proposals retrieved successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving proposals.",
      });
    }
  },

  // Retrieve a single proposal by ID
  getProposalById: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const proposal = await prisma.proposal.findUnique({
        where: { id },
      });
      if (proposal) {
        res.json({
          data: proposal,
          message: "Proposal retrieved successfully.",
        });
      } else {
        res.status(404).json({
          message: "Proposal not found.",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error retrieving proposal.",
      });
    }
  },

  // Update a proposal by ID
  updateProposal: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updatedProposal = await prisma.proposal.update({
        where: { id },
        data: req.body,
      });
      res.json({
        data: updatedProposal,
        message: "Proposal updated successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error updating proposal.",
      });
    }
  },

  // Delete a proposal by ID
  deleteProposal: async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      await prisma.proposal.delete({
        where: { id },
      });
      res.status(200).json({
        message: "Proposal deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error deleting proposal.",
      });
    }
  },
};
