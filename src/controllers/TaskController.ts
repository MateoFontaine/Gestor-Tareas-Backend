import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";

export class TaskController {
  static async getAll(req: Request, res: Response) {
    try {
      const tasks = await TaskService.getAll();
      res.json({
        message: "Tareas obtenidas correctamente",
        data: tasks
      });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener tareas" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const task = await TaskService.create(req.body);
      res.status(201).json({
        message: "Tarea creada correctamente",
        data: task
      });
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Error al crear tarea"
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updatedTask = await TaskService.update(id, req.body);
      res.json({
        message: "Tarea actualizada correctamente",
        data: updatedTask
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("no encontrada")) {
          return res.status(404).json({ message: error.message });
        }
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error interno" });
    }
  }
}