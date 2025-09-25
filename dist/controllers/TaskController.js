"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const TaskService_1 = require("../services/TaskService");
class TaskController {
    static async getAll(req, res) {
        try {
            const tasks = await TaskService_1.TaskService.getAll();
            res.json(tasks);
        }
        catch (error) {
            res.status(500).json({ message: "Error al obtener tareas" });
        }
    }
    static async create(req, res) {
        try {
            const createdTask = await TaskService_1.TaskService.create(req.body);
            res.status(201).json(createdTask);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: "Error interno al crear tarea" });
        }
    }
    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const updatedTask = await TaskService_1.TaskService.update(id, req.body);
            res.json(updatedTask);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("Tarea no encontrada")) {
                    return res.status(404).json({ message: error.message });
                }
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error interno" });
        }
    }
}
exports.TaskController = TaskController;
