import { registerAs } from '@nestjs/config';

export default registerAs('token', () => ({
    AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME || 'rcastellor-auth-service',
    AUTH_COOKIE_DOMAIN: process.env.AUTH_COOKIE_DOMAIN || 'localhost',
    AUTH_REFRESH_DURATION: process.env.AUTH_REFRESH_DURATION || 1296000,
    AUTH_TOKEN_DURATION: process.env.AUTH_TOKEN_DURATION || 3600000,
    AUTH_SECRET_KEY: process.env.AUTH_SECRET_KEY,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
    JWT_KEY_ID: process.env.JWT_KEY_ID
}));