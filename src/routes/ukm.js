const express = require("express");
const router = express.Router();

const ukmService = require("../service/ukm");

router.get("/", ukmService.getUkms);
router.post("/", ukmService.createUkm);
router.patch("/:id", ukmService.updateUkm);
router.delete("/:id", ukmService.deleteUkm);

module.exports = router;
