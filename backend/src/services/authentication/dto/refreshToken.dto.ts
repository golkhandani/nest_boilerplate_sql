import { IsPhoneNumber, NotEquals, Validate, IsDefined, IsNotEmpty } from 'class-validator';

import { UserAlreadyExist } from '../validators';
import { ApiModelProperty } from '@nestjs/swagger';

export class RefreshToken {
    @ApiModelProperty({ description: 'refresh token', example: '12341234123412341234' })
    @IsNotEmpty()
    @IsDefined()
    readonly refreshToken: string;
}
