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
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, DeletedAt, TableOptions, ForeignKey, BelongsTo} from 'sequelize-typescript';
import { UserEntity } from '@shared/models';

export const RefreshTokenTableOptions: TableOptions = {
    tableName: 'auth_refresh_tokens',
};
@Table(RefreshTokenTableOptions)
export class RefreshTokenEntity extends Model<RefreshTokenEntity> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    // tslint:disable-next-line:variable-name
    _id: string;

    @Column({type: DataType.TEXT})
    token: string;

    @ForeignKey(() => UserEntity)
    @Column({
        type: DataType.UUID,
        field: 'user_id',
    })
    // tslint:disable-next-line:variable-name
    user_id: string;
    @BelongsTo(() => UserEntity)
    user: UserEntity;

    @Column({type: DataType.TEXT})
    expires: Date;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;
}
