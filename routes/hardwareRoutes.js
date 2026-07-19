const express = require("express");

const router = express.Router({ mergeParams: true });

const controller = require("../controllers/hardwareController");

router.get("/", controller.index);

router.get("/new", controller.newForm);

router.post("/new", controller.create);

router.get("/:id/edit", controller.editForm);

router.post("/:id/edit", controller.update);

router.post("/:id/delete", controller.delete);

module.exports = router;
