import { Request, Response, NextFunction } from "express";
import {
  createMechanic,
  listMechanics,
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
    const { email, password } = req.body;
    const mechanic = await createMechanic(email, password);
    res.status(201).json(mechanic);
  } catch (error) {
    next(error);
  }
};
