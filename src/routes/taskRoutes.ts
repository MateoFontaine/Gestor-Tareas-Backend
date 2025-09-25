import { Router } from "express";
import { TaskController } from "../controllers/TaskController";

const router = Router();

router.get("/", TaskController.getAll);
router.post("/", TaskController.create);
router.put("/:id", TaskController.update);

export default router;