import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Team } from "../entities/Team";
import { Task } from "../entities/Task";
import { Comment } from "../entities/Comment";
import { TeamMembership } from "../entities/TeamMembership";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "gestor_tareas",
  synchronize: process.env.DB_SYNCHRONIZE === "true",
  logging: process.env.DB_LOGGING === "true",
  entities: [
    User,
    Team,
    Task,
    Comment,
    TeamMembership,
  ],
  migrations: ["src/migrations/*.ts"],
  migrationsRun: process.env.DB_MIGRATIONS_RUN === "true",
});