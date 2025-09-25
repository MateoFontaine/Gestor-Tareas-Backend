"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TeamController_1 = require("../controllers/TeamController");
const router = (0, express_1.Router)();
// GET /teams - Obtener todos los equipos
router.get("/", TeamController_1.TeamController.getAll);
// POST /teams - Crear un nuevo equipo
router.post("/", TeamController_1.TeamController.create);
exports.default = router;
