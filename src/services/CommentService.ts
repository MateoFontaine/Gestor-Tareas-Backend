import { AppDataSource } from "../config/database";
import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import { Task } from "../entities/Task";

export class CommentService {
  private static commentRepository = AppDataSource.getRepository(Comment);
  private static userRepository = AppDataSource.getRepository(User);
  private static taskRepository = AppDataSource.getRepository(Task);

  // Obtener todos los comentarios
  static async getAll(): Promise<Comment[]> {
    return await this.commentRepository.find({
      relations: ["task", "author"],
      order: { createdAt: "DESC" }
    });
  }

  // Crear un nuevo comentario
  static async create(commentData: {
    content: string;
    taskId: number;
    authorId: number;
  }): Promise<Comment> {
    const { content, taskId, authorId } = commentData;

    // Validar campos obligatorios
    if (!content || !taskId || !authorId) {
      throw new Error("El contenido, tarea y autor son obligatorios");
    }

    // Verificar que la tarea existe
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    // Verificar que el autor existe
    const author = await this.userRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new Error("Usuario autor no encontrado");
    }

    // Crear nuevo comentario
    const newComment = this.commentRepository.create({
      content,
      taskId,
      authorId
    });

    const savedComment = await this.commentRepository.save(newComment);

    // Retornar con relaciones
    const commentWithRelations = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ["task", "author"]
    });

    if (!commentWithRelations) {
      throw new Error("Error al obtener el comentario creado");
    }

    return commentWithRelations;
  }

  // Obtener comentarios de una tarea específica
  static async getByTask(taskId: number): Promise<Comment[]> {
    // Verificar que la tarea existe
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    return await this.commentRepository.find({
      where: { taskId },
      relations: ["author", "task"],
      order: { createdAt: "ASC" }
    });
  }
}