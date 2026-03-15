import express from "express";
import { requestLogger } from "./middleware/requestLogger.middleware";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.use(requestLogger);

app.get("/test", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/error", (req, res) => {
  throw new Error("Ovo je testni error!");
});

app.use(errorHandler);

export default app;
