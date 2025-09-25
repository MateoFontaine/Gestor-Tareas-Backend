"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
class UserController {
    // Obtener todos los usuarios
    static async getAll(req, res) {
        try {
            const users = await UserService_1.UserService.getAll();
            res.json({
                message: "Usuarios obtenidos correctamente",
                data: users
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Error al obtener usuarios",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }
    // Crear un nuevo usuario
    static async create(req, res) {
        try {
            const user = await UserService_1.UserService.create(req.body);
            res.status(201).json({
                message: "Usuario creado correctamente",
                data: user
            });
        }
        catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }
    // Obtener usuario por ID
    static async getById(req, res) {
        console.log("=== getById fue llamado ===");
        console.log("Parámetros recibidos:", req.params);
        res.json({
            message: "Debug mode",
            receivedId: req.params.id,
            parsedId: parseInt(req.params.id)
        });
    }
}
exports.UserController = UserController;
