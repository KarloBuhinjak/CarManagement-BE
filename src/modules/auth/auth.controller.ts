import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  getInvitation,
  consumeInvitation,
} from "./auth.service";

interface RequestWithUser extends Request {
  user?: { userId: string; role: "user" | "admin" | "superadmin" };
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await registerUser(email, password);

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const me = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const user = await getCurrentUser(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const invitation = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  try {
    const token = String(req.params.token ?? "");
    const result = await getInvitation(token);
    res.json(result);
  } catch (err) {
    res.status(400).json({
      message:
        err instanceof Error ? err.message : "Invalid invitation",
    });
  }
};

export const setPassword = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    await consumeInvitation(token, password);
    res.json({ message: "Password set successfully" });
  } catch (err) {
    res.status(400).json({
      message:
        err instanceof Error ? err.message : "Failed to set password",
    });
  }
};
