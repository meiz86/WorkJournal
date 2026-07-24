const express = require("express");
const router = express.Router();

const controller = require("../controllers/permissionController");
const permissionMiddleware = require("../middleware/permissionMiddleware");

router.get(
  "/",
  permissionMiddleware.allowPermission("roles.manage"),
  controller.index,
);

router.post(
  "/:id",
  permissionMiddleware.allowPermission("roles.manage"),
  controller.update,
);

module.exports = router;
