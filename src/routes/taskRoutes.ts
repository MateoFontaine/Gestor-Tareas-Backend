import { Router } from "express";
import { TaskController } from "../controllers/TaskController";

const router = Router();

// Rutas existentes
router.get("/", TaskController.getAll);
router.post("/", TaskController.create);
router.get("/:id", TaskController.getById);
router.put("/:id", TaskController.update);
router.delete("/:id", TaskController.delete);
router.post("/:taskId/tags/:tagId", TaskController.addTag);
router.delete("/:taskId/tags/:tagId", TaskController.removeTag);

// --- NUEVAS RUTAS DE DEPENDENCIAS ---
router.get("/:taskId/dependencies", TaskController.getDependencies);
router.post("/:taskId/dependencies", TaskController.addDependency);
router.delete("/dependencies/:id", TaskController.removeDependency);

export default router;