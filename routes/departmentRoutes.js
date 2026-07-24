const express = require("express");
const router = express.Router();

const controller = require("../controllers/departmentController");
const permissionMiddleware = require("../middleware/permissionMiddleware");

// ============================
// Departments
// ============================

// List
router.get(
  "/",
  permissionMiddleware.allowPermission("departments.view"),
  controller.index
);

// Create
router.get(
  "/new",
  permissionMiddleware.allowPermission("departments.create"),
  controller.newForm
);

router.post(
  "/new",
  permissionMiddleware.allowPermission("departments.create"),
  controller.create
);

// Edit
router.get(
  "/edit/:id",
  permissionMiddleware.allowPermission("departments.edit"),
  controller.editForm
);

router.post(
  "/edit/:id",
  permissionMiddleware.allowPermission("departments.edit"),
  controller.update
);

// Delete
router.get(
  "/delete/:id",
  permissionMiddleware.allowPermission("departments.delete"),
  controller.delete
);

module.exports = router;