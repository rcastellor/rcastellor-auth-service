import { registerAs } from '@nestjs/config';
import { Token } from '../entities/token.database-entity';
import { User } from '../entities/user.database-entity';

export default registerAs('database', () => ({
    name: 'auth-connection',
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
        User,
        Token
    ],
    logging: true,
    synchronize: true,
}));