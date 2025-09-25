import { Router } from "express";
import { TaskController } from "../controllers/TaskController";

const router = Router();

router.get("/", TaskController.getAll);
router.post("/", TaskController.create);
router.put("/:id", TaskController.update);
router.get("/:id", TaskController.getById);
router.delete("/:id", TaskController.delete);

export default router;