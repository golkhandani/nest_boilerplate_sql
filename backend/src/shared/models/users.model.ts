import * as mongoose from 'mongoose';
import { serverConstants } from '@shared/constants/serverConstants';
import { ApiModelProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID } from 'type-graphql';

export const UserModelName = 'User';

export enum UserRoles {
    GUEST = 'GUEST',
    USER = 'USER',
    ADMIN = 'ADMIN',
    GOD = 'GOD',
}
export const UserSchema = new mongoose.Schema({

    /** Guest login */
    fingerprint: String,
    /** Login 1 => username password */
    username: String,
    /** Login 3 => email password */
    email: String,
    password: String,

    /** Login 2 => google */
    google: String,
    /** Login 4 => phone */
    phone: String,

    verified: Boolean,

    /** Profile */
    name: String,
    picture: String,
    address: String,

    /** Access */
    role: {
        type: String,
        default: UserRoles.USER,
    },
}, {
    timestamps: true,
    autoIndex: true,
    id: true,
    _id: true,
    toJSON: {
        transform(v) {
            const obj: User = v._doc;
            /** for safety reasons */
            delete obj.password;
            delete obj.phone;
            delete obj.fingerprint;
            /** to return images based on domain */
            if (obj.picture && !(obj.picture as string).startsWith('http')) {
                obj.picture = serverConstants.imagePrefix + obj.picture;
            }
            return obj;
        },
    },
});

export interface User extends mongoose.Document {
    fingerprint: string;
    username: string;
    email: string;
    password: string;
    google: string;
    phone: string;
    verified: boolean;
    name: string;
    picture: string;
    address: string;
    role: UserRoles;

    createdAt: string;
    updatedAt: string;

}
// for dummy swagger
@ObjectType()
export class User {
    @ApiModelProperty()
    // tslint:disable-next-line: variable-name
    @Field(type => ID)
    _id: string;

    @ApiModelProperty()
    @Field()
    ceartedAt: string;

    @ApiModelProperty()
    @Field()
    updatedAt: string;
    // private
    fingerprint: string;
    @ApiModelProperty({ required: false, nullable: true })
    @Field({ nullable: true })
    username: string;
    @ApiModelProperty({ required: false, nullable: true })
    @Field({ nullable: true })
    email: string;
    // private
    password: string;
    @ApiModelProperty({ required: false, nullable: true })
    @Field({ nullable: true })
    google: string;
    // private
    phone: string;
    @ApiModelProperty({ required: false, type: Boolean, example: false, default: false })
    @Field()
    verified: boolean;
    @ApiModelProperty({ required: false, nullable: true })
    @Field({ nullable: true })
    name: string;
    @ApiModelProperty({ required: false, nullable: true })
    @Field({ nullable: true })
    picture: string;
    @ApiModelProperty({ required: false, nullable: true })
    @Field({ nullable: true })
    address: string;
    @ApiModelProperty({ enum: UserRoles })
    @Field()
    role: UserRoles;
}
