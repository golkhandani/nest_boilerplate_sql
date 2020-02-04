import { ApiModelProperty } from '@nestjs/swagger';

export class Api<T> {
    @ApiModelProperty({
        type: () => String,
    })
    data: T;
    @ApiModelProperty()
    message?: string;
}
