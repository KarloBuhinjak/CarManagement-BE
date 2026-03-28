import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof Error && "issues" in err) {
        // Zod error
        const zodError = err as any;
        const errors = zodError.issues.map((issue: any) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({ message: errors });
      }

      res.status(400).json({ message: "Validation failed" });
    }
  };
