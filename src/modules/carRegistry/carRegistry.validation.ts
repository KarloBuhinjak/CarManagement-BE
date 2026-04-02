import { z } from "zod";

export const vinParamSchema = z.object({
  vin: z
    .string()
    .length(17, { message: "VIN must be exactly 17 characters long" })
    .regex(/^[A-HJ-NPR-Z0-9]+$/, {
      message: "VIN must contain only valid characters (no I, O, Q)",
    }),
});
