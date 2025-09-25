import { AppDataSource } from "../config/database";
import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import { Task } from "../entities/Task";

export class CommentService {
  private static commentRepository = AppDataSource.getRepository(Comment);
  private static userRepository = AppDataSource.getRepository(User);
  private static taskRepository = AppDataSource.getRepository(Task);

  static async getAll(): Promise<Comment[]> {
    return await this.commentRepository.find({
      relations: ["task", "author"],
      order: { createdAt: "DESC" }
    });
  }

  static async create(commentData: {
    content: string;
    taskId: number;
    authorId: number;
  }): Promise<Comment> {
    const { content, taskId, authorId } = commentData;

    if (!content || !taskId || !authorId) {
      throw new Error("El contenido, tarea y autor son obligatorios");
    }

    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new Error("Tarea no encontrada");
    }

    const author = await this.userRepository.findOne({ where: { id: authorId } });
    if (!author) {
      throw new Error("Usuario autor no encontrado");
    }

    const newComment = this.commentRepository.create({
      content,
      taskId,
      authorId
    });

    const savedComment = await this.commentRepository.save(newComment);

    const commentWithRelations = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ["task", "author"]
    });

    if (!commentWithRelations) {
      throw new Error("Error al obtener el comentario creado");
    }

    return commentWithRelations;
  }

  static async getByTask(taskId: number): Promise<Comment[]> {
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

  static async getById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ["task", "author"]
    });

    if (!comment) {
      throw new Error("Comentario no encontrado");
    }

    return comment;
  }

  static async delete(id: number): Promise<{ id: number; content: string }> {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new Error("Comentario no encontrado");
    }

    await this.commentRepository.remove(comment);
    return { id, content: comment.content };
  }
}