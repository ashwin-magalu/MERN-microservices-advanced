import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

import { OrderCreatedEvent, OrderStatus } from "@ashwin-ma/common";

import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const id = mongoose.Types.ObjectId().toHexString();
  const data: OrderCreatedEvent["data"] = {
    id,
    version: 0,
    expiresAt: "asdfghj",
    userId: "qwerty",
    status: OrderStatus.Created,
    ticket: {
      id: "zxcvbnm",
      price: 10,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  if (!order) throw new Error(`Order not found`);

  expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
