import { Request, Response } from "express";
import { TeamMembershipService } from "../services/TeamMembershipService";

export class TeamMembershipController {
  // Agregar usuario a equipo
  static async addMember(req: Request, res: Response) {
    try {
      const membership = await TeamMembershipService.addMember(req.body);
      res.status(201).json({
        message: "Usuario agregado al equipo correctamente",
        data: membership
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  // Obtener miembros de un equipo
  static async getTeamMembers(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const members = await TeamMembershipService.getTeamMembers(parseInt(teamId));
      res.json({
        message: "Miembros del equipo obtenidos correctamente",
        data: members
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Equipo no encontrado") {
        res.status(404).json({
          message: error.message
        });
      } else {
        res.status(500).json({
          message: "Error al obtener miembros del equipo",
          error: error instanceof Error ? error.message : "Error desconocido"
        });
      }
    }
  }

  // Obtener equipos de un usuario
  static async getUserTeams(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const teams = await TeamMembershipService.getUserTeams(parseInt(userId));
      res.json({
        message: "Equipos del usuario obtenidos correctamente",
        data: teams
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Usuario no encontrado") {
        res.status(404).json({
          message: error.message
        });
      } else {
        res.status(500).json({
          message: "Error al obtener equipos del usuario",
          error: error instanceof Error ? error.message : "Error desconocido"
        });
      }
    }
  }
}