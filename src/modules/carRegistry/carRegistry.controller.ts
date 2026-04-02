import { Request, Response, NextFunction } from "express";
import { getCarRecords } from "./carRegistry.service";

export const getRecords = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const vin = req.params.vin as string;

    const records = await getCarRecords(vin);
    res.json(records);
  } catch (err) {
    next(err);
  }
};
