import { Router } from "express";
import { TaskController } from "../controllers/TaskController";

const router = Router();

router.get("/", TaskController.getAll);
router.post("/", TaskController.create);
router.get("/:id", TaskController.getById);
router.put("/:id", TaskController.update);
router.delete("/:id", TaskController.delete);
router.post("/:taskId/tags/:tagId", TaskController.addTag);
router.delete("/:taskId/tags/:tagId", TaskController.removeTag);

export default router;