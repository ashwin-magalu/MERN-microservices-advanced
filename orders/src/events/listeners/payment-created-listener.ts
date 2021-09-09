import { Message } from "node-nats-streaming";

import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@ashwin-ma/common";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { set } from "mongoose";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { id, orderId, stripeId } = data;

    const order = await Order.findById(orderId);

    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Completed });
    await order.save();

    msg.ack();
  }
}
