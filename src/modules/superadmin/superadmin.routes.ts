import { Router } from "express";
import {
  createMechanicHandler,
  listMechanicsHandler,
  removeMechanicHandler,
} from "./superadmin.controller";
import { protect, requireRole } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createMechanicSchema } from "./superadmin.validation";

const router = Router();

router.use(protect, requireRole(["superadmin"]));

router.get("/mechanics", listMechanicsHandler);
router.post(
  "/mechanics",
  validate(createMechanicSchema),
  createMechanicHandler,
);
router.delete("/mechanics/:id", removeMechanicHandler);

export default router;
