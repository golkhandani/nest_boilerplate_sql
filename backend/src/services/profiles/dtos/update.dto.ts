import { IsAlpha, NotEquals, Validate, IsDefined, IsNotEmpty, Length, ValidationArguments, ValidateIf, IsOptional } from 'class-validator';

import { UserAlreadyExist } from '@services/authentication/validators';

import { HttpException, HttpStatus } from '@nestjs/common';

export class UpdateUser {
    @IsAlpha()
    @NotEquals('test')
    @Validate(UserAlreadyExist, {
        message: 'username exists',
    })
    @IsOptional()
    readonly username: string;

    @IsOptional()
    public address: string;

}
