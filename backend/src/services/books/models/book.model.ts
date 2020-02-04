import { Field, ID, ObjectType } from 'type-graphql';

import * as mongoose from 'mongoose';
import { serverConstants } from '@shared/constants/serverConstants';
import { ApiModelProperty } from '@nestjs/swagger';

export const BookModelName = 'Book';

export const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
}, {
        timestamps: true,
        autoIndex: true,
    });

export interface Book extends mongoose.Document {
    _id: string;
    title: string;
    author: string;
    createdAt: string;
    updatedAt: string;

}

@ObjectType()
export class Book {
    @Field(type => ID)
    // tslint:disable-next-line: variable-name
    _id: string;

    @Field()
    title: string;

    @Field()
    author: string;

    @Field(type => Date)
    createdAt: string;
    @Field(type => Date)
    updatedAt: string;
}
