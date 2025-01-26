const express = require("express");
const router = express.Router();

const proposalService = require("../service/proposal");

router.get("/", proposalService.getProposals);
router.get("/:id", proposalService.getProposalById);
router.post("/", proposalService.createProposal);
router.post("/lpj/:id", proposalService.uploadLPJ);
router.patch("/:id", proposalService.updateProposal);
router.delete("/:id", proposalService.deleteProposal);

module.exports = router;
