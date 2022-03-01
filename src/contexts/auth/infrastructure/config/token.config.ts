import { registerAs } from '@nestjs/config';

export default registerAs('token', () => ({
    AUTH_TOKEN_DURATION: process.env.AUTH_TOKEN_DURATION,
    AUTH_SECRET_KEY: process.env.AUTH_SECRET_KEY,
}));