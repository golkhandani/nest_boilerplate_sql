import { IsOptional, Length, MaxLength, IsDefined } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class NewBookData {
    @Field()
    @IsDefined()
    title: string;
    @Field()
    @IsDefined()
    author: string;
}
