const express = require("express");
const router = express.Router();

const controller = require("../controllers/taskController");


router.get("/", controller.index);

router.get("/new", controller.showForm);

router.post("/new", controller.create);

module.exports = router;