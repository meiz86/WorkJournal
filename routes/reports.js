const express = require("express");
const router = express.Router();

const controller = require("../controllers/reportController");
const permissionMiddleware = require("../middleware/permissionMiddleware");

// =====================================
// Reports Home
// =====================================

router.get(
  "/",
  permissionMiddleware.allowPermission("reports.view"),
  controller.index
);

// =====================================
// Infrastructure Reports
// =====================================

router.get(
  "/stations",
  permissionMiddleware.allowPermission("reports.view"),
  controller.stationReport
);

router.get(
  "/hardware",
  permissionMiddleware.allowPermission("reports.view"),
  controller.hardwareReport
);

router.get(
  "/centers",
  permissionMiddleware.allowPermission("reports.view"),
  controller.centerReport
);

// =====================================
// Existing Reports
// =====================================

router.get(
  "/daily",
  permissionMiddleware.allowPermission("reports.view"),
  controller.daily
);

router.get(
  "/weekly",
  permissionMiddleware.allowPermission("reports.view"),
  controller.weekly
);

router.get(
  "/monthly",
  permissionMiddleware.allowPermission("reports.view"),
  controller.monthly
);

router.get(
  "/project",
  permissionMiddleware.allowPermission("reports.view"),
  controller.project
);

// =====================================
// Export
// =====================================

router.get(
  "/daily/pdf",
  permissionMiddleware.allowPermission("reports.export"),
  controller.dailyPDF
);

router.get(
  "/daily/excel",
  permissionMiddleware.allowPermission("reports.export"),
  controller.dailyExcel
);

router.get(
  "/stations/pdf",
  permissionMiddleware.allowPermission("reports.export"),
  controller.stationPDF
);

router.get(
  "/stations/excel",
  permissionMiddleware.allowPermission("reports.export"),
  controller.stationExcel
);

router.get(
  "/weekly/pdf",
  permissionMiddleware.allowPermission("reports.export"),
  controller.weeklyPDF
);

router.get(
  "/weekly/excel",
  permissionMiddleware.allowPermission("reports.export"),
  controller.weeklyExcel
);

router.get(
  "/monthly/pdf",
  permissionMiddleware.allowPermission("reports.export"),
  controller.monthlyPDF
);

router.get(
  "/monthly/excel",
  permissionMiddleware.allowPermission("reports.export"),
  controller.monthlyExcel
);

router.get(
  "/project/pdf",
  permissionMiddleware.allowPermission("reports.export"),
  controller.projectPDF
);

router.get(
  "/project/excel",
  permissionMiddleware.allowPermission("reports.export"),
  controller.projectExcel
);

router.get(
  "/centers/pdf",
  permissionMiddleware.allowPermission("reports.export"),
  controller.centerPDF
);

router.get(
  "/centers/excel",
  permissionMiddleware.allowPermission("reports.export"),
  controller.centerExcel
);

module.exports = router;