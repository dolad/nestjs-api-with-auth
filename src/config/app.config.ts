import { Environment } from './interface';

export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    environment: (process.env.APP_ENV) || Environment.DEVELOPMENT,
  },
});
