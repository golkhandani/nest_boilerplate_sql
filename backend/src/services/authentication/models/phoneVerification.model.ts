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
