"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMembershipController = void 0;
const TeamMembershipService_1 = require("../services/TeamMembershipService");
class TeamMembershipController {
    // Agregar usuario a equipo
    static async addMember(req, res) {
        try {
            const membership = await TeamMembershipService_1.TeamMembershipService.addMember(req.body);
            res.status(201).json({
                message: "Usuario agregado al equipo correctamente",
                data: membership
            });
        }
        catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }
    // Obtener miembros de un equipo
    static async getTeamMembers(req, res) {
        try {
            const { teamId } = req.params;
            const members = await TeamMembershipService_1.TeamMembershipService.getTeamMembers(parseInt(teamId));
            res.json({
                message: "Miembros del equipo obtenidos correctamente",
                data: members
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === "Equipo no encontrado") {
                res.status(404).json({
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    message: "Error al obtener miembros del equipo",
                    error: error instanceof Error ? error.message : "Error desconocido"
                });
            }
        }
    }
    // Obtener equipos de un usuario
    static async getUserTeams(req, res) {
        try {
            const { userId } = req.params;
            const teams = await TeamMembershipService_1.TeamMembershipService.getUserTeams(parseInt(userId));
            res.json({
                message: "Equipos del usuario obtenidos correctamente",
                data: teams
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === "Usuario no encontrado") {
                res.status(404).json({
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    message: "Error al obtener equipos del usuario",
                    error: error instanceof Error ? error.message : "Error desconocido"
                });
            }
        }
    }
}
exports.TeamMembershipController = TeamMembershipController;
