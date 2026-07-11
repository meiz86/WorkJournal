const express = require("express");

const router = express.Router();

const taskController = require("../controllers/taskController");

router.get("/", taskController.index);

router.get("/new", taskController.showForm);

router.post("/new", taskController.create);
router.get("/:id/edit", taskController.editForm);

router.post("/:id/edit", taskController.update);

router.post("/:id/complete", taskController.complete);

router.post("/:id/delete", taskController.delete);

module.exports = router;
