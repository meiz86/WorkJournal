const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const permissionMiddleware = require("../middleware/permissionMiddleware");

// =====================================
// Users List
// =====================================

router.get(
  "/",
  permissionMiddleware.allowPermission("users.view"),
  userController.index,
);

// =====================================
// Create User
// =====================================

router.get(
  "/new",
  permissionMiddleware.allowPermission("users.edit"),
  userController.newForm,
);

router.post(
  "/new",
  permissionMiddleware.allowPermission("users.edit"),
  userController.create,
);

// =====================================
// Update User Role
// =====================================

router.post(
  "/update-role/:id",
  permissionMiddleware.allowPermission("users.edit"),
  userController.updateRole,
);
// Edit User
router.get(
  "/edit/:id",
  permissionMiddleware.allowPermission("users.edit"),
  userController.editForm,
);

router.post(
  "/edit/:id",
  permissionMiddleware.allowPermission("users.edit"),
  userController.update,
);

// Delete User
router.post(
  "/delete/:id",
  permissionMiddleware.allowPermission("users.edit"),
  userController.delete,
);
router.post(
  "/status/:id",
  permissionMiddleware.allowPermission("users.edit"),
  userController.updateStatus
);
module.exports = router;
