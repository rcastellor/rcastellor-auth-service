import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { TokenStatus } from '../../../domain/value-object/auth-token-status';
import { UserStatus } from '../../../domain/value-object/auth-user-status';
import { Token } from '../entities/token.database-entity';
import { User } from '../entities/user.database-entity';

export const TypeOrmSQLITETestingModule = () => [
    TypeOrmModule.forRoot({
        type: 'better-sqlite3',
        database: ':memory:',
        dropSchema: true,
        entities: [User, Token],
        synchronize: true,
        keepConnectionAlive: true,
    }),
    TypeOrmModule.forFeature([User, Token]),
];

export const clearDatasetSeed = async () => {
    const connection = await getConnection();
    const entityManager = connection.createEntityManager();

    entityManager.clear(User);
    entityManager.clear(Token);
}


export const testDatasetSeed = async () => {
    const connection = await getConnection();
    const entityManager = connection.createEntityManager();

    entityManager.insert<User>(User, {
        uuid: 'f7c32fea-98d0-11ec-8d47-00155d2b6976',
        username: 'testuser1',
        hash: 'hash',
        email: 'email@email.com',
        status: UserStatus.ACTIVE
    });

    entityManager.insert<User>(User, {
        uuid: '2f6522b4-98d1-11ec-ad32-00155d2b6976',
        username: 'testuser1',
        hash: 'hash',
        email: 'email@email.com',
        status: UserStatus.ACTIVE
    });
    entityManager.insert<Token>(Token, {
        id: 'ABCDF1',
        user: 'f7c32fea-98d0-11ec-8d47-00155d2b6976',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
        status: TokenStatus.VALID,
    });
    entityManager.insert<Token>(Token, {
        id: 'ABCDF2',
        user: 'f7c32fea-98d0-11ec-8d47-00155d2b6976',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
        status: TokenStatus.VALID,
    });
    entityManager.insert<Token>(Token, {
        id: 'ABCDF3',
        user: 'f7c32fea-98d0-11ec-8d47-00155d2b6976',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
        status: TokenStatus.EXPIRED,
    });
    entityManager.insert<Token>(Token, {
        id: 'ABCDF4',
        user: 'f7c32fea-98d0-11ec-8d47-00155d2b6976',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
        status: TokenStatus.INVALID,
    });
    entityManager.insert<Token>(Token, {
        id: 'ABCDF5',
        user: 'f7c32fea-98d0-11ec-8d47-00155d2b6976',
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
        status: TokenStatus.INVALID,
    });
};

export const validTokens = ['ABCDF1', 'ABCDF2'];
export const expiredTokens = ['ABCDF3'];
export const invalidTokens = ['ABCDF4', 'ABCDF5'];
export const existingUser = 'f7c32fea-98d0-11ec-8d47-00155d2b6976';