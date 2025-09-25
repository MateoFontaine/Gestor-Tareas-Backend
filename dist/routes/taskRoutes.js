"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TaskController_1 = require("../controllers/TaskController");
const router = (0, express_1.Router)();
router.get("/", TaskController_1.TaskController.getAll);
router.post("/", TaskController_1.TaskController.create);
router.put("/:id", TaskController_1.TaskController.update);
exports.default = router;
