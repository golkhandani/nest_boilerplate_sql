import { CodeType } from '@services/authentication/helpers';
import { ApiModelProperty } from '@nestjs/swagger';

export class VerificationCodeOutout {
    @ApiModelProperty({ type: Number })
    codeLength: number;
    @ApiModelProperty({ description: 'date string', type: String })
    expires: Date;
    @ApiModelProperty({ description: 'code type', default: CodeType.NUMBER, enum: CodeType })
    codeType: CodeType;
}

// tslint:disable-next-line: max-classes-per-file
export class VerificationCodeOutoutApi {
    @ApiModelProperty({
        type: VerificationCodeOutout,
    })
    data: VerificationCodeOutout;
    @ApiModelProperty({
        required: false,
    })
    message?: string;
}
