import { Column, Entity, PrimaryColumn } from 'typeorm';
import { UserStatus } from '../../../domain/value-object/auth-user-status';

@Entity()
export class User {
    @PrimaryColumn()
    uuid: string;

    @Column()
    username: string;

    @Column()
    hash: string;

    @Column()
    email: string;

    @Column({
        type: 'varchar'
    })
    status: UserStatus;
}