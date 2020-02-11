import * as mongoose from 'mongoose';
import { serverConstants } from '@shared/constants/serverConstants';
import { ApiModelProperty } from '@nestjs/swagger';
import { ObjectType, Field, ID } from 'type-graphql';

export const UserModelName = 'user';

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
    @Field(type => ID)
    // tslint:disable-next-line:variable-name
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

/** postgres */
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, DeletedAt, TableOptions} from 'sequelize-typescript';

export const UserTableOptions: TableOptions = {
    tableName: 'users',
};
@Table(UserTableOptions)
export class UserEntity extends Model<UserEntity> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    // tslint:disable-next-line:variable-name
    _id: string;

    /** Guest login */
    @Column({type: DataType.TEXT})
    fingerprint: string;

    @Column({type: DataType.TEXT})
    username: string;
    @Column({type: DataType.TEXT})
    email: string;
    @Column({type: DataType.TEXT})
    password: string;

    @Column({type: DataType.TEXT})
    google: string;
    @Column({type: DataType.TEXT})
    phone: string;

    @Column({type: DataType.BOOLEAN})
    verified: boolean;

    @Column({type: DataType.TEXT})
    name: string;
    @Column({type: DataType.TEXT})
    picture: string;
    @Column({type: DataType.TEXT})
    address: string;

    @Column({
        type: DataType.ENUM(...Object.keys(UserRoles)),
        defaultValue: UserRoles.USER,
    })
    role: UserRoles;

    @CreatedAt
    @Column({ field: 'created_at' })
    createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updatedAt: Date;
}

export const USER_REPOSITORY_NAME = 'UsersRepository';
export const UsersRepository = [{ provide: USER_REPOSITORY_NAME, useValue: UserEntity }];
