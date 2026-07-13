const express = require("express");

const router = express.Router();

const controller = require("../controllers/calendarController");

router.get("/", controller.index);
router.get("/day/:date", controller.day);

module.exports = router;
