import { Test, TestingModule } from '@nestjs/testing';
import { Connection, getConnection } from 'typeorm';
import { AuthToken } from '../../../domain/auth-token.entity';
import { ITokenRepository } from '../../../domain/token.repository';
import { AuthTokenId } from '../../../domain/value-object/auth-token-id';
import { AuthUserUuid } from '../../../domain/value-object/auth-user-uuid';
import { clearDatasetSeed, existingUser, testDatasetSeed, TypeOrmSQLITETestingModule, validTokens } from '../config/memory-database.config';
import { TypeormTokenRepository } from './token.typeorm-repository';

describe('TypeormTokenRepository', () => {
    let tokenRepository: ITokenRepository;
    let connection: Connection;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmSQLITETestingModule()],
        }).compile();

        await testDatasetSeed();
        tokenRepository = new TypeormTokenRepository(getConnection());
    });

    afterEach(async () => {
        await clearDatasetSeed();
    })

    it('sould save a new token', async () => {
        let tokens = await tokenRepository.findValidByUserUuid(new AuthUserUuid(existingUser));
        await expect(tokens).toHaveLength(2);
        let token = AuthToken.create(AuthToken.randomid(), new AuthUserUuid(existingUser));
        await expect(tokenRepository.save(token)).resolves.not.toThrow()
        tokens = await tokenRepository.findValidByUserUuid(new AuthUserUuid(existingUser));
        await expect(tokens).toHaveLength(3);
    });
    it('sould save a new token and update the latest', async () => {
        let tokens = await tokenRepository.findValidByUserUuid(new AuthUserUuid(existingUser));
        expect(tokens).toHaveLength(2);
        const token = AuthToken.create(AuthToken.randomid(), new AuthUserUuid(existingUser));
        await expect(tokenRepository.saveAll([token, tokens[0].use()])).resolves.not.toThrow()
        tokens = await tokenRepository.findValidByUserUuid(new AuthUserUuid(existingUser));
        expect(tokens).toHaveLength(2);
    });
    it('sould find an existing token', async () => {
        const token = await tokenRepository.find(new AuthTokenId(validTokens[0]));
        expect(token).not.toBeNull();
    });
    it('sould return null on a not existing token', async () => {
        const token = await tokenRepository.find(new AuthTokenId('NONEXISTING'));
        expect(token).toBeNull();
    });
});