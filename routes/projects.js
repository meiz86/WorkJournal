const express = require("express");
const router = express.Router();

const controller = require("../controllers/projectController");
const permissionMiddleware = require("../middleware/permissionMiddleware");

// ============================
// View Projects
// ============================

router.get(
  "/",
  permissionMiddleware.allowPermission("projects.view"),
  controller.index,
);

// ============================
// Create Project
// ============================

router.get(
  "/new",
  permissionMiddleware.allowPermission("projects.create"),
  controller.newForm,
);

router.post(
  "/new",
  permissionMiddleware.allowPermission("projects.create"),
  controller.create,
);

// ============================
// Edit Project
// ============================

router.get(
  "/edit/:id",
  permissionMiddleware.allowPermission("projects.edit"),
  controller.editForm,
);

router.post(
  "/edit/:id",
  permissionMiddleware.allowPermission("projects.edit"),
  controller.update,
);

// ============================
// Delete Project
// ============================

router.post(
  "/delete/:id",
  permissionMiddleware.allowPermission("projects.delete"),
  controller.delete,
);

// ============================
// Project Details
// ============================

router.get(
  "/:id",
  permissionMiddleware.allowPermission("projects.view"),
  controller.details,
);

module.exports = router;
