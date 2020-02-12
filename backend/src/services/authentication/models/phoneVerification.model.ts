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
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, EntityOptions, OneToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';

export const PhoneVerificationTableOptions: EntityOptions = {
    name: 'auth_phone_verifications',
    schema: 'public',
    synchronize: true,
};
@Entity(PhoneVerificationTableOptions.name, PhoneVerificationTableOptions)
export class PhoneVerificationEntity {
    @Column('uuid', {
        default: () => 'uuid_generate_v1()',
    })
    // tslint:disable-next-line:variable-name
    _id: string;

    @Column({type: 'text'})
    code: string;
    @Column({type: 'text'})
    phone: string;
    @Column({type: 'timestamptz'})
    expires: Date;
    @Column({type: 'text'})
    codeType: string;

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

export const PHONE_VERIFICATION_REPOSITORY_NAME = 'PhoneVerificationsRepository';
export const PhoneVerificationsRepository = [{ provide: PHONE_VERIFICATION_REPOSITORY_NAME, useValue: PhoneVerificationEntity }];
