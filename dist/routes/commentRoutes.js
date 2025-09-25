"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CommentController_1 = require("../controllers/CommentController");
const router = (0, express_1.Router)();
// POST /comments - Crear un nuevo comentario
router.post("/", CommentController_1.CommentController.create);
// GET /comments - Obtener todos los comentarios
router.get("/", CommentController_1.CommentController.getAll);
// GET /comments/task/:taskId - Obtener comentarios de una tarea específica
router.get("/task/:taskId", CommentController_1.CommentController.getByTask);
exports.default = router;
