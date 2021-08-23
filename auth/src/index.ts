import express from 'express';
import { json } from "body-parser";
import "express-async-errors"
import mongoose from 'mongoose';

import { currentUserRouter } from "./routes/current-user"
import { signUpRouter } from "./routes/signup"
import { signInRouter } from "./routes/signin"
import { signOutRouter } from "./routes/signout"

import { errorHandler } from "./middlewares/error-handler"

import { NotFoundError } from "./errors/not-found-error"

const url = `mongodb://auth-mongo-srv:27017/auth`

const app = express();
app.use(json());

app.use(currentUserRouter)
app.use(signUpRouter)
app.use(signInRouter)
app.use(signOutRouter)

app.all("*", async (req, res) => {
    /* express-async-errors is making this faster */
    throw new NotFoundError();
})

app.use(errorHandler)

const start = async() => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        console.error("Connected to DB")
    } catch (error) {
        console.error(error)
    }
    app.listen(3002, () => {
    console.log("Listening on Port 3002")
    })
}

start();