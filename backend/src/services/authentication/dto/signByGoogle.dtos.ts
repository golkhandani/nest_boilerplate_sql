import { IsPhoneNumber, NotEquals, Validate, IsDefined, IsNotEmpty, IsAlphanumeric, IsEnum } from 'class-validator';

import { OS } from '@shared/enums';
import { ApiModelProperty } from '@nestjs/swagger';

export class SignByGoogle {
    @ApiModelProperty({ description: 'google access token' })
    @IsAlphanumeric()
    @NotEquals('test')
    @IsDefined()
    readonly gat: string;

    @ApiModelProperty({ description: 'issuer device type', enum: OS })
    @IsNotEmpty()
    @IsDefined()
    @IsEnum(OS)
    readonly dp: OS;
}
