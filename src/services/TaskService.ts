import { AppDataSource } from "../config/database";
import { Task, TaskStatus, TaskPriority } from "../entities/Task";

export class TaskService {
  private static taskRepository = AppDataSource.getRepository(Task);

  static async getAll(): Promise<Task[]> {
    return await this.taskRepository.find({
      relations: ["team", "team.owner", "createdBy", "assignedTo", "tags", "comments"],
      order: { createdAt: "DESC" }
    });
  }

  static async getById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ["team", "team.owner", "createdBy", "assignedTo", "tags", "comments"]
    });

    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    return task;
  }

  static async create(taskData: {
    title: string;
    description?: string;
    teamId: number;
    createdById: number;
    status?: TaskStatus;
    priority?: TaskPriority;
    assignedToId?: number;
    dueDate?: string;
  }): Promise<Task> {
    const task = this.taskRepository.create({
      ...taskData,
      status: taskData.status || TaskStatus.PENDING,
      priority: taskData.priority || TaskPriority.MEDIUM,
    });

    const savedTask = await this.taskRepository.save(task);
    return this.getById(savedTask.id);
  }

  static async update(
    id: number,
    updates: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      assignedToId?: number;
      dueDate?: string;
    }
  ): Promise<Task> {
    const task = await this.getById(id);
    Object.assign(task, updates);
    await this.taskRepository.save(task);
    return this.getById(id);
  }

  static async delete(id: number): Promise<{ id: number; title: string }> {
    const task = await this.getById(id);
    
    // Eliminar relaciones con tags
    await this.taskRepository
      .createQueryBuilder()
      .relation(Task, "tags")
      .of(id)
      .remove(task.tags);
    
    await this.taskRepository.remove(task);
    return { id, title: task.title };
  }

  static async addTagToTask(taskId: number, tagId: number): Promise<Task> {
    const task = await this.getById(taskId);
    
    await this.taskRepository
      .createQueryBuilder()
      .relation(Task, "tags")
      .of(task)
      .add(tagId);

    return this.getById(taskId);
  }

  static async removeTagFromTask(taskId: number, tagId: number): Promise<Task> {
    const task = await this.getById(taskId);
    
    await this.taskRepository
      .createQueryBuilder()
      .relation(Task, "tags")
      .of(task)
      .remove(tagId);

    return this.getById(taskId);
  }
}