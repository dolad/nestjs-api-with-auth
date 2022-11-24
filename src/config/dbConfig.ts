/* eslint-disable @typescript-eslint/no-var-requires */
const postgresConfig = require('./postgres.js');

export default () => ({
  postgres: {
    ...postgresConfig,
  },
});