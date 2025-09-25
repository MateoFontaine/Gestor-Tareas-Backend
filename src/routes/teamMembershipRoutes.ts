import { Router } from "express";
import { TeamMembershipController } from "../controllers/TeamMembershipController";

const router = Router();

router.get("/", TeamMembershipController.getAll);
router.post("/", TeamMembershipController.addMember);
router.get("/team/:teamId", TeamMembershipController.getTeamMembers);
router.get("/user/:userId", TeamMembershipController.getUserTeams);
router.delete("/", TeamMembershipController.removeMember);

export default router;