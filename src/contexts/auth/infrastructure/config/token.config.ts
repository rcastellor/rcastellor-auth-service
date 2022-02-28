import { registerAs } from '@nestjs/config';

export default registerAs('token', () => ({
    AUTH_TOKEN_DURATION: process.env.AUTH_TOKEN_DURATION
}));