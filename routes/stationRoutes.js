const express = require("express");
const router = express.Router();

const controller = require("../controllers/stationController");

// ============================
// Stations
// ============================

// List
router.get("/", controller.index);

// New
router.get("/new", controller.newForm);
router.post("/new", controller.create);

// Edit
router.get("/:id/edit", controller.editForm);
router.post("/:id/edit", controller.update);

// Delete
router.post("/:id/delete", controller.delete);

module.exports = router;
