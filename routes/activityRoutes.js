const express = require("express");
const router = express.Router();

const controller = require("../controllers/activityController");

router.get("/", controller.index);

router.get("/new", controller.showForm);
router.post("/new", controller.create);

// NEW
router.get("/:id/edit", controller.editForm);
router.post("/:id/edit", controller.update);

router.post("/:id/delete", controller.delete);

module.exports = router;
