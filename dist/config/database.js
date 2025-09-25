"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const Team_1 = require("../entities/Team");
const Task_1 = require("../entities/Task");
const Comment_1 = require("../entities/Comment");
const TeamMembership_1 = require("../entities/TeamMembership");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Mateo200430",
    database: "gestor_tareas",
    synchronize: false, // ← CAMBIO: ahora usamos migraciones
    logging: true,
    entities: [
        User_1.User,
        Team_1.Team,
        Task_1.Task,
        Comment_1.Comment,
        TeamMembership_1.TeamMembership,
    ],
    migrations: ["src/migrations/*.ts"], // ← Carpeta de migraciones
    migrationsRun: true, // ← Ejecuta migraciones automáticamente al iniciar
});
