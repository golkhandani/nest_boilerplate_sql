import * as mongoose from 'mongoose';

export const UserScopeModelName = 'Auth_UserScope';

export enum UserScopes {
    ME = 'ME',
    READ = 'READ',
    WRITE = 'WRITE',
    READWRITE = 'READWRITE',
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
