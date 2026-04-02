import express from "express";
import { requestLogger } from "./middleware/requestLogger.middleware";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";
import carRegistryRoutes from "./modules/carRegistry/carRegistry.routes";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use(requestLogger);

app.use("/auth", authRoutes);
app.use("/cars", carRegistryRoutes);

app.use(errorHandler);

export default app;
