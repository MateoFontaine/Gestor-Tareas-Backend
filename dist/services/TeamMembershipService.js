"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMembershipService = void 0;
const database_1 = require("../config/database");
const TeamMembership_1 = require("../entities/TeamMembership");
const User_1 = require("../entities/User");
const Team_1 = require("../entities/Team");
class TeamMembershipService {
    // Agregar usuario a un equipo
    static async addMember(membershipData) {
        const { userId, teamId, role = TeamMembership_1.MemberRole.MEMBER } = membershipData;
        // Validar campos obligatorios
        if (!userId || !teamId) {
            throw new Error("El usuario y equipo son obligatorios");
        }
        // Verificar que el usuario existe
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        // Verificar que el equipo existe
        const team = await this.teamRepository.findOne({ where: { id: teamId } });
        if (!team) {
            throw new Error("Equipo no encontrado");
        }
        // Verificar si ya es miembro
        const existingMembership = await this.membershipRepository.findOne({
            where: { userId, teamId }
        });
        if (existingMembership) {
            throw new Error("El usuario ya es miembro de este equipo");
        }
        // Crear nueva membresía
        const newMembership = this.membershipRepository.create({
            userId,
            teamId,
            role
        });
        const savedMembership = await this.membershipRepository.save(newMembership);
        // Retornar con relaciones
        const membershipWithRelations = await this.membershipRepository.findOne({
            where: { id: savedMembership.id },
            relations: ["user", "team"]
        });
        if (!membershipWithRelations) {
            throw new Error("Error al obtener la membresía creada");
        }
        return membershipWithRelations;
    }
    // Obtener miembros de un equipo
    static async getTeamMembers(teamId) {
        // Verificar que el equipo existe
        const team = await this.teamRepository.findOne({ where: { id: teamId } });
        if (!team) {
            throw new Error("Equipo no encontrado");
        }
        return await this.membershipRepository.find({
            where: { teamId },
            relations: ["user", "team"],
            order: { joinedAt: "ASC" }
        });
    }
    // Obtener equipos de un usuario
    static async getUserTeams(userId) {
        // Verificar que el usuario existe
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        return await this.membershipRepository.find({
            where: { userId },
            relations: ["user", "team"],
            order: { joinedAt: "DESC" }
        });
    }
    // Remover usuario de un equipo
    static async removeMember(userId, teamId) {
        const membership = await this.membershipRepository.findOne({
            where: { userId, teamId },
            relations: ["user", "team"]
        });
        if (!membership) {
            throw new Error("La membresía no existe");
        }
        await this.membershipRepository.remove(membership);
        return {
            message: `Usuario ${membership.user.firstName} removido del equipo ${membership.team.name}`
        };
    }
}
exports.TeamMembershipService = TeamMembershipService;
TeamMembershipService.membershipRepository = database_1.AppDataSource.getRepository(TeamMembership_1.TeamMembership);
TeamMembershipService.userRepository = database_1.AppDataSource.getRepository(User_1.User);
TeamMembershipService.teamRepository = database_1.AppDataSource.getRepository(Team_1.Team);
