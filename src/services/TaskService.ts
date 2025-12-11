import { AppDataSource } from "../config/database";
import { Task, TaskStatus, TaskPriority } from "../entities/Task";
import { TaskDependency, DependencyType } from "../entities/TaskDependency";
import { TaskHistory } from "../entities/TaskHistory";

export class TaskService {
  private static taskRepository = AppDataSource.getRepository(Task);
  private static dependencyRepository = AppDataSource.getRepository(TaskDependency);
  private static historyRepository = AppDataSource.getRepository(TaskHistory);

  // 1. OBTENER TODAS (Con filtros y alias corregidos)
  static async getAll(page: number = 1, limit: number = 10, teamId?: number, status?: TaskStatus, tagId?: number) {
    const skip = (page - 1) * limit;

    const query = this.taskRepository.createQueryBuilder("task")
      .leftJoinAndSelect("task.team", "team")
      .leftJoinAndSelect("team.owner", "owner")
      .leftJoinAndSelect("task.createdBy", "createdBy")
      .leftJoinAndSelect("task.assignedTo", "assignedTo")
      .leftJoinAndSelect("task.tags", "tags") 
      .leftJoinAndSelect("task.comments", "comments")
      .leftJoinAndSelect("comments.createdBy", "commentUser") // Autor del comentario
      .leftJoinAndSelect("task.outgoingDependencies", "outgoingDependencies")
      .leftJoinAndSelect("task.incomingDependencies", "incomingDependencies")
      .orderBy("task.createdAt", "DESC")
      .skip(skip)
      .take(limit);

    if (teamId) query.andWhere("task.teamId = :teamId", { teamId });
    if (status) query.andWhere("task.status = :status", { status });
    if (tagId) query.andWhere("tags.id = :tagId", { tagId });

    const [tasks, total] = await query.getManyAndCount();

    return {
      data: tasks,
      meta: {
        totalItems: total,
        itemCount: tasks.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      }
    };
  }

  // 2. OBTENER POR ID (Con todas las relaciones)
  static async getById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: [
        "team", "team.owner", "createdBy", "assignedTo", 
        "tags", 
        "comments", "comments.createdBy",
        "outgoingDependencies", "outgoingDependencies.targetTask", // <--- IMPORTANTE
        "incomingDependencies", "incomingDependencies.sourceTask"  // <--- IMPORTANTE
      ],
      order: { comments: { createdAt: "ASC" } }
    });

    if (!task) throw new Error("Tarea no encontrada");
    return task;
  }

  // 3. CREAR TAREA (Con validación de fecha)
  static async create(taskData: any): Promise<Task> {
    if (taskData.dueDate) {
        const selectedDate = new Date(taskData.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) throw new Error("No puedes crear una tarea con fecha pasada.");
    }

    const task = this.taskRepository.create({
      ...taskData,
      status: taskData.status || TaskStatus.PENDING,
      priority: taskData.priority || TaskPriority.MEDIUM,
    });
    
    const savedTask = await this.taskRepository.save(task);
    const result: any = savedTask; 
    const finalId = Array.isArray(result) ? result[0].id : result.id;

    await this.logHistory(finalId, taskData.createdById, "CREACION", "Tarea creada");
    return this.getById(finalId);
  }

  // 4. ACTUALIZAR (Con validación de bloqueos y fechas)
  static async update(id: number, updates: Partial<Task>, userId: number): Promise<Task> {
    const task = await this.getById(id);
    const oldStatus = task.status;

    // Validar fecha
    if (updates.dueDate) {
        const selectedDate = new Date(updates.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) throw new Error("No puedes cambiar la fecha a un día pasado.");
    }

    // Validar Bloqueos al cerrar
    if (updates.status && (updates.status === TaskStatus.COMPLETED || updates.status === TaskStatus.CANCELLED)) {
      // Buscamos dependencias frescas
      const blockers = await this.dependencyRepository.find({
        where: { sourceTaskId: id, type: DependencyType.DEPENDS_ON },
        relations: ["targetTask"]
      });

      const incompleteBlockers = blockers.filter(dep => 
        dep.targetTask.status !== TaskStatus.COMPLETED && 
        dep.targetTask.status !== TaskStatus.CANCELLED
      );

      if (incompleteBlockers.length > 0) {
        const names = incompleteBlockers.map(b => b.targetTask.title).join(", ");
        throw new Error(`No puedes cerrar esta tarea porque depende de: ${names}`);
      }
    }

    Object.assign(task, updates);
    await this.taskRepository.save(task);

    if (updates.status && updates.status !== oldStatus) {
      await this.logHistory(id, userId, "CAMBIO_ESTADO", `Estado: ${oldStatus} -> ${updates.status}`);
    }

    return this.getById(id);
  }

  static async delete(id: number) {
    const task = await this.getById(id);
    await this.taskRepository.remove(task);
    return { id, title: task.title };
  }

  // --- DEPENDENCIAS (CORREGIDO PARA TRAER TÍTULOS) ---
  static async getDependencies(taskId: number) {
    return await this.dependencyRepository.find({
      where: [
        { sourceTaskId: taskId }, // Bloqueos (Yo dependo de...)
        { targetTaskId: taskId }  // Bloqueados (Ellos dependen de mí)
      ],
      relations: ["sourceTask", "targetTask"] // <--- ESTO ES LO QUE ARREGLA EL MODAL VACÍO
    });
  }

  static async addDependency(data: { sourceTaskId: number; targetTaskId: number; type: DependencyType; note?: string }) {
    if (data.sourceTaskId === data.targetTaskId) throw new Error("No puedes depender de ti mismo");
    
    // Validación de CICLOS
    const reverse = await this.dependencyRepository.findOne({ where: { sourceTaskId: data.targetTaskId, targetTaskId: data.sourceTaskId } });
    if (reverse) throw new Error("Ciclo detectado: La tarea objetivo ya depende de la origen.");
    
    const existing = await this.dependencyRepository.findOne({ where: { sourceTaskId: data.sourceTaskId, targetTaskId: data.targetTaskId } });
    if (existing) throw new Error("Dependencia existente");
    
    const dep = this.dependencyRepository.create(data);
    return await this.dependencyRepository.save(dep);
  }

  static async removeDependency(id: number) {
    const result = await this.dependencyRepository.delete(id);
    if (result.affected === 0) throw new Error("Dependencia no encontrada");
    return result;
  }

  // --- Auxiliares (Tags / History) ---
  private static async logHistory(taskId: number, userId: number, action: string, description: string) {
    try {
        await this.historyRepository.save(this.historyRepository.create({ taskId, userId: userId || 1, action, description }));
    } catch (e) { console.error(e); }
  }

  static async getHistory(taskId: number) {
      return await this.historyRepository.find({ where: { taskId }, relations: ["user"], order: { createdAt: "DESC" } });
  }

  static async addTagToTask(taskId: number, tagId: number) {
    const task = await this.getById(taskId);
    await this.taskRepository.createQueryBuilder().relation(Task, "tags").of(task).add(tagId);
    return this.getById(taskId);
  }

  static async removeTagFromTask(taskId: number, tagId: number) {
    const task = await this.getById(taskId);
    await this.taskRepository.createQueryBuilder().relation(Task, "tags").of(task).remove(tagId);
    return this.getById(taskId);
  }
}