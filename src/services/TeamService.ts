import { AppDataSource } from "../config/database";
import { Team } from "../entities/Team";
import { User } from "../entities/User";
import { Task, TaskStatus } from "../entities/Task";

export class TeamService {
  private static teamRepository = AppDataSource.getRepository(Team);
  private static userRepository = AppDataSource.getRepository(User);
  private static taskRepository = AppDataSource.getRepository(Task);

  static async getAll(): Promise<Team[]> {
    return await this.teamRepository.find({
      relations: ["owner"]
    });
  }

  static async create(teamData: {
    name: string;
    description?: string;
    ownerId: number;
  }): Promise<Team> {
    const { name, description, ownerId } = teamData;

    if (!name || !ownerId) {
      throw new Error("El nombre y el propietario son obligatorios");
    }

    const owner = await this.userRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new Error("Usuario propietario no encontrado");
    }

    const newTeam = this.teamRepository.create({
      name,
      description,
      ownerId
    });

    const savedTeam = await this.teamRepository.save(newTeam);

    const teamWithOwner = await this.teamRepository.findOne({
      where: { id: savedTeam.id },
      relations: ["owner"]
    });

    if (!teamWithOwner) {
      throw new Error("Error al obtener el equipo creado");
    }

    return teamWithOwner;
  }

  static async getById(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ["owner"]
    });
    
    if (!team) {
      throw new Error("Equipo no encontrado");
    }
    
    return team;
  }

  static async delete(id: number): Promise<{ id: number; name: string }> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new Error("Equipo no encontrado");
    }

    const activeTasks = await this.taskRepository.find({
      where: [
        { teamId: id, status: TaskStatus.PENDING },
        { teamId: id, status: TaskStatus.IN_PROGRESS }
      ]
    });

    if (activeTasks.length > 0) {
      throw new Error(`No se puede eliminar el equipo porque tiene ${activeTasks.length} tareas pendientes o en curso`);
    }

    await this.teamRepository.remove(team);
    
    return { id, name: team.name };
  }
}