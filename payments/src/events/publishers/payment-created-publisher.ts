import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@ashwin-ma/common/build";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  
}
