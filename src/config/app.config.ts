import { Environment } from './interface';

export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT, 10),
    environment: (process.env.NODE_ENV) || Environment.DEVELOPMENT,
    url: process.env.APP_URL,
    corWhitelist: process.env.CORS_WHITELIST
  },
  jwt: {
    registrationToken: process.env.JWT_REGISTRATION || 'registrationToken',
    jwtSecret: process.env.JWT_SECRET || 'flinke-secret'
  },
  saltEdge:{
    appId: process.env.SALTEDGE_APP_ID,
    secret: process.env.SALTEDGE_SECRET,
    baseUrl: process.env.SALTEDGE_BASE_URL
  },
  rutter:{
    appId: process.env.RUTTER_APP_ID,
    secret: process.env.RUTTER_SECRET,
    baseUrl: process.env.RUTTER_BASE_URL
  },
  session:{
    secret: process.env.SESSION_SECRET,
  },
  redis: {
    url: process.env.REDIS_URL
  }
});
