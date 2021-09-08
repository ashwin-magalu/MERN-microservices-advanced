import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@ashwin-ma/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}
