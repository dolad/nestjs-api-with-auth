/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.POSTGRES_DATABASE_HOST,
    port: process.env.POSTGRES_DATABASE_PORT
      ? parseFloat(process.env.POSTGRES_DATABASE_PORT)
      : 5432,
    username: process.env.POSTGRES_DATABASE_USER,
    password: process.env.POSTGRES_DATABASE_PASSWORD,
    database: process.env.POSTGRES_DATABASE_NAME,
    logging: false,
    define: {
      underscored: true,
    },
    autoLoadModels: true,
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_seeder',
  },
  test: {
    dialect: 'postgres',
    host: process.env.POSTGRES_DATABASE_HOST,
    port: process.env.POSTGRES_DATABASE_PORT
      ? parseFloat(process.env.POSTGRES_DATABASE_PORT)
      : 5432,
    username: process.env.POSTGRES_DATABASE_USER,
    password: process.env.POSTGRES_DATABASE_PASSWORD,
    database: process.env.POSTGRES_DATABASE_NAME,
    logging: false,
    define: {
      underscored: true,
    },
    autoLoadModels: true,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_seeder',
  },

  production: {
    dialect: 'postgres',
    host: process.env.POSTGRES_DATABASE_HOST,
    port: process.env.POSTGRES_DATABASE_PORT
      ? parseFloat(process.env.POSTGRES_DATABASE_PORT)
      : 5432,
    username: process.env.POSTGRES_DATABASE_USER,
    password: process.env.POSTGRES_DATABASE_PASSWORD,
    database: process.env.POSTGRES_DATABASE_NAME,
    logging: false,
    define: {
      underscored: true,
    },
    ssl: true,
    autoLoadModels: true,
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_seeder',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  },
};