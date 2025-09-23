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
  password: "Mateo200430", // ← CAMBIÁ ESTO por tu contraseña
  database: "gestor_tareas",
  synchronize: true, // ← Esto crea las tablas automáticamente (solo para desarrollo)
  logging: true, // ← Para ver las consultas SQL en la consola
  entities: [
    User,
    Team,
    Task,
    Comment,
    TeamMembership, // ← Agregamos la entidad User
  ],
});