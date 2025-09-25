"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const database_1 = require("../config/database");
const Task_1 = require("../entities/Task");
const User_1 = require("../entities/User");
const Team_1 = require("../entities/Team");
const allowedTransitions = {
    [Task_1.TaskStatus.PENDING]: [Task_1.TaskStatus.IN_PROGRESS, Task_1.TaskStatus.CANCELLED],
    [Task_1.TaskStatus.IN_PROGRESS]: [Task_1.TaskStatus.COMPLETED, Task_1.TaskStatus.CANCELLED],
    [Task_1.TaskStatus.COMPLETED]: [],
    [Task_1.TaskStatus.CANCELLED]: []
};
class TaskService {
    static async getAll() {
        return await this.taskRepository.find({
            relations: ["team", "createdBy", "assignedTo"]
        });
    }
    static async create(taskData) {
        if (taskData.dueDate) {
            const dueDate = new Date(taskData.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dueDate < today) {
                throw new Error("La fecha límite no puede ser en el pasado");
            }
        }
        const newTask = this.taskRepository.create({
            title: taskData.title,
            description: taskData.description,
            teamId: taskData.teamId,
            createdById: taskData.createdById,
            assignedToId: taskData.assignedToId,
            priority: taskData.priority || Task_1.TaskPriority.MEDIUM,
            dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined
        });
        return await this.taskRepository.save(newTask);
    }
    static async update(id, updates) {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ["team", "createdBy", "assignedTo"]
        });
        if (!task) {
            throw new Error("Tarea no encontrada");
        }
        if (task.status === Task_1.TaskStatus.COMPLETED || task.status === Task_1.TaskStatus.CANCELLED) {
            throw new Error("No se puede editar una tarea que está finalizada o cancelada");
        }
        if (updates.status && updates.status !== task.status) {
            const transitions = allowedTransitions[task.status];
            if (!transitions || !transitions.includes(updates.status)) {
                throw new Error(`Transición de estado no válida de '${task.status}' a '${updates.status}'`);
            }
        }
        if (updates.dueDate) {
            const dueDate = new Date(updates.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dueDate < today) {
                throw new Error("La fecha límite no puede ser en el pasado");
            }
        }
        Object.assign(task, updates);
        if (updates.dueDate) {
            task.dueDate = new Date(updates.dueDate);
        }
        return await this.taskRepository.save(task);
    }
}
exports.TaskService = TaskService;
TaskService.taskRepository = database_1.AppDataSource.getRepository(Task_1.Task);
TaskService.userRepository = database_1.AppDataSource.getRepository(User_1.User);
TaskService.teamRepository = database_1.AppDataSource.getRepository(Team_1.Team);
