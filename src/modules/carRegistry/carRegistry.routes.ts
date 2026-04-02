import { Router } from "express";
import { getRecords } from "./carRegistry.controller";
import { validate } from "../../middleware/validate.middleware";
import { vinParamSchema } from "./carRegistry.validation";

const router = Router();

router.get("/:vin", validate(vinParamSchema, "params"), getRecords);

export default router;
