
export interface IEmailNotification {
  type: 'VERIFICATION_EMAIL' | 'TWO_FA_AUTHENTICATION';
  verificationEmail?: IVerifyEmail;
  twoFaEmail?: ITwoFaEmail;
  to: string;
}

export interface ITwoFaEmail {
  context: {
    twoFaToken: string
  };
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
  