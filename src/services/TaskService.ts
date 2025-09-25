import { AppDataSource } from "../config/database";
import { Task, TaskStatus, TaskPriority } from "../entities/Task";
import { User } from "../entities/User";
import { Team } from "../entities/Team";

const allowedTransitions = {
  [TaskStatus.PENDING]: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
  [TaskStatus.IN_PROGRESS]: [TaskStatus.COMPLETED, TaskStatus.CANCELLED],
  [TaskStatus.COMPLETED]: [],
  [TaskStatus.CANCELLED]: []
};

export class TaskService {
  private static taskRepository = AppDataSource.getRepository(Task);
  private static userRepository = AppDataSource.getRepository(User);
  private static teamRepository = AppDataSource.getRepository(Team);

  static async getAll(): Promise<Task[]> {
    return await this.taskRepository.find({
      relations: ["team", "createdBy", "assignedTo"]
    });
  }

  static async create(taskData: any): Promise<Task> {
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

    if (task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELLED) {
      throw new Error("No se puede editar una tarea que está finalizada o cancelada");
    }

    if (updates.status && updates.status !== task.status) {
      const transitions = allowedTransitions[task.status];
      if (!transitions || !transitions.includes(updates.status)) {
        throw new Error(`No se puede cambiar de ${task.status} a ${updates.status}`);
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

    Object.assign(task, updates);
    if (updates.dueDate) {
      task.dueDate = new Date(updates.dueDate);
    }

    return await this.taskRepository.save(task);
  }

  static async getById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ["team", "createdBy", "assignedTo", "comments", "comments.author"]
    });
    
    if (!task) {
      throw new Error("Tarea no encontrada");
    }
    
    return task;
  }

  static async delete(id: number): Promise<{ id: number; title: string }> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    await this.taskRepository.remove(task);
    return { id, title: task.title };
  }
}