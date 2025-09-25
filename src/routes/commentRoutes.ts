import { Router } from "express";
import { CommentController } from "../controllers/CommentController";

const router = Router();

router.get("/", CommentController.getAll);
router.post("/", CommentController.create);
router.get("/task/:taskId", CommentController.getByTask);
router.get("/:id", CommentController.getById);
router.delete("/:id", CommentController.delete);

export default router;