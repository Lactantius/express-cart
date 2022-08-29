import express, { NextFunction } from "express";
import { router } from "./routes";
import { ExpressError } from "./expressError";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/items", router);

/* 404 Handler */
app.use((req, res, next: NextFunction) => {
  res.status(404);
  return res.json({ error: "Resource not found" });
});

/* General error handler */
app.use((err: ExpressError, req, res, next: NextFunction): void => {
  res.status(err.status || 500);

  return res.json({
    error: err.message,
  });
});

export { app };
