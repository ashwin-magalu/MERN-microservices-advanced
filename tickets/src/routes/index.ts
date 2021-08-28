import express, { Request, Response } from "express";
import { body } from "express-validator";
import "express-async-errors";

import { NotFoundError } from "@ashwin-ma/common";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.status(200).send(tickets);
});

export { router as indexTicketRouter };
