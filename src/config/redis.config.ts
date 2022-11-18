export default () => ({
  redis: {
    port: parseInt(process.env.APP_PORT, 10) || 6379,
    host: process.env.REDIS_HOST || '',
  },
});
