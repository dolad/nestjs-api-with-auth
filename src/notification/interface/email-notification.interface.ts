
export interface IEmailNotification {
  type: 'VERIFICATION_EMAIL' | 'TWO_FA_AUTHENTICATION' | 'RESET_PASSWORD_EMAIL' | 'ADMIN_USER_CREATED';
  verificationEmail?: IVerifyEmail;
  twoFaEmail?: ITwoFaEmail;
  resetPasswordEmail?:IResetPassword;
  adminUserEmaiVerification?: IAdminUserCreateEmail
  to: string;
}

export interface IAdminUserCreateEmail{
  context: {
    firstName: string,
    password: string,
  },
}

export interface ITwoFaEmail {
  context: {
    twoFaToken: string
  };
}

export interface IResetPassword {
  context: {
    verificationLink: string
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
  