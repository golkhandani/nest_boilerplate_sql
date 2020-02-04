import { IsPhoneNumber, NotEquals, Validate, IsDefined, IsNotEmpty } from 'class-validator';

import { UserAlreadyExist } from '../validators';
import { ApiModelProperty } from '@nestjs/swagger';

export class SignByPhoneCode {
    @ApiModelProperty({ description: 'must be real phone number', example: '989121234567' })
    @IsPhoneNumber('IR')
    @NotEquals('test')
    @Validate(UserAlreadyExist, {
        message: 'user exists',
    })
    @IsDefined()
    readonly phone: string;

    @ApiModelProperty({ description: 'verification code', example: '1234' })
    @IsNotEmpty()
    @IsDefined()
    readonly code: string;
}
