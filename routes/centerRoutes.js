const express = require("express");
const router = express.Router();

const controller = require("../controllers/centerController");

router.get("/", controller.index);

router.get("/new", controller.newForm);
router.post("/new", controller.create);

router.get("/edit/:id", controller.editForm);
router.post("/edit/:id", controller.update);

router.get("/delete/:id", controller.delete);

module.exports = router;
