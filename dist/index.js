"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const database_1 = require("./config/database");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const teamMembershipRoutes_1 = __importDefault(require("./routes/teamMembershipRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Ruta de prueba
app.get("/", (req, res) => {
    res.json({ message: "¡Gestor de Tareas API funcionando!" });
});
// Rutas de usuarios
app.use("/users", userRoutes_1.default);
// Rutas de equipos
app.use("/teams", teamRoutes_1.default);
// Rutas de tareas
app.use("/tasks", taskRoutes_1.default);
// Rutas de comentarios
app.use("/comments", commentRoutes_1.default);
// Rutas de membresías de equipo
app.use("/memberships", teamMembershipRoutes_1.default);
// Nueva ruta para probar la conexión a la BD
app.get("/test-db", async (req, res) => {
    try {
        if (database_1.AppDataSource.isInitialized) {
            res.json({ message: "Base de datos conectada correctamente!" });
        }
        else {
            res.status(500).json({ message: "Base de datos no conectada" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error en la base de datos", error });
    }
});
// Inicializar la conexión a la base de datos y arrancar el servidor
database_1.AppDataSource.initialize()
    .then(() => {
    console.log("✅ Base de datos conectada");
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
})
    .catch((error) => {
    console.error("❌ Error conectando a la base de datos:", error);
});
