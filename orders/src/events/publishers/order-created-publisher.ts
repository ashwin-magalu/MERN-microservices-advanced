import { Publisher, OrderCreatedEvent, Subjects } from "@ashwin-ma/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
