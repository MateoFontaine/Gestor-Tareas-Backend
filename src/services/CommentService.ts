import { AppDataSource } from "../config/database";
import { Comment } from "../entities/Comment";
import { Task } from "../entities/Task";

export class CommentService {
  private static commentRepository = AppDataSource.getRepository(Comment);
  private static taskRepository = AppDataSource.getRepository(Task);

  static async getAll(): Promise<Comment[]> {
    return await this.commentRepository.find({
      relations: ["task", "createdBy"], 
      order: { createdAt: "DESC" }
    });
  }

  static async getByTask(taskId: number): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { taskId },
      relations: ["createdBy"],
      order: { createdAt: "ASC" }
    });
  }

  static async getById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ["task", "createdBy"]
    });
    if (!comment) throw new Error("Comentario no encontrado");
    return comment;
  }

  // AQUÍ ESTABAN LOS ERRORES, YA CORREGIDOS:
  static async create(data: { content: string; taskId: number; createdById: number }) {
    // 1. Verificamos la tarea
    const task = await this.taskRepository.findOneBy({ id: data.taskId });
    if (!task) throw new Error("Tarea no encontrada");

    // 2. Creamos el objeto (Usando createdById, NO authorId)
    const comment = this.commentRepository.create({
      content: data.content,
      taskId: data.taskId,
      createdById: data.createdById // <--- CORRECCIÓN 1: El nombre exacto de la entidad
    });

    const savedComment = await this.commentRepository.save(comment);
    
    // 3. Solucionamos el error de TypeScript sobre el ID
    const result: any = savedComment; 
    const finalId = Array.isArray(result) ? result[0].id : result.id; // <--- CORRECCIÓN 2: Truco para obtener el ID

    return this.getById(finalId);
  }

  static async delete(id: number) {
    const result = await this.commentRepository.delete(id);
    if (result.affected === 0) throw new Error("Comentario no encontrado");
    return { message: "Comentario eliminado" };
  }
}