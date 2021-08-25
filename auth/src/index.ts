import mongoose from "mongoose";

import { app } from "./app";

const url = `mongodb://auth-mongo-srv:27017/auth`;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.error("Connected to DB");
  } catch (error) {
    console.error(error);
  }
  app.listen(3002, () => {
    console.log("Listening on Port 3002");
  });
};

start();
