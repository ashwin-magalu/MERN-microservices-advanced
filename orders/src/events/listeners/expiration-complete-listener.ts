import { Message } from "node-nats-streaming";

import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@ashwin-ma/common";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/orer-cancelled-publisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) throw new Error("Order not found");

    if (order.status === OrderStatus.Completed) return msg.ack();

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();
    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
