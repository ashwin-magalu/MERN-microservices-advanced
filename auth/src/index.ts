import express from 'express';
import { json } from "body-parser";

const app = express();
app.use(json());

app.get('/api/users/currentuser', (req, res) => {
    res.status(200).send("Hi there")
})

app.listen(3002, () => {
    console.log("Listening on Port 3002")
})