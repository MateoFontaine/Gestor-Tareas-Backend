import { Request, Response } from "express";
import { CommentService } from "../services/CommentService";

export class CommentController {
  // Crear un nuevo comentario
  static async create(req: Request, res: Response) {
    try {
      const comment = await CommentService.create(req.body);
      res.status(201).json({
        message: "Comentario creado correctamente",
        data: comment
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  // Obtener comentarios de una tarea específica
  static async getByTask(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const comments = await CommentService.getByTask(parseInt(taskId));
      res.json({
        message: "Comentarios obtenidos correctamente",
        data: comments
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Tarea no encontrada") {
        res.status(404).json({
          message: error.message
        });
      } else {
        res.status(500).json({
          message: "Error al obtener comentarios",
          error: error instanceof Error ? error.message : "Error desconocido"
        });
      }
    }
  }

  // Obtener todos los comentarios
  static async getAll(req: Request, res: Response) {
    try {
      const comments = await CommentService.getAll();
      res.json({
        message: "Todos los comentarios obtenidos correctamente",
        data: comments
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener comentarios",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }
}