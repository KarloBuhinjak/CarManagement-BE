import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type UserRole = "user" | "admin" | "superadmin";

interface RequestWithUser extends Request {
  user?: { userId: string; role: UserRole };
}

export const protect = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Not authorized" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: UserRole;
    };

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRole =
  (allowedRoles: UserRole[]) =>
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
