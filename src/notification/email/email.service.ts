

import { Injectable } from '@nestjs/common';
import * as Mailer from 'nodemailer';
import HandleBar from 'nodemailer-express-handlebars';
import { ISendEmail, IEmail } from '../interface/email-notification.interface';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class EmailService {
  constructor(private readonly config: ConfigService) {}
  
  private Transporter = Mailer.createTransport(
    {
      ...this.config.get<IEmail>('email'),
    },
    { from: `"Flinke Team" <${this.config.get<IEmail>('email').from}>` },
  );

  async sendEmail(payload: ISendEmail) {
    const options = {
      to: payload.to,
      subject: payload.subject,
      context: {
        ...payload.context,
        to: payload.to,
        year: new Date().getFullYear(),
      },
      template: payload.template,
    };

    this.Transporter.use(
      'compile',
      HandleBar({
        viewEngine: {
          extname: '.hbs',
          layoutsDir:
            process.cwd() + '/src/notification/email/templates/',
          defaultLayout: payload.template,
        },
        viewPath: process.cwd() + '/src/notification/email/templates/',
        extName: '.hbs',
      }),
    );

    const response = await this.Transporter.sendMail(options);

    return response;
  }
}