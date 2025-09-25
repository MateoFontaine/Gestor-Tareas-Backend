import { Router } from "express";
import { TeamController } from "../controllers/TeamController";

const router = Router();

router.get("/", TeamController.getAll);
router.post("/", TeamController.create);
router.delete("/:id", TeamController.delete);

export default router;