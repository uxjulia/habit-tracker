import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import * as habitsController from "../controllers/habits.controller";

const router = Router();

router.use(requireAuth);

router.get("/", habitsController.list);
router.post("/", habitsController.create);
router.put("/reorder", habitsController.reorder);
router.put("/:id", habitsController.update);
router.delete("/:id", habitsController.remove);

export default router;
