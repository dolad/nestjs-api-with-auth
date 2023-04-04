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
      underscored: false,
    },
    pool: {
      max: 15,
      min: 0,
      idle: 10000,
      acquire: 10000
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
    database: process.env.POSTGRES_DATABASE_NAME_TEST,
    logging: false,
    define: {
      underscored: false,
    },
    autoLoadModels: true,
    pool: {
      max: 15,
      min: 0,
      idle: 10000,
      acquire: 10000
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
      underscored: false,
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
      max: 15,
      min: 0,
      idle: 10000,
      acquire: 10000
    }
  },
};