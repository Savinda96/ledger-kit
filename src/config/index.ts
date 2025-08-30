// Configuration management for LedgerKit
import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config();

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  maxConnections?: number;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
}

export interface AppConfig {
  port: number;
  env: 'development' | 'production' | 'test';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  jwtSecret?: string;
}

export interface LedgerKitConfig {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  rulesPath: string;
  uploadsPath: string;
}

export const getConfig = (): LedgerKitConfig => {
  return {
    app: {
      port: parseInt(process.env.API_PORT || process.env.PORT || '3000', 10),
      env: (process.env.NODE_ENV as any) || 'development',
      logLevel: (process.env.LOG_LEVEL as any) || 'info',
      jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
    },
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'ledgerkit_dev',
      username: process.env.DB_USER || 'ledgerkit',
      password: process.env.DB_PASSWORD || 'ledgerkit_password',
      ssl: process.env.DB_SSL === 'true',
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || '1234',
      db: parseInt(process.env.REDIS_DB || '0', 10),
    },
    rulesPath: process.env.RULES_PATH || path.join(process.cwd(), 'examples', 'rules.yaml'),
    uploadsPath: process.env.UPLOADS_PATH || path.join(process.cwd(), 'uploads'),
  };
};

export default getConfig();