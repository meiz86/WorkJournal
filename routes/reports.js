const express = require("express");
const router = express.Router();

const controller = require("../controllers/reportController");

// ============================
// Report Pages
// ============================

router.get("/", controller.index);
router.get("/daily", controller.daily);
router.get("/weekly", controller.weekly);
router.get("/monthly", controller.monthly);
router.get("/project", controller.project);

// ============================
// Export
// ============================

router.get("/daily/pdf", controller.dailyPDF);
router.get("/daily/excel", controller.dailyExcel);

module.exports = router;
