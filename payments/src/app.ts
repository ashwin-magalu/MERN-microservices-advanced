import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@ashwin-ma/common";

import { createChargeRouter } from "./routes/new";

const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // make it false only during testing
  })
);

app.use(currentUser);

app.use(createChargeRouter);

app.all("*", async (req, res) => {
  /* express-async-errors is making this faster */
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
