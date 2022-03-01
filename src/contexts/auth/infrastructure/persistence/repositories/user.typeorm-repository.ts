import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Nullable } from '../../../../../shared/domain/nullable';
import { AuthUser } from '../../../domain/auth-user.entity';
import { IUserRepository } from '../../../domain/user.repository';
import { AuthUserUuid } from '../../../domain/value-object/auth-user-uuid';
import { AuthUsername } from '../../../domain/value-object/auth-username';
import { User } from '../entities/user.database-entity';

@Injectable()
export class TypeormUserRepository implements IUserRepository {

    constructor(private readonly connection: Connection) { }

    async findByUuid(uuid: AuthUserUuid): Promise<Nullable<AuthUser>> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        const user = await queryRunner.manager.findOne(User, uuid.value);
        await queryRunner.release();
        if (user) {
            return AuthUser.fromPrimitives({ ...user, password: user.hash });
        }
        return null;
    }
    async findByUsername(username: AuthUsername): Promise<Nullable<AuthUser>> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        const user = await queryRunner.manager.findOne(User, {
            where: {
                username: username.value
            }
        });
        await queryRunner.release();
        if (user) {
            return AuthUser.fromPrimitives({ ...user, password: user.hash });
        }
        return null;
    }
    async save(user: AuthUser): Promise<void> {

        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const entity = user.toPrimitives();

            await queryRunner.manager.save(User, { ...entity, hash: entity.password });

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