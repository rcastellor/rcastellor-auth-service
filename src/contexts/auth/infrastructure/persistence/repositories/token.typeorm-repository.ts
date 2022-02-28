import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Nullable } from '../../../../../shared/domain/nullable';
import { AuthToken } from '../../../domain/auth-token.entity';
import { ITokenRepository } from '../../../domain/token.repository';
import { AuthTokenId } from '../../../domain/value-object/auth-token-id';
import { TokenStatus } from '../../../domain/value-object/auth-token-status';
import { AuthUserUuid } from '../../../domain/value-object/auth-user-uuid';
import { Token } from '../entities/token.database-entity';


@Injectable()
export class TypeormTokenRepository implements ITokenRepository {

    constructor(private readonly connection: Connection) { }

    async find(token: AuthTokenId): Promise<Nullable<AuthToken>> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        const user = await queryRunner.manager.findOne(Token, token.value);
        await queryRunner.release();
        if (user) {
            return AuthToken.fromPrimitives({ ...user });
        }
        return null;
    }
    async findValidByUserUuid(uuid: AuthUserUuid): Promise<Nullable<AuthToken>[]> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        const users = await queryRunner.manager.find(Token, {
            where: {
                user: uuid.value,
                status: TokenStatus.VALID
            }
        });
        await queryRunner.release();
        if (users) {
            return users.map(user => AuthToken.fromPrimitives({ ...user }));
        }
        return null;
    }
    async save(token: AuthToken): Promise<void> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const entity = token.toPrimitives();

            await queryRunner.manager.save(Token, entity);

            await queryRunner.commitTransaction();
        } catch (err) {
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
        }
        return Promise.resolve();

    }
    async saveAll(tokens: AuthToken[]): Promise<void> {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const entities = tokens.map(token => token.toPrimitives());

            await queryRunner.manager.save(Token, entities);

            await queryRunner.commitTransaction();
        } catch (err) {
            // since we have errors lets rollback the changes we made
            await queryRunner.rollbackTransaction();
        } finally {
            // you need to release a queryRunner which was manually instantiated
            await queryRunner.release();
        }
        return Promise.resolve();
    }

}