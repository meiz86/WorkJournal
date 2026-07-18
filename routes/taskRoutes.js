const express = require("express");
const router = express.Router();

const controller = require("../controllers/taskController");

// List
router.get("/", controller.index);

// Create
router.get("/new", controller.showForm);
router.post("/new", controller.create);

// Edit
router.get("/:id/edit", controller.editForm);
router.post("/:id/edit", controller.update);

// Complete
router.post("/:id/complete", controller.complete);

// Delete
router.post("/:id/delete", controller.delete);

module.exports = router;