const express = require("express");
const router = express.Router();

const controller = require("../controllers/stationController");
const permissionMiddleware = require("../middleware/permissionMiddleware");

// ============================
// Stations
// ============================

// List
router.get(
  "/",
  permissionMiddleware.allowPermission("stations.view"),
  controller.index
);

// New
router.get(
  "/new",
  permissionMiddleware.allowPermission("stations.create"),
  controller.newForm
);

router.post(
  "/new",
  permissionMiddleware.allowPermission("stations.create"),
  controller.create
);

// Details
router.get(
  "/:id",
  permissionMiddleware.allowPermission("stations.view"),
  controller.show
);

// Edit
router.get(
  "/:id/edit",
  permissionMiddleware.allowPermission("stations.edit"),
  controller.editForm
);

router.post(
  "/:id/edit",
  permissionMiddleware.allowPermission("stations.edit"),
  controller.update
);

// Delete
router.post(
  "/:id/delete",
  permissionMiddleware.allowPermission("stations.delete"),
  controller.delete
);

module.exports = router;