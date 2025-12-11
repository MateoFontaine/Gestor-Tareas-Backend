import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { Team } from "../entities/Team";
import { Tag } from "../entities/Tag";
import { TaskDependency } from "../entities/TaskDependency";
import { TaskHistory } from "../entities/TaskHistory";
import { Comment } from "../entities/Comment";
import { TeamMembership } from "../entities/TeamMembership";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres", // Revisa si tu usuario es 'postgres' o tu nombre
  password: process.env.DB_PASSWORD || "admin", // Revisa tu contraseña
  database: process.env.DB_NAME || "gestor_tareas",
  
  // ¡ESTO ES LO QUE TE VA A SALVAR!
  synchronize: false, 
  
  logging: false, // Lo pongo en false para que no te llene la consola de letras
  entities: [
    User, Team, Task, Tag, TaskDependency, TaskHistory, Comment, TeamMembership
  ],
  subscribers: [],
  migrations: [],
});