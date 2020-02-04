import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { Injectable } from '@nestjs/common';
import { AuthenticationProvider } from '@services/authentication/authentication.provider';

@ValidatorConstraint({ name: 'isUserAlreadyExist', async: true })
@Injectable()
export class UserAlreadyExist implements ValidatorConstraintInterface {
    constructor(protected readonly authProvider: AuthenticationProvider) { }

    async validate(text: string) {
        const user = await this.authProvider.findByUniquesForValidation(text);
        return !user;
    }
}
