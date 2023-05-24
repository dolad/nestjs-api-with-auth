import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from './email/email.service';
import {
  emailType,
  IEmailNotification,
  ISendEmail,
} from './interface/email-notification.interface';

@Injectable()
export class NotificationService {
  private logger: Logger = new Logger(NotificationService.name);

  constructor(private readonly emailService: EmailService) {}

  @OnEvent('verification.email')
  async registrationVerification(payload: IEmailNotification) {
    const options = {
      to: payload.to,
      ...payload.verificationEmail,
      subject: 'Verify Email',
      template: 'verify',
    };
    await this.sendEmailWrapper(options, payload.type);
  }

  @OnEvent('two-fa-auth.email')
  async sendTwoFaEmail(payload: IEmailNotification) {
    const options = {
      ...payload.twoFaEmail,
      to: payload.to,
      subject: 'Login Verification',
      template: 'two-fa',
    };
    await this.sendEmailWrapper(options, payload.type);
  }

  @OnEvent('password-reset-notification.email')
  async resetPasswordEmailNotification(payload: IEmailNotification) {
    const options: ISendEmail = {
      ...payload.resetPasswordEmail,
      to: payload.to,
      subject: 'Reset password Verification',
      template: 'reset-password',
    };
    await this.sendEmailWrapper(options, payload.type);
  }

  @OnEvent('create.admin-user.email')
  async sendCreateAdminUserEmail(payload: IEmailNotification) {
    const options: ISendEmail = {
      to: payload.to,
      subject: 'Admin User',
      template: 'admin-user',
      ...payload.adminUserEmaiVerification,
    };
    await this.sendEmailWrapper(options, payload.type);
  }

  async sendCreatePartnerUserEmail(payload: IEmailNotification) {
    const options: ISendEmail = {
      to: payload.to,
      subject: 'Patner User',
      template: 'partner',
      ...payload.partnerUserEmailVerification,
    };
    await this.sendEmailWrapper(options, payload.type);
  }

  private async sendEmailWrapper(
    options: ISendEmail,
    type: emailType,
  ): Promise<void> {
    try {
      this.logger.verbose(`Sending ${type} to ${options.to}.`);
      await this.emailService.sendEmail(options);
      this.logger.verbose(`${type} sent to ${options.to} successfully.`);
    } catch (error) {
      this.logger.error(
        `An error occured while sending ${type} to ${options.to}.`,
        error,
      );
    }
  }
}
