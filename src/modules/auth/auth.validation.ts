import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export const validate =
  (schema: ZodTypeAny, source: "body" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("asdasd");
      schema.parse(req[source]); // 👈 ključna linija
      next();
    } catch (err: any) {
      const errors = err.issues?.map((issue: any) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }
  };
