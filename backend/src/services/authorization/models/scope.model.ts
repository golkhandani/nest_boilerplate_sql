import * as mongoose from 'mongoose';

export const UserScopeModelName = 'Auth_UserScope';

export enum UserScopes {
    ME = 'ME',
    READ = 'READ',
    WRITE = 'WRITE',
    GOD = 'GOD',
}
export const UserScopeSchema = new mongoose.Schema({
    user: String,
    scopes: [String],
}, {
        timestamps: true,
    });

export interface UserScope extends mongoose.Document {
    readonly user: string;
    readonly scopes: string[];
}

/** postgres */
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, EntityOptions, OneToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { UserEntity } from '@shared/models';

export const UserScopeTableOptions: EntityOptions = {
    name: 'auth_user_scopes',
    schema: 'public',
    synchronize: true,
};
@Entity(UserScopeTableOptions.name, UserScopeTableOptions)
export class UserScopeEntity {
    @Column('uuid', {
        default: () => 'uuid_generate_v1()',
    })
    // tslint:disable-next-line:variable-name
    _id: string;

    @Column({
        type: 'boolean',
        default: true,
        name: 'me',
    })
    ME: boolean;

    @Column({
        type: 'boolean',
        default: true,
        name: 'read',
    })
    READ: boolean;

    @Column({
        type: 'boolean',
        default: false,
        name: 'write',
    })
    WRITE: boolean;

    @Column({
        type: 'boolean',
        default: false,
        name: 'god',
    })
    GOD: boolean;

    @Column('text', { nullable: true })
    // tslint:disable-next-line:variable-name
    user_id: string;
    @OneToOne(type => UserEntity,
        (user: UserEntity) => user.refresh_token,
    )
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

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

export const USER_SCOPE_REPOSITORY_NAME = 'UserScopesRepository';
export const UserScopesRepository = [{ provide: USER_SCOPE_REPOSITORY_NAME, useValue: UserScopeEntity }];
