import * as mongoose from 'mongoose';

export const UserScopeModelName = 'auth_user_scope';

export enum UserScopes {
    ME = 'ME',
    READ = 'READ',
    WRITE = 'WRITE',
    GOD = 'GOD',
}
export const UserScopeSchema = new mongoose.Schema({
    user: String,
    ME: {
        type: Boolean,
        default: true,
    },
    READ: {
        type: Boolean,
        default: true,
    },
    WRITE: {
        type: Boolean,
        default: true,
    },
    GOD: {
        type: Boolean,
        default: true,
    },
}, {
        timestamps: true,
    });

export interface UserScope extends mongoose.Document {
    readonly user: string;
    readonly ME: boolean;
    readonly READ: boolean;
    readonly WRITE: boolean;
    readonly GOD: boolean;
}
