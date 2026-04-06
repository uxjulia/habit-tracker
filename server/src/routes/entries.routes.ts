import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import * as entriesController from "../controllers/entries.controller";

const router = Router();

router.use(requireAuth);

router.get("/today", entriesController.today);
router.get("/", entriesController.list);
router.post("/", entriesController.create);
router.put("/:id", entriesController.update);
router.delete("/:id", entriesController.remove);

export default router;
