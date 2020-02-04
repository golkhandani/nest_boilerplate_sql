import { IsAlphanumeric, NotEquals, IsDefined } from 'class-validator';

export class SingGuestUser {
    @IsAlphanumeric()
    @NotEquals('test')
    @IsDefined()
    readonly fingerprint: string;
}
