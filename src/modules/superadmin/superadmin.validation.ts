import { z } from "zod";

export const createMechanicSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Wallet address must be a valid 0x… Ethereum address",
    }),
});
