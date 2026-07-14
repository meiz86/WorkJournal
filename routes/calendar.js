const express = require("express");
const router = express.Router();

const calendarController = require("../controllers/calendarController");

router.get("/", calendarController.index);
router.get("/:date", calendarController.day);

module.exports = router;