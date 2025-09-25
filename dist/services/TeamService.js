"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
const database_1 = require("../config/database");
const Team_1 = require("../entities/Team");
const User_1 = require("../entities/User");
const Task_1 = require("../entities/Task");
class TeamService {
    // Obtener todos los equipos
    static async getAll() {
        return await this.teamRepository.find({
            relations: ["owner"]
        });
    }
    // Crear un nuevo equipo
    static async create(teamData) {
        const { name, description, ownerId } = teamData;
        // Validar campos obligatorios
        if (!name || !ownerId) {
            throw new Error("El nombre y el propietario son obligatorios");
        }
        // Verificar que el propietario existe
        const owner = await this.userRepository.findOne({ where: { id: ownerId } });
        if (!owner) {
            throw new Error("Usuario propietario no encontrado");
        }
        // Crear nuevo equipo
        const newTeam = this.teamRepository.create({
            name,
            description,
            ownerId
        });
        const savedTeam = await this.teamRepository.save(newTeam);
        // Retornar con relaciones
        const teamWithOwner = await this.teamRepository.findOne({
            where: { id: savedTeam.id },
            relations: ["owner"]
        });
        if (!teamWithOwner) {
            throw new Error("Error al obtener el equipo creado");
        }
        return teamWithOwner;
    }
    // Obtener equipo por ID
    static async getById(id) {
        const team = await this.teamRepository.findOne({
            where: { id },
            relations: ["owner"]
        });
        if (!team) {
            throw new Error("Equipo no encontrado");
        }
        return team;
    }
    // Eliminar equipo con validación de tareas activas
    static async delete(id) {
        // Verificar que el equipo existe
        const team = await this.teamRepository.findOne({ where: { id } });
        if (!team) {
            throw new Error("Equipo no encontrado");
        }
        // Verificar si tiene tareas Pendientes o En curso
        const activeTasks = await this.taskRepository.find({
            where: [
                { teamId: id, status: Task_1.TaskStatus.PENDING },
                { teamId: id, status: Task_1.TaskStatus.IN_PROGRESS }
            ]
        });
        if (activeTasks.length > 0) {
            throw new Error(`No se puede eliminar el equipo porque tiene ${activeTasks.length} tareas pendientes o en curso`);
        }
        // Eliminar el equipo
        await this.teamRepository.remove(team);
        return { id, name: team.name };
    }
}
exports.TeamService = TeamService;
TeamService.teamRepository = database_1.AppDataSource.getRepository(Team_1.Team);
TeamService.userRepository = database_1.AppDataSource.getRepository(User_1.User);
TeamService.taskRepository = database_1.AppDataSource.getRepository(Task_1.Task);
