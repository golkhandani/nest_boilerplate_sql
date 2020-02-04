import { User, UserSchema } from '@shared/models/users.model';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserWithToken {
    @ApiModelProperty({
        type: User,
    })
    user: User;
    @ApiModelProperty()
    refreshToken: string;
    @ApiModelProperty()
    accessToken: string;
    @ApiModelProperty()
    tokenType: string;
}
// for dummy swagger
// tslint:disable-next-line: max-classes-per-file
export class UserWithTokenApi {
    @ApiModelProperty({
        type: UserWithToken,
    })
    data: UserWithToken;
    @ApiModelProperty({
        required: false,
    })
    message?: string;
}
