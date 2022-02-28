import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TokenStatus } from '../../../domain/value-object/auth-token-status';

@Entity()
export class Token {
    @PrimaryColumn()
    id: string;

    @Column()
    user: string;

    @Column({
        type: 'timestamp'
    })
    createdAt: string;

    @Column({
        type: 'timestamp'
    })
    updatedAt: string

    @Column({
        type: 'enum',
        enum: TokenStatus,
    })
    status: TokenStatus;
}