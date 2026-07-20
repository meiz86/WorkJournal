const express = require("express");
const router = express.Router();

const controller = require("../controllers/reportController");

// =====================================
// Reports Home
// =====================================

router.get("/", controller.index);

// =====================================
// Infrastructure Reports
// =====================================

router.get("/stations", controller.stationReport);
router.get("/hardware", controller.hardwareReport);
router.get("/centers", controller.centerReport);

// =====================================
// Existing Reports
// =====================================

router.get("/daily", controller.daily);
router.get("/weekly", controller.weekly);
router.get("/monthly", controller.monthly);
router.get("/project", controller.project);

// =====================================
// Export
// =====================================

router.get("/daily/pdf", controller.dailyPDF);
router.get("/daily/excel", controller.dailyExcel);
router.get("/stations/pdf", controller.stationPDF);
router.get("/stations/excel", controller.stationExcel);
router.get("/stations/pdf", controller.stationPDF);
module.exports = router;
