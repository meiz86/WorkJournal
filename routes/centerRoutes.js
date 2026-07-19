const express = require("express");
const router = express.Router();

const controller = require("../controllers/centerController");

// List
router.get("/", controller.index);

// Create
router.get("/new", controller.newForm);
router.post("/new", controller.create);

// Show
router.get("/:id", controller.show);

// Edit
router.get("/:id/edit", controller.editForm);
router.post("/:id/edit", controller.update);

// Delete
router.get("/:id/delete", controller.delete);

// Assign Station
router.get("/:id/stations", controller.assignStationForm);
router.post("/:id/stations", controller.assignStation);
module.exports = router;
