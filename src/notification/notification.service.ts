import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from './email/email.service';
import { IEmailNotification, ISendEmail } from './interface/email-notification.interface';

@Injectable()
export class NotificationService {
  private logger: Logger = new Logger(NotificationService.name);

  constructor(private readonly emailService: EmailService) { }

  @OnEvent('verification.email')
  async registrationVerification(payload: IEmailNotification) {
    try {

      this.logger.verbose(`Sending ${payload.type} to ${payload.to}.`);
      const defaultOptions = {
        to: payload.to,
        ...payload.verificationEmail,
        subject: 'Verify Email',
        template: 'verify',
      };
    
      await this.emailService.sendEmail(defaultOptions);
      this.logger.verbose(
          `${payload.type} sent to ${payload.to} successfully.`,
        );
      
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
        to: payload.to
      };

      options = {
        ...payload.twoFaEmail,
        ...defaultOptions,
        subject: 'Login Verification',
        template: 'two-fa',
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

  @OnEvent('password-reset-notification.email')
  async resetPasswordEmailNotification(payload: IEmailNotification) {
    try {
      this.logger.verbose(`Sending ${payload.type} to ${payload.to}.`);
      let options: ISendEmail;
      const defaultOptions = {
        to: payload.to,
        
      };

      options = {
        ...payload.resetPasswordEmail,
        ...defaultOptions,
        subject: 'Reset password Verification',
        template: 'reset-password',
      }

      await this.emailService.sendEmail(options);
      this.logger.verbose(
          `${payload.type} sent to ${payload.to} successfully.`,
        );
      
    } catch (error) {
      this.logger.error(
        `An error occured while sending ${payload.type} to ${payload.to}.`,
        error,
      );
    }
  }
}