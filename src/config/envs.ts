import { get } from 'env-var';
import 'dotenv/config';

export const envs = {
  PORT: get("PORT").default(3000).asPortNumber(),
  NODE_ENV: get('NODE_ENV').default('development').asString(),

  DATABASE_USERNAME: get('DATABASE_USERNAME').required().asString(),
  DATABASE_PASSWORD: get('DATABASE_PASSWORD').required().asString(),
  DATABASE_HOST: get('DATABASE_HOST').required().asString(),
  DATABASE_PORT: get('DATABASE_PORT').required().asPortNumber(),
  DATABASE_NAME: get('DATABASE_NAME').required().asString(),

  JWT_KEY: get('JWT_KEY').required().asString(),
  JWT_EXPIRE_IN: get('JWT_EXPIRES_IN').required().asString(),
};
