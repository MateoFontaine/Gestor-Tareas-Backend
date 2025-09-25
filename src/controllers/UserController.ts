import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  // Obtener todos los usuarios
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

  // Crear un nuevo usuario
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

  // Obtener usuario por ID
static async getById(req: Request, res: Response) {
  console.log("=== getById fue llamado ===");
  console.log("Parámetros recibidos:", req.params);
  
  res.json({
    message: "Debug mode",
    receivedId: req.params.id,
    parsedId: parseInt(req.params.id)
  });
}
}   