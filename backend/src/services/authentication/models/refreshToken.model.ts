import * as mongoose from 'mongoose';

export const RefreshTokenModelName = 'Auth_RefreshToken';
export const RefreshTokenSchema = new mongoose.Schema({
    token: String,
    user: mongoose.Schema.Types.ObjectId,
    expires: Date,
}, {
        timestamps: true,
    });

export interface RefreshToken extends mongoose.Document {
    readonly token: string;
    readonly user: string;
    readonly expires: Date;
}

export class RefreshToken {
    readonly token: string;
    readonly user: string;
    readonly expires: Date;
}

/** postgres */
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, EntityOptions, OneToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { UserEntity } from '@shared/models';

export const RefreshTokenTableOptions: EntityOptions = {
    name: 'auth_refresh_tokens',
    schema: 'public',
    synchronize: true,
};
@Entity(RefreshTokenTableOptions.name, RefreshTokenTableOptions)
export class RefreshTokenEntity {
    @Column('uuid', {
        default: () => 'uuid_generate_v1()',
    })
    // tslint:disable-next-line:variable-name
    _id: string;

    @Column({type: 'text'})
    token: string;

    @Column('text', { nullable: true })
    // tslint:disable-next-line:variable-name
    user_id: string;
    @OneToOne(type => UserEntity,
        (user: UserEntity) => user.refresh_token,
    )
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({type: 'timestamptz'})
    expires: Date;

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'created_at',
    })
    // tslint:disable-next-line:variable-name
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        name: 'updated_at',
    })
    // tslint:disable-next-line:variable-name
    updatedAt: Date | null;
}

export const REFRESH_TOKEN_REPOSITORY_NAME = 'RefreshTokensRepository';
export const RefreshTokensRepository = [{ provide: REFRESH_TOKEN_REPOSITORY_NAME, useValue: RefreshTokenEntity }];
