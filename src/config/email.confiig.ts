export default () => ({
    email: {
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      host: process.env.EMAIL_HOST,
      port: parseFloat(process.env.EMAIL_PORT),
      from: process.env.EMAIL_FROM || '',
    },
  });