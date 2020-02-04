import { IsAlpha, NotEquals, Validate, IsDefined, IsNotEmpty, Length, ValidationArguments, ValidateIf } from 'class-validator';

import { UserAlreadyExist } from '@services/authentication/validators';

import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';

export class SignupByUsernameDto {
    @ApiModelProperty({ description: 'must be alpha char', example: 'golkhanadni' })
    @IsAlpha()
    @NotEquals('test')
    @Validate(UserAlreadyExist, {
        message: 'user exists',
    })
    @IsDefined()
    readonly username: string;

    @ApiModelProperty({
        description: 'user password => must be bigger than 10 char',
        example: '123412341234',
    })
    @IsNotEmpty()
    @Length(10, 50, {
        message: (args: ValidationArguments) => {
            if (args.value) {
                if (args.value.length === 1) {
                    return 'too short password';
                } else {
                    return `must be more than ${args.constraints[0]} char`;
                }
            }

        },
    })
    @IsDefined()
    public password: string;

    @ApiModelProperty({
        description: 'must match with password',
        example: '123412341234',
    })
    @ValidateIf((o, value) => {
        if ((o as SignupByUsernameDto).password === value) {
            return true;
        } else {
            throw new HttpException('re entered password doesn\'t match', HttpStatus.BAD_REQUEST);
        }
    })
    readonly reEnteredPassword: string;
}
