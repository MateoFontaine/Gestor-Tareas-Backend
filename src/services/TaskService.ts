import { AppDataSource } from "../config/database";
import { Task, TaskStatus, TaskPriority } from "../entities/Task";
import { User } from "../entities/User";
import { Team } from "../entities/Team";

export class TaskService {
  private static taskRepository = AppDataSource.getRepository(Task);
  private static userRepository = AppDataSource.getRepository(User);
  private static teamRepository = AppDataSource.getRepository(Team);

  static async getAll(): Promise<Task[]> {
    return await this.taskRepository.find({
      relations: ["team", "createdBy", "assignedTo"]
    });
  }

  static async create(taskData: {
    title: string;
    description?: string;
    teamId: number;
    createdById: number;
    assignedToId?: number;
    priority?: TaskPriority;
    dueDate?: string;
  }): Promise<Task> {
    const { title, description, teamId, createdById, assignedToId, priority, dueDate } = taskData;

    if (!title || !teamId || !createdById) {
      throw new Error("El título, equipo y creador son obligatorios");
    }

    if (dueDate) {
      const dueDateObj = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDateObj.setHours(0, 0, 0, 0);
      if (dueDateObj.getTime() < today.getTime()) {
        throw new Error("La fecha límite no puede ser en el pasado");
      }
    }

    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new Error("Equipo no encontrado");
    }

    const createdBy = await this.userRepository.findOne({ where: { id: createdById } });
    if (!createdBy) {
      throw new Error("Usuario creador no encontrado");
    }

    if (assignedToId) {
      const assignedTo = await this.userRepository.findOne({ where: { id: assignedToId } });
      if (!assignedTo) {
        throw new Error("Usuario asignado no encontrado");
      }
    }

    const newTask = this.taskRepository.create({
      title,
      description,
      teamId,
      createdById,
      assignedToId,
      priority: priority || TaskPriority.MEDIUM,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    return await this.taskRepository.save(newTask);
  }

  static async update(id: number, updates: any): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ["team", "createdBy", "assignedTo"]
    });

    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    // REGLA: Las tareas finalizadas o canceladas NO pueden cambiar de estado
    if ((task.status === "finalizada" || task.status === "cancelada") && updates.status) {
      throw new Error("Las tareas finalizadas o canceladas no pueden cambiar de estado");
    }

    // REGLA: No editar tareas finalizadas o canceladas
    if (task.status === "finalizada" || task.status === "cancelada") {
      throw new Error("No se pueden editar tareas finalizadas o canceladas");
    }

    // REGLA: Transiciones válidas simples
    if (updates.status && updates.status !== task.status) {
      if (task.status === "pendiente") {
        if (updates.status !== "en_curso" && updates.status !== "cancelada") {
          throw new Error("Desde pendiente solo se puede ir a en_curso o cancelada");
        }
      } else if (task.status === "en_curso") {
        if (updates.status !== "finalizada" && updates.status !== "cancelada") {
          throw new Error("Desde en_curso solo se puede ir a finalizada o cancelada");
        }
      }
    }

    if (updates.dueDate) {
      const dueDateObj = new Date(updates.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDateObj.setHours(0, 0, 0, 0);
      if (dueDateObj.getTime() < today.getTime()) {
        throw new Error("La fecha límite no puede ser en el pasado");
      }
    }

    if (updates.title !== undefined) task.title = updates.title;
    if (updates.description !== undefined) task.description = updates.description;
    if (updates.priority !== undefined) task.priority = updates.priority;
    if (updates.assignedToId !== undefined) task.assignedToId = updates.assignedToId;
    if (updates.status !== undefined) task.status = updates.status;
    if (updates.dueDate !== undefined) task.dueDate = new Date(updates.dueDate);

    return await this.taskRepository.save(task);
  }
}