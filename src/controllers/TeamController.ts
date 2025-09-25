import { Request, Response } from "express";
import { TeamService } from "../services/TeamService";

export class TeamController {
  // Obtener todos los equipos
  static async getAll(req: Request, res: Response) {
    try {
      const teams = await TeamService.getAll();
      res.json({
        message: "Equipos obtenidos correctamente",
        data: teams
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener equipos",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  // Crear un nuevo equipo
  static async create(req: Request, res: Response) {
    try {
      const team = await TeamService.create(req.body);
      res.status(201).json({
        message: "Equipo creado correctamente",
        data: team
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  // Eliminar un equipo
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await TeamService.delete(parseInt(id));
      res.json({
        message: "Equipo eliminado correctamente",
        data: result
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("tareas pendientes")) {
        res.status(400).json({
          message: error.message
        });
      } else if (error instanceof Error && error.message === "Equipo no encontrado") {
        res.status(404).json({
          message: error.message
        });
      } else {
        res.status(500).json({
          message: "Error al eliminar equipo",
          error: error instanceof Error ? error.message : "Error desconocido"
        });
      }
    }
  }
}