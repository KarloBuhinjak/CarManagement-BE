import express from "express";
import { requestLogger } from "./middleware/requestLogger.middleware";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import carRegistryRoutes from "./modules/carRegistry/carRegistry.routes";
import superadminRoutes from "./modules/superadmin/superadmin.routes";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.APP_URL,
].filter((value): value is string => Boolean(value));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

app.use(requestLogger);

app.use("/auth", authRoutes);
app.use("/cars", carRegistryRoutes);
app.use("/admin", superadminRoutes);

app.use(errorHandler);

export default app;
