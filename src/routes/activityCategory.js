const express = require("express");
const router = express.Router();

const activityCategoryService = require("../service/activityCategory");

router.get("/", activityCategoryService.getActivityCategories);
router.post("/", activityCategoryService.createActivityCategory);
router.patch("/:id", activityCategoryService.updateActivityCategory);
router.delete("/:id", activityCategoryService.deleteActivityCategory);

module.exports = router;
