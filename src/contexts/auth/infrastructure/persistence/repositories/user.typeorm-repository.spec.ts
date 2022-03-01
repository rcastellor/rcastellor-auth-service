import { Test, TestingModule } from '@nestjs/testing';
import { Connection, getConnection } from 'typeorm';
import { AuthToken } from '../../../domain/auth-token.entity';
import { AuthUser } from '../../../domain/auth-user.entity';
import { v4 } from 'uuid';
import { IUserRepository } from '../../../domain/user.repository';
import { AuthUserUuid } from '../../../domain/value-object/auth-user-uuid';
import { clearDatasetSeed, existingUser, testDatasetSeed, TypeOrmSQLITETestingModule } from '../config/memory-database.config';
import { TypeormTokenRepository } from './token.typeorm-repository';
import { TypeormUserRepository } from './user.typeorm-repository';
import { AuthUsername } from '../../../domain/value-object/auth-username';
import { AuthPassword } from '../../../domain/value-object/auth-password';
import { AuthEmail } from '../../../domain/value-object/auth-email';
import { AuthUserStatus, UserStatus } from '../../../domain/value-object/auth-user-status';

describe('TypeormUserRepository', () => {
    let userRepository: IUserRepository;
    let connection: Connection;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmSQLITETestingModule()],
        }).compile();

        await testDatasetSeed();
        userRepository = new TypeormUserRepository(getConnection());
    });

    afterEach(async () => {
        await clearDatasetSeed();
    });

    it('sould find a existing user uuid', async () => {
        const uuid = new AuthUserUuid(existingUser);
        let user = await userRepository.findByUuid(uuid);
        expect(user).not.toBeNull();
        expect(user).toHaveProperty('uuid', uuid);
    });
    it('sould return null with a non existing user', async () => {
        const uuid = new AuthUserUuid(v4());
        let user = await userRepository.findByUuid(uuid);
        expect(user).toBeNull();
    });
    it('sould find a existing user username', async () => {
        const username = new AuthUsername('testuser1');
        let user = await userRepository.findByUsername(username);
        expect(user).not.toBeNull();
        expect(user).toHaveProperty('username', username);
    });
    it('sould return null with a non existing username', async () => {
        const username = new AuthUsername('nonexisting');
        let user = await userRepository.findByUsername(username);
        expect(user).toBeNull();
    });
    it('sould save a new user', async () => {
        const uuid = new AuthUserUuid(v4());
        const newUser = AuthUser.create({
            uuid: uuid,
            username: new AuthUsername(v4()),
            password: new AuthPassword('test'),
            email: new AuthEmail(''),
            status: new AuthUserStatus(UserStatus.ACTIVE)
        })
        await expect(userRepository.save(newUser)).resolves.not.toThrow();
    });
});