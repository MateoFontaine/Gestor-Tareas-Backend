import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  static async getAll(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      res.json({
        message: "Usuarios obtenidos correctamente",
        data: users
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener usuarios",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const user = await UserService.create(req.body);
      res.status(201).json({
        message: "Usuario creado correctamente",
        data: user
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getById(parseInt(id));
      res.json({
        message: "Usuario obtenido correctamente",
        data: user
      });
    } catch (error) {
      res.status(404).json({
        message: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }
}