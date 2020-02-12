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

export interface IUser {
    _id: string;
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
    createdAt: Date;

    @ApiModelProperty()
    @Field()
    updatedAt: Date;
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
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, EntityOptions, OneToOne, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { RefreshTokenEntity } from '@services/authentication/models';

export const UserTableOptions: EntityOptions = {
    name: 'users',
    schema: 'public',
    synchronize: true,
};
@Entity(UserTableOptions.name, UserTableOptions)
export class UserEntity {
    @Column('uuid', {
        default: () => 'uuid_generate_v1()',
    })
    // tslint:disable-next-line:variable-name
    _id: string;

    /** Guest login */
    @Column({type: 'text'})
    fingerprint: string;

    @Column({type: 'text'})
    username: string;
    @Column({type: 'text'})
    email: string;
    @Column({type: 'text'})
    password: string;

    @Column({type: 'text'})
    google: string;
    @Column({type: 'text'})
    phone: string;

    @Column({type: 'boolean'})
    verified: boolean;

    @Column({type: 'text'})
    name: string;
    @Column({type: 'text'})
    picture: string;
    @Column({type: 'text'})
    address: string;

    @Column({
        // type: DataType.ENUM(...Object.keys(UserRoles)),
        type: 'enum',
        enum: Object.keys(UserRoles),
        default: UserRoles.USER,
    })
    role: UserRoles;

    @OneToOne(() => RefreshTokenEntity)
    @JoinColumn({name: 'refresh_token'})
    // tslint:disable-next-line:variable-name
    refresh_token: RefreshTokenEntity;

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

export const USER_REPOSITORY_NAME = 'UsersRepository';
export const UsersRepository = [{ provide: USER_REPOSITORY_NAME, useValue: UserEntity }];
