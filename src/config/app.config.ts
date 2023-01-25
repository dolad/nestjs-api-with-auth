import { Environment } from './interface';

export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT, 10),
    environment: (process.env.APP_ENV) || Environment.DEVELOPMENT,
    url: process.env.APP_URL
  },
  jwt: {
    registrationToken: process.env.JWT_REGISTRATION || 'registrationToken',
    jwtSecret: process.env.JWT_SECRET || 'flinke-secret'
  }
});
