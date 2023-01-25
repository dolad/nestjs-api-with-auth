import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService, EmailService],
  exports: [NotificationService],
})
export class NotificationModule {}