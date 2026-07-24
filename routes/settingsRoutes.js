const express = require("express");
const router = express.Router();

const controller = require("../controllers/settingsController");
const permissionMiddleware = require("../middleware/permissionMiddleware");

// ============================
// View Settings
// ============================

router.get(
  "/",
  permissionMiddleware.allowPermission("dashboard.view"),
  controller.index
);

router.get(
  "/:category",
  permissionMiddleware.allowPermission("dashboard.view"),
  controller.category
);

// ============================
// Create
// ============================

router.get(
  "/:category/new",
  permissionMiddleware.allowPermission("roles.manage"),
  controller.newForm
);

router.post(
  "/:category/new",
  permissionMiddleware.allowPermission("roles.manage"),
  controller.create
);

// ============================
// Delete
// ============================

router.get(
  "/:category/delete/:id",
  permissionMiddleware.allowPermission("roles.manage"),
  controller.delete
);

module.exports = router;