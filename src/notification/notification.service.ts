import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from './email/email.service';
import { IEmailNotification, ISendEmail } from './interface/email-notification.interface';

@Injectable()
export class NotificationService {
  private logger: Logger = new Logger(NotificationService.name);

  constructor(private readonly emailService: EmailService) {}

  @OnEvent('notification.email')
  async emailNotification(payload: IEmailNotification) {
    try {
      this.logger.verbose(`Sending ${payload.type} to ${payload.to}.`);
  
      let options: ISendEmail;
      const defaultOptions = {
        to: payload.to,
      };

      switch (payload.type) {
        case 'VERIFICATION_EMAIL':
          options = {
            ...payload.verificationEmail,
            ...defaultOptions,
            subject: 'Verify Email',
            template: 'verify',
          };

          break;

        default:
          break;
      }

      if (options) {
        await this.emailService.sendEmail(options);

        this.logger.verbose(
          `${payload.type} sent to ${payload.to} successfully.`,
        );
      }
    } catch (error) {
      this.logger.error(
        `An error occured while sending ${payload.type} to ${payload.to}.`,
        error,
      );
    }
  }

  @OnEvent('two-fa-auth.email')
  async sendTwoFaEmail(payload: IEmailNotification) {
    try {
      this.logger.verbose(`Sending ${payload.type} to ${payload.to}.`);
      let options: ISendEmail;
      const defaultOptions = {
        to: payload.to,
        type: 'twoFA'
      };

          options = {
            ...payload.verificationEmail,
            ...defaultOptions,
            subject: 'Verify Email',
            template: 'twoFa',
      }

      if (options) {
        await this.emailService.sendEmail(options);

        this.logger.verbose(
          `${payload.type} sent to ${payload.to} successfully.`,
        );
      }
    } catch (error) {
      this.logger.error(
        `An error occured while sending ${payload.type} to ${payload.to}.`,
        error,
      );
    }
  }
}