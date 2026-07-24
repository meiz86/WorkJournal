const express = require("express");
const router = express.Router();

const controller = require("../controllers/roleController");
const permissionMiddleware = require("../middleware/permissionMiddleware");

// ============================
// Roles
// ============================

router.get(
  "/",
  permissionMiddleware.allowPermission("roles.manage"),
  controller.index,
);

router.post(
  "/create",
  permissionMiddleware.allowPermission("roles.manage"),
  controller.create,
);

router.post(
  "/update/:id",
  permissionMiddleware.allowPermission("roles.manage"),
  controller.update,
);

router.get(
  "/delete/:id",
  permissionMiddleware.allowPermission("roles.manage"),
  controller.delete,
);

module.exports = router;
