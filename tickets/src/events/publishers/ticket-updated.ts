import { Publisher, TicketUpdatedEvent, Subjects } from "@ashwin-ma/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
