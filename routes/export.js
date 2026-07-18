const express = require("express");
const router = express.Router();

const controller = require("../controllers/exportController");

router.get("/daily/pdf", controller.dailyPDF);
router.get("/daily/excel", controller.dailyExcel);

module.exports = router;
