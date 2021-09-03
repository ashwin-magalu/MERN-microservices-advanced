import { Publisher, TicketCreatedEvent, Subjects } from "@ashwin-ma/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
