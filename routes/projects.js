const express = require("express");
const router = express.Router();

const controller = require("../controllers/projectController");

// List projects
router.get("/", controller.index);

// Create
router.get("/new", controller.newForm);
router.post("/new", controller.create);

// Edit
router.get("/edit/:id", controller.editForm);
router.post("/edit/:id", controller.update);

// Delete (POST is safer than GET)
router.post("/delete/:id", controller.delete);

// Project dashboard
router.get("/:id", controller.details);

module.exports = router;