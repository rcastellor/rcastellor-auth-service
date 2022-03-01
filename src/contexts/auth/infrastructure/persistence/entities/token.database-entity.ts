import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TokenStatus } from '../../../domain/value-object/auth-token-status';

@Entity()
export class Token {
    @PrimaryColumn()
    id: string;

    @Column()
    user: string;

    @Column()
    createdAt: string;

    @Column()
    updatedAt: string

    @Column({
        type: 'simple-enum',
    })
    status: TokenStatus;
}