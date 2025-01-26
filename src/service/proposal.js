const prisma = require("../config/database");
const fs = require("fs");
const path = require("path");

module.exports = {
  createProposal: async (req, res) => {
    const { ukmId, title, category, activityDate } = req.body;
    const files = req.files?.files || [];

    try {
      const uploadDir = path.join(__dirname, "../../public/proposal/");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const promises = files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const newFileName = `${Date.now()}-${file.name}`;
            const filePathFull = path.join(uploadDir, newFileName);

            file.mv(filePathFull, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve({
                  name: file.name,
                  path: newFileName,
                });
              }
            });
          })
      );

      const filesData = await Promise.all(promises);

      const proposal = await prisma.proposal.create({
        data: {
          ukmId: parseInt(ukmId),
          title,
          category,
          activityDate: new Date(activityDate).toISOString(),
          files: {
            createMany: {
              data: filesData,
            },
          },
        },
      });

      res.status(201).json({
        data: proposal,
        message: "Proposal created successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error creating proposal.",
      });
    }
  },

  // Retrieve all proposals
  getProposals: async (req, res) => {
    try {
      const proposals = await prisma.proposal.findMany({
        orderBy: {
          id: "desc",
        },
        include: {
          ukm: true,
          files: true,
        },
      });
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
    const { id } = req.params;
    console.log(req.body);

    try {
      const updatedProposal = await prisma.proposal.update({
        where: { id: parseInt(id) },
        data: {
          ...req.body,
        },
      });
      res.json({
        data: updatedProposal,
        message: "Proposal status updated successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error updating proposal status.",
      });
    }
  },

  // Upload LPJ Files
  uploadLPJ: async (req, res) => {
    const { id } = req.params;
    const files = req.files?.files ? [req.files.files] : [];

    try {
      const uploadDir = path.join(__dirname, "../../public/proposal/lpj/");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const promises = files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const newFileName = `${Date.now()}-${file.name}`;
            const filePathFull = path.join(uploadDir, newFileName);

            file.mv(filePathFull, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve({
                  name: "(LPJ) " + file.name,
                  path: newFileName,
                });
              }
            });
          })
      );

      const filesData = await Promise.all(promises);

      const proposalFilesData = filesData.map((fileData) => ({
        proposalId: parseInt(id),
        name: fileData.name,
        path: fileData.path,
        type: "LPJ",
      }));

      const proposalFile = await prisma.proposalFile.createMany({
        data: proposalFilesData,
      });

      res.status(201).json({
        data: proposalFile,
        message: "LPJ files uploaded successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error uploading LPJ files.",
      });
    }
  },

  // Delete a proposal by ID
  deleteProposal: async (req, res) => {
    const { id } = req.params;

    try {
      console.log("Searching for proposal with ID:", id);
      const proposal = await prisma.proposal.findUnique({
        where: { id: parseInt(id) },
        include: { files: true },
      });

      if (!proposal) {
        console.log("No proposal found with ID:", id);
        return res.status(404).json({ message: "Proposal not found" });
      }

      console.log("Deleting associated files for proposal ID:", id);
      const uploadDir = path.join(__dirname, "../../public/proposal");
      for (const file of proposal.files) {
        const filePathFull = path.join(uploadDir, file.path);

        try {
          if (fs.existsSync(filePathFull)) {
            console.log("Deleting file:", filePathFull);
            fs.unlinkSync(filePathFull);
          } else {
            console.log("File not found, skipping:", filePathFull);
          }
        } catch (error) {
          console.error("Error deleting file:", filePathFull, error.message);
        }
      }

      console.log("Deleting proposal from database with ID:", id);
      await prisma.proposal.delete({
        where: { id: parseInt(id) },
      });

      console.log("Proposal deleted successfully with ID:", id);
      res.status(200).json({ message: "Proposal deleted successfully" });
    } catch (error) {
      console.error("Error deleting proposal with ID:", id, error.message);
      res.status(500).json({ message: "Error deleting proposal" });
    }
  },
};
