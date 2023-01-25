
export interface IEmailNotification {
  type: 'VERIFICATION_EMAIL';
  verificationEmail: IVerifyEmail;
  to: string;
}

export interface IVerifyEmail {
    context: {
      firstName: string;
      host: string
    };
  }

export interface ISendEmail {
    to: string;
    subject: string;
    template: string;
    context: any;
  }

export interface IEmail {
    service: string;
    auth: {
      user: string;
      pass: string;
    };
    host: string;
    port: number;
    from: string;
  }
  