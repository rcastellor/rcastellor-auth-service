import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
        __dirname + '/context/auth/**/*.database-entity{.ts}'
    ],
    synchronize: true,
}));