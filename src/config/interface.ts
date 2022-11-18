import { SequelizeModuleOptions } from '@nestjs/sequelize';

//DatabaseConfig
export interface IDatabaseConfig {
  postgres: IPostgresAttributes;
}

export interface IPostgresAttributes {
  development: IPostgresConfig;
  test: IPostgresConfig;
  production: IPostgresConfig;
}

export type IPostgresConfig = SequelizeModuleOptions;

//APP_CONFIG
export interface IAppConfig {
  port: number;
  environment: Environment;
}

export enum Environment {
  DEVELOPMENT = 'development',
  staging = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

//REDIS
export interface IRedis {
  port: number;
  host: string;
}
