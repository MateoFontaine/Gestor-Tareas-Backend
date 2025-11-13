import { Router } from "express";
import { TagController } from "../controllers/TagController";

const router = Router();

router.get("/", TagController.getAll);
router.get("/team/:teamId", TagController.getByTeam);
router.post("/", TagController.create);
router.put("/:id", TagController.update);
router.delete("/:id", TagController.delete);

export default router;