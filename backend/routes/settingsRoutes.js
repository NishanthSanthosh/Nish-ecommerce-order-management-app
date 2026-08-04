const express = require("express");
const settingsController = require("./../controllers/settingsController");

const router = express.Router();

router
  .route("/")
  .get(settingsController.getSettings)
  .patch(settingsController.updateSettings);

module.exports = router;
