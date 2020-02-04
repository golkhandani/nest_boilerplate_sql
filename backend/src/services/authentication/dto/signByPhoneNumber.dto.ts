import { IsPhoneNumber, NotEquals, Validate, IsDefined } from 'class-validator';

import { UserAlreadyExist } from '../validators';
import { ApiModelProperty } from '@nestjs/swagger';

export class SignByPhoneNumber {
    @ApiModelProperty({ description: 'must be real phone number', example: '989121234567' })
    @IsPhoneNumber('IR')
    @NotEquals('test')
    @Validate(UserAlreadyExist, {
        message: 'user exists',
    })
    @IsDefined()
    readonly phone: string;
}
