import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (err: any) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: err.errors });
  }
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (err: any) {
    return res
      .status(400)
      .json({ message: "Validation failed", errors: err.errors });
  }
};
