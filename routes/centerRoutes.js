const express = require("express");
const router = express.Router();

const controller = require("../controllers/centerController");
const permissionMiddleware = require("../middleware/permissionMiddleware");

// ============================
// Centers
// ============================

// List
router.get(
  "/",
  permissionMiddleware.allowPermission("centers.view"),
  controller.index,
);

// Create
router.get(
  "/new",
  permissionMiddleware.allowPermission("centers.create"),
  controller.newForm,
);

router.post(
  "/new",
  permissionMiddleware.allowPermission("centers.create"),
  controller.create,
);

// Details
router.get(
  "/:id",
  permissionMiddleware.allowPermission("centers.view"),
  controller.show,
);

// Edit
router.get(
  "/:id/edit",
  permissionMiddleware.allowPermission("centers.edit"),
  controller.editForm,
);

router.post(
  "/:id/edit",
  permissionMiddleware.allowPermission("centers.edit"),
  controller.update,
);

// Delete
router.get(
  "/:id/delete",
  permissionMiddleware.allowPermission("centers.delete"),
  controller.delete,
);

// Assign Stations
router.get(
  "/:id/stations",
  permissionMiddleware.allowPermission("centers.edit"),
  controller.assignStationForm,
);

router.post(
  "/:id/stations",
  permissionMiddleware.allowPermission("centers.edit"),
  controller.assignStation,
);

module.exports = router;
