import {
    Body,
    Controller,
    Get,
    Headers,
    Post,
    Query,
} from '@nestjs/common';
import { AuthenticationProvider } from '@services/authentication/authentication.provider';
import { Api } from '@shared/interfaces';
import {
    SignupByEmail,
    SignByPhoneCode,
    SignByPhoneNumber,
    SignupByUsernameDto,
    UserWithToken,
    VerificationCodeOutout,
    SigninByUsernameDto,
    SigninByEmailDto,
    SingGuestUser,
    UserWithTokenApi,
    SignByGoogle,
    VerificationCodeOutoutApi,
    RefreshToken,
} from '@services/authentication/dto';
import { ApiUseTags, ApiResponse, ApiImplicitHeader, ApiImplicitQuery } from '@nestjs/swagger';
const controllerName = 'authentication';

@Controller(controllerName)
@ApiUseTags(controllerName)
export class AuthenticationController {

    constructor(
        private readonly authProvider: AuthenticationProvider) {
    }
    //#region Guest
    /**
     *
     * @param headers
     */
    @Post('signin/guest')
    @ApiImplicitHeader({ name: 'fingerprint', description: 'fingerprint or unique identifier for user' })
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'create new guest user' })
    async createGuestUser(@Headers() headers: SingGuestUser): Promise<Api<UserWithToken>> {
        return {
            data: await this.authProvider.signAsGuest(headers),
        };
    }
    //#endregion
    //#region USERNAME/PASSWORD

    @Post('signup/username')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'create new user' })
    async createUserByUsername(@Body() user: SignupByUsernameDto): Promise<Api<UserWithToken>> {
        return {
            data: await this.authProvider.signupByUserPass(user),
        };
    }
    @Post('signin/username')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'sign in user' })
    async loginByUsername(
        @Body() signinInfo: SigninByUsernameDto,
    ): Promise<Api<UserWithToken>> {
        const password = signinInfo.password;
        const username = signinInfo.username;
        return {
            data: await this.authProvider.signinByUserPass(username, password),
        };
    }
    //#endregion
    //#region EMAIL/PASSWORD
    @Post('signup/email')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'create new user' })
    async createUserByEmail(@Body() user: SignupByEmail): Promise<Api<UserWithToken>> {
        return {
            data: await this.authProvider.signupByEmailPass(user),
        };
    }
    @Post('signin/email')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'sign in user' })
    async loginByEmail(
        @Body() signinInfo: SigninByEmailDto,
    ): Promise<Api<UserWithToken>> {
        const email = signinInfo.email;
        const password = signinInfo.password;
        return {
            data: await this.authProvider.signinByEmailPass(email, password),
        };
    }
    @Post('verification/email')
    @ApiResponse({ status: 201, type: Api, description: 'resend verification email' })
    async resendVeridicationByEmail(
        @Body() signinInfo: SigninByEmailDto,
    ): Promise<Api<boolean>> {
        const email = signinInfo.email;
        const password = signinInfo.password;
        return {
            data: await this.authProvider.resendVerificationByEmail(email, password),
        };
    }
    @Get('verification/email')
    @ApiImplicitQuery({ name: 'token', description: 'token which contain email address', type: String })
    @ApiResponse({ status: 200, type: Api, description: 'callback verification email' })
    async verifyByEmail(
        @Query('token') token: string): Promise<boolean> {
        return await this.authProvider.verifyByEmail(token);
    }
    //#endregion
    //#region PHONE/CODE
    @Post('signup/phone')
    @ApiResponse({ status: 201, type: VerificationCodeOutoutApi, description: 'sign user phone number' })
    async getPhoneSendCode(@Body() body: SignByPhoneNumber): Promise<Api<VerificationCodeOutout>> {
        return {
            data: await this.authProvider.signinByPhoneNumber(body.phone),
        };
    }
    @Post('signin/phone')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'sign user verfication code and create user if needed' })
    async get(
        @Body() body: SignByPhoneCode): Promise<Api<UserWithToken>> {
        return {
            data: await this.authProvider.signinByPhoneCode(body.phone, body.code),
        };
    }
    //#endregion
    //#region GOOGLE
    @Post('signin/google')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'sign user with google account and create user if needed' })
    async createGoogleUser(
        @Body() signinInfo: SignByGoogle,
    ): Promise<Api<UserWithToken>> {
        const googleAccessToken = signinInfo.gat;
        const devicePlatform = signinInfo.dp;
        return {
            data: await this.authProvider.signinByGoogle(googleAccessToken, devicePlatform),
        };
    }
    //#endregion

    @Post('refresh')
    @ApiResponse({ status: 201, type: UserWithTokenApi, description: 'refresh user token' })
    async refresh(
        @Body() refreshInfo: RefreshToken): Promise<Api<UserWithToken>> {
        const refreshToken = refreshInfo.refreshToken;
        return {
            data: await this.authProvider.refreshAccessToken(refreshToken),
        };
    }

}
