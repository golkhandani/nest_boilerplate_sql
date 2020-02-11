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
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, DeletedAt, TableOptions, HasOne, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { RefreshTokenEntity } from '@services/authentication/models';
import { UserEntity } from '@shared/models';

export const UserScopeTableOptions: TableOptions = {
    tableName: 'auth_user_scopes',
};
@Table(UserScopeTableOptions)
export class UserScopeEntity extends Model<UserScopeEntity> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    // tslint:disable-next-line:variable-name
    _id: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
        field: 'me',
    })
    ME: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
        field: 'read',
    })
    READ: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        field: 'write',
    })
    WRITE: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        field: 'god',
    })
    GOD: boolean;

    @ForeignKey(() => UserEntity)
    @Column({
        unique: true,
        type: DataType.UUID,
        field: 'user_id',
    })
    // tslint:disable-next-line:variable-name
    user_id: string;
    @BelongsTo(() => UserEntity)
    user: UserEntity;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;
}

export const USER_SCOPE_REPOSITORY_NAME = 'UserScopesRepository';
export const UserScopesRepository = [{ provide: USER_SCOPE_REPOSITORY_NAME, useValue: UserScopeEntity }];
