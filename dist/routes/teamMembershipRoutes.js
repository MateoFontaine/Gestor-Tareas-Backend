"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TeamMembershipController_1 = require("../controllers/TeamMembershipController");
const router = (0, express_1.Router)();
// POST /memberships - Agregar usuario a equipo
router.post("/", TeamMembershipController_1.TeamMembershipController.addMember);
// GET /memberships/team/:teamId - Miembros de un equipo
router.get("/team/:teamId", TeamMembershipController_1.TeamMembershipController.getTeamMembers);
// GET /memberships/user/:userId - Equipos de un usuario
router.get("/user/:userId", TeamMembershipController_1.TeamMembershipController.getUserTeams);
exports.default = router;
