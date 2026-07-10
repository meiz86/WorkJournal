const express = require("express");

const router = express.Router();

const activityController = require("../controllers/activityController");

router.get("/new", activityController.showForm);
router.get("/", activityController.index);

router.post("/new", activityController.create);

module.exports = router;
