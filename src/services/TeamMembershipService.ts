import { AppDataSource } from "../config/database";
import { TeamMembership, MemberRole } from "../entities/TeamMembership";
import { User } from "../entities/User";
import { Team } from "../entities/Team";

export class TeamMembershipService {
  private static membershipRepository = AppDataSource.getRepository(TeamMembership);
  private static userRepository = AppDataSource.getRepository(User);
  private static teamRepository = AppDataSource.getRepository(Team);

  static async addMember(membershipData: {
    userId: number;
    teamId: number;
    role?: MemberRole;
  }): Promise<TeamMembership> {
    const { userId, teamId, role = MemberRole.MEMBER } = membershipData;

    if (!userId || !teamId) {
      throw new Error("El usuario y equipo son obligatorios");
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new Error("Equipo no encontrado");
    }

    const existingMembership = await this.membershipRepository.findOne({
      where: { userId, teamId }
    });
    
    if (existingMembership) {
      throw new Error("El usuario ya es miembro de este equipo");
    }

    const newMembership = this.membershipRepository.create({
      userId,
      teamId,
      role
    });

    const savedMembership = await this.membershipRepository.save(newMembership);

    const membershipWithRelations = await this.membershipRepository.findOne({
      where: { id: savedMembership.id },
      relations: ["user", "team"]
    });

    if (!membershipWithRelations) {
      throw new Error("Error al obtener la membresía creada");
    }

    return membershipWithRelations;
  }

  static async getTeamMembers(teamId: number): Promise<TeamMembership[]> {
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

  static async getUserTeams(userId: number): Promise<TeamMembership[]> {
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

  static async removeMember(userId: number, teamId: number): Promise<{ message: string }> {
    const membership = await this.membershipRepository.findOne({
      where: { userId, teamId },
      relations: ["user", "team"]
    });

    if (!membership) {
      throw new Error("La membresía no existe");
    }

    await this.membershipRepository.remove(membership);

    return { 
      message: `Usuario removido del equipo correctamente` 
    };
  }

  static async getAll(): Promise<TeamMembership[]> {
    return await this.membershipRepository.find({
      relations: ["user", "team"],
      order: { joinedAt: "DESC" }
    });
  }
}