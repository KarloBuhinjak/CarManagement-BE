import { Request, Response, NextFunction } from "express";

interface RequestWithUser extends Request {
  user?: {
    userId: string;
    role: "user" | "admin";
  };
}

export const authorize = (...roles: ("user" | "admin")[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden" });

    next();
  };
};
