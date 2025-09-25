import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
import taskRoutes from "./routes/taskRoutes";
import commentRoutes from "./routes/commentRoutes";
import membershipRoutes from "./routes/teamMembershipRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "¡Gestor de Tareas API funcionando!" });
});

// Rutas
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.use("/tasks", taskRoutes);
app.use("/comments", commentRoutes);
app.use("/memberships", membershipRoutes);

// Nueva ruta para probar la conexión a la BD
app.get("/test-db", async (req, res) => {
  try {
    if (AppDataSource.isInitialized) {
      res.json({ message: "Base de datos conectada correctamente!" });
    } else {
      res.status(500).json({ message: "Base de datos no conectada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en la base de datos", error });
  }
});

// Inicializar la conexión a la base de datos y arrancar el servidor
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Base de datos conectada");
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error conectando a la base de datos:", error);
  });