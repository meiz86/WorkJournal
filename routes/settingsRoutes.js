const express = require("express");

const router = express.Router();

const controller = require("../controllers/settingsController");

router.get("/", controller.index);

router.get("/:category", controller.category);

router.get("/:category/new", controller.newForm);

router.post("/:category/new", controller.create);

router.get("/:category/delete/:id", controller.delete);

module.exports = router;
