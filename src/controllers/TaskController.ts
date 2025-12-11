import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { TaskStatus } from "../entities/Task"; // Importante importar esto

export class TaskController {
  
  // --- MODIFICADO: Lee query params (page, limit, teamId, status) ---
  static async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const teamId = req.query.teamId ? parseInt(req.query.teamId as string) : undefined;
      const status = req.query.status ? (req.query.status as TaskStatus) : undefined;
      
      // NUEVO: Leemos tagId
      const tagId = req.query.tagId ? parseInt(req.query.tagId as string) : undefined;

      // Pasamos los 5 argumentos
      const result = await TaskService.getAll(page, limit, teamId, status, tagId);
      
      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener tareas",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const task = await TaskService.create(req.body);
      res.status(201).json({ message: "Tarea creada correctamente", data: task });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Error al crear tarea" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const taskId = parseInt(req.params.id);
      const userId = req.body.modifiedBy || 1; 

      const updatedTask = await TaskService.update(taskId, req.body, userId);
      res.json({ message: "Tarea actualizada correctamente", data: updatedTask });
    } catch (error) {
      if (error instanceof Error) {
        // Manejo inteligente de errores de negocio
        if (error.message.includes("No puedes cerrar") || error.message.includes("Ciclo")) {
           return res.status(409).json({ message: error.message });
        }
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error interno" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const task = await TaskService.getById(parseInt(req.params.id));
      res.json({ data: task });
    } catch (error) {
      res.status(404).json({ message: error instanceof Error ? error.message : "Error" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await TaskService.delete(parseInt(req.params.id));
      res.json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Error" });
    }
  }

  static async addTag(req: Request, res: Response) {
    try {
      const { taskId, tagId } = req.params;
      const result = await TaskService.addTagToTask(parseInt(taskId), parseInt(tagId));
      res.json({ data: result });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Error" });
    }
  }

  static async removeTag(req: Request, res: Response) {
    try {
      const { taskId, tagId } = req.params;
      const result = await TaskService.removeTagFromTask(parseInt(taskId), parseInt(tagId));
      res.json({ data: result });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Error" });
    }
  }

  // --- DEPENDENCIAS ---

  static async addDependency(req: Request, res: Response) {
    try {
      const { taskId } = req.params; 
      const { targetTaskId, type, note } = req.body; 

      const result = await TaskService.addDependency({
        sourceTaskId: parseInt(taskId),
        targetTaskId: parseInt(targetTaskId),
        type,
        note
      });
      res.status(201).json({ message: "Dependencia creada", data: result });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Error" });
    }
  }

  static async getDependencies(req: Request, res: Response) {
    try {
      const result = await TaskService.getDependencies(parseInt(req.params.taskId));
      res.json({ data: result });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : "Error" });
    }
  }

  static async removeDependency(req: Request, res: Response) {
    try {
      const { id } = req.params; 
      await TaskService.removeDependency(parseInt(id));
      res.json({ message: "Dependencia eliminada" });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Error" });
    }
  }

  static async getHistory(req: Request, res: Response) {
    try {
      const history = await TaskService.getHistory(parseInt(req.params.taskId));
      res.json({ data: history });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener historial" });
    }
  }
}