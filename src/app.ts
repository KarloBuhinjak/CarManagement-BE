import express from "express";
import { requestLogger } from "./middleware/requestLogger.middleware";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());

app.use(requestLogger);

app.use("/auth", authRoutes);

app.use(errorHandler);

export default app;
