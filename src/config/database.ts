import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Team } from "../entities/Team";
import { Task } from "../entities/Task";
import { Comment } from "../entities/Comment";
import { TeamMembership } from "../entities/TeamMembership";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Mateo200430",
  database: "gestor_tareas",
  synchronize: false, // ← CAMBIO: ahora usamos migraciones
  logging: true,
  entities: [
    User,
    Team,
    Task,
    Comment,
    TeamMembership,
  ],
  migrations: ["src/migrations/*.ts"], // ← Carpeta de migraciones
  migrationsRun: true, // ← Ejecuta migraciones automáticamente al iniciar
});