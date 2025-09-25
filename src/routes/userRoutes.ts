import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

router.get("/", UserController.getAll);
router.post("/", UserController.create);
router.get("/:id", UserController.getById);

export default router;