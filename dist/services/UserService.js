"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
class UserService {
    // Obtener todos los usuarios
    static async getAll() {
        return await this.userRepository.find();
    }
    // Crear un nuevo usuario
    static async create(userData) {
        const { email, password, firstName, lastName } = userData;
        // Validar que todos los campos están presentes
        if (!email || !password || !firstName || !lastName) {
            throw new Error("Todos los campos son obligatorios");
        }
        // Validar formato de email básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("El formato del email no es válido");
        }
        // Verificar que el email no existe
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error("Ya existe un usuario con este email");
        }
        // Crear nuevo usuario
        const newUser = this.userRepository.create({
            email,
            password, // TODO: encriptar después
            firstName,
            lastName
        });
        return await this.userRepository.save(newUser);
    }
    // Obtener usuario por ID
    static async getById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return user;
    }
    // Buscar usuario por email
    static async getByEmail(email) {
        return await this.userRepository.findOne({ where: { email } });
    }
}
exports.UserService = UserService;
UserService.userRepository = database_1.AppDataSource.getRepository(User_1.User);
