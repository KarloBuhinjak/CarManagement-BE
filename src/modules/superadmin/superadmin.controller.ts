import { Request, Response, NextFunction } from "express";
import {
  createMechanic,
  listMechanics,
  removeMechanic,
} from "./superadmin.service";

export const listMechanicsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const mechanics = await listMechanics();
    res.status(200).json(mechanics);
  } catch (error) {
    next(error);
  }
};

export const createMechanicHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, walletAddress } = req.body;
    const mechanic = await createMechanic(email, walletAddress);
    res.status(201).json(mechanic);
  } catch (error) {
    next(error);
  }
};

export const removeMechanicHandler = async (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await removeMechanic(String(id));
    res.json(result);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Failed to remove mechanic",
    });
  }
};
