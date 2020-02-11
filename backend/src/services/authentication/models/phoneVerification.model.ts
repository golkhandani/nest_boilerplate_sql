import * as mongoose from 'mongoose';

export const PhoneVerificationModelName = 'auth_phone_verification';
export const PhoneVerificationSchema = new mongoose.Schema({
    code: String,
    phone: String,
    expires: Date,
    codeType: String,
}, {
    timestamps: true,
});

export interface PhoneVerification extends mongoose.Document {
    readonly code: string;
    readonly phone: string;
    readonly expires: Date;
    readonly codeType: string;
}

export class PhoneVerification {
    readonly code: string;
    readonly phone: string;
    readonly expires: Date;
    readonly codeType: string;
}

/** postgres */
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, DeletedAt, TableOptions} from 'sequelize-typescript';

export const PhoneVerificationTableOptions: TableOptions = {
    tableName: 'auth_phone_verifications',
};
@Table(PhoneVerificationTableOptions)
export class PhoneVerificationEntity extends Model<PhoneVerificationEntity> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    // tslint:disable-next-line:variable-name
    _id: string;

    @Column({type: DataType.TEXT})
    code: string;
    @Column({type: DataType.TEXT})
    phone: string;
    @Column({type: DataType.DATE})
    expires: Date;
    @Column({type: DataType.TEXT})
    codeType: string;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;
}
