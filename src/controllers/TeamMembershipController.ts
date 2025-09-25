import { Request, Response } from "express";
import { TeamMembershipService } from "../services/TeamMembershipService";

export class TeamMembershipController {
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

  static async removeMember(req: Request, res: Response) {
    try {
      const { userId, teamId } = req.body;
      const result = await TeamMembershipService.removeMember(userId, teamId);
      res.json({
        message: result.message,
        data: { userId, teamId }
      });
    } catch (error) {
      if (error instanceof Error && error.message === "La membresía no existe") {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({
          message: "Error al remover miembro",
          error: error instanceof Error ? error.message : "Error desconocido"
        });
      }
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const memberships = await TeamMembershipService.getAll();
      res.json({
        message: "Membresías obtenidas correctamente",
        data: memberships
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener membresías",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }
}