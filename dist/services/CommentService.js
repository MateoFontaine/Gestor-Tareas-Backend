"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const database_1 = require("../config/database");
const Comment_1 = require("../entities/Comment");
const User_1 = require("../entities/User");
const Task_1 = require("../entities/Task");
class CommentService {
    // Obtener todos los comentarios
    static async getAll() {
        return await this.commentRepository.find({
            relations: ["task", "author"],
            order: { createdAt: "DESC" }
        });
    }
    // Crear un nuevo comentario
    static async create(commentData) {
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
    static async getByTask(taskId) {
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
exports.CommentService = CommentService;
CommentService.commentRepository = database_1.AppDataSource.getRepository(Comment_1.Comment);
CommentService.userRepository = database_1.AppDataSource.getRepository(User_1.User);
CommentService.taskRepository = database_1.AppDataSource.getRepository(Task_1.Task);
