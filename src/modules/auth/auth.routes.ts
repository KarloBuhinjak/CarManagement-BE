import { Router } from "express";
import {
  register,
  login,
  me,
  invitation,
  setPassword,
} from "./auth.controller";
import { validate } from "../../middleware/validate.middleware";
import { registerSchema, loginSchema } from "./auth.types";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, me);
router.get("/invitation/:token", invitation);
router.post("/set-password", setPassword);

export default router;
