import * as base64 from 'base-64';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import * as moment from 'moment';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { ForbiddenException, HttpException, Injectable, NotFoundException, BadRequestException, BadGatewayException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
// dtos
import {
    SignupByUsernameDto, UserWithToken, VerificationCodeOutout, SignupByEmail,
} from '@services/authentication/dto';
// helpers
import { Google, PhoneVerfication } from '@services/authentication/helpers';
// models
import {
    PhoneVerification, PhoneVerificationModelName, RefreshToken, RefreshTokenModelName, TokenSubject,
} from '@services/authentication/models';
// shared constants
import { bcryptConstants, jwtConstants, phoneConstants } from '@shared/constants';
// shared enums
import { OS } from '@shared/enums';
// shared models
import { User, UserModelName, UserRoles } from '@shared/models';
import { WsException } from '@nestjs/websockets';
import { AuthorizationProvider } from '@services/authorization/authorization.provider';
import { UserScopes } from '@services/authorization/models';

@Injectable()
export class AuthenticationProvider {
    constructor(
        @InjectModel(UserModelName) private readonly UserModel: Model<User>,
        @InjectModel(PhoneVerificationModelName) private readonly PhoneVerificationModel: Model<PhoneVerification>,
        @InjectModel(RefreshTokenModelName) private readonly RefreshTokenModel: Model<RefreshToken>,
        private readonly jwtService: JwtService,
        private readonly authorizationProvider: AuthorizationProvider,
    ) { }

    async findByUniquesForValidation(value: string): Promise<User> {
        return await this.UserModel.findOne({
            $or: [
                { username: value },
                { google: value },
                { email: value },
            ],
        });
    }
    public async findUserForValidation(id: string): Promise<User> {
        return await this.UserModel.findById(id);
    }
    private async createRefreshToken(safeUser: User): Promise<string> {
        await this.RefreshTokenModel.deleteOne({ user: safeUser._id });
        const expires = moment().add(jwtConstants.expirationInterval, 'days').toDate();
        const token = base64.encode(Math.random() + safeUser._id + Math.random());
        const newRefreshToken = new this.RefreshTokenModel({
            token,
            user: safeUser._id,
            expires,
        });
        await newRefreshToken.save();
        return token;
    }

    /**
     * Validates the token
     *
     * @param {string} token - The JWT token to validate
     * @param {boolean} isWs - True to handle WS exception instead of HTTP exception (default: false)
     */
    async verify(token: string, isWs: boolean = false): Promise<User | null> {
        try {
            if (!token) { throw new WsException('Unauthorized access'); }
            const payload = this.jwtService.verify(token, {
                algorithms: [jwtConstants.algorithm],
            });
            console.log(payload);
            const user = await this.UserModel.findById(payload._id);

            if (!user) {
                if (isWs) {
                    throw new WsException('Unauthorized access');
                } else {
                    throw new HttpException(
                        'Unauthorized access',
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }

            return user;
        } catch (err) {
            if (isWs) {
                throw new WsException(err.message);
            } else {
                throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
            }
        }
    }
    private createAccessToken(payload: User): string {
        return this.jwtService.sign(payload, {
            subject: TokenSubject.lock(payload),
            algorithm: jwtConstants.algorithm,
            issuer: 'auth.com',
            audience: 'service.com',
            expiresIn: jwtConstants.expiresIn,
        });
    }
    private async createTokenResponse(userObj: User): Promise<UserWithToken> {
        const user = {
            _id: userObj._id,
            role: userObj.role || UserRoles.GUEST,
        } as User;
        const payload = user;
        const accessToken = this.createAccessToken(payload);
        const refreshToken = await this.createRefreshToken(user);
        const tokenType = 'Bearer';
        return { user: userObj, tokenType, refreshToken, accessToken };
    }
    private async validatedUser(userObj: User, password: string) {

        if (!userObj) {
            throw new HttpException('user not found', 404);
        } else if (!password || !compareSync(password, userObj.password)) {
            throw new HttpException('invalid password', 400);
        } else {
            return await this.createTokenResponse(userObj);
        }
    }
    public async refreshAccessToken(oldRefreshToken: string): Promise<UserWithToken> {
        const refreshTokenObj = await this.RefreshTokenModel.findOne({ token: oldRefreshToken });
        if (!refreshTokenObj) {
            throw new ForbiddenException();
        }
        const userObj: User = await this.UserModel.findById(refreshTokenObj.user) as User;
        if (!userObj) {
            throw new HttpException('invalid token', 400);
        }
        return await this.createTokenResponse(userObj);
    }
    private generatedHashPassword(password: string): string {
        const salt = genSaltSync(bcryptConstants.saltRounds);
        const hashed = hashSync(password, salt);
        return hashed;
    }
    //#region SIGN UP/IN
    public async signAsGuest(headers: any): Promise<UserWithToken> {
        // TODO : change the way you get real fingerprint
        const fingerprint: string = headers.fingerprint || base64.encode(JSON.stringify(headers));
        const existsUser: User = await this.UserModel.findOne({ fingerprint });
        if (!existsUser) {
            const userObj = {
                fingerprint,
                role: UserRoles.GUEST,
            };
            const newUser = new this.UserModel(userObj);
            const savedUser = await newUser.save() as User;
            await this.authorizationProvider.initScopes(savedUser._id, [UserScopes.READ]);

            return await this.createTokenResponse(savedUser);
        } else {
            return await this.createTokenResponse(existsUser);
        }
    }

    public async signupByUserPass(userObj: SignupByUsernameDto): Promise<UserWithToken> {
        userObj.password = this.generatedHashPassword(userObj.password);
        const newUser = new this.UserModel(Object.assign(userObj, { verified: true }));
        const savedUser = await newUser.save() as User;
        await this.authorizationProvider.initScopes(savedUser._id, [UserScopes.ME, UserScopes.READ]);

        return await this.createTokenResponse(savedUser);
    }
    public async signinByUserPass(username: string, password: string): Promise<UserWithToken> {
        const userObj: User = await this.UserModel.findOne({ username }) as User;
        return await this.validatedUser(userObj, password);
    }

    private generalTokenEncode(obj: any) {
        const encrypted = jwt.sign(
            obj,
            jwtConstants.general_key,
            {
                algorithm: 'HS256',
            });
        return encrypted;
    }
    private generalTokenDecode(str: string, objName: string) {
        try {
            const decoded = jwt.verify(str, jwtConstants.general_key);
            return decoded[objName];
        } catch {
            throw new BadRequestException('invalid token');
        }

    }
    private sendVerificationEmail(token: string) {
        // send email
        console.log('MAIL SENT WITH TOKEN : ', token);
    }
    public async signupByEmailPass(userObj: SignupByEmail): Promise<UserWithToken> {
        (userObj as any).password = this.generatedHashPassword(userObj.password);
        const newUser = new this.UserModel(Object.assign(userObj, { verified: false }));
        const savedUser = await newUser.save() as User;
        await this.authorizationProvider.initScopes(savedUser._id, [UserScopes.ME, UserScopes.READ]);

        // send verification mail
        const token = this.generalTokenEncode({ email: userObj.email });
        await this.sendVerificationEmail(token);
        return await this.createTokenResponse(savedUser);
    }
    public async signinByEmailPass(email: string, password: string): Promise<UserWithToken> {
        const userObj: User = await this.UserModel.findOne({ email }) as User;
        return await this.validatedUser(userObj, password);
    }
    public async verifyByEmail(token: string): Promise<boolean> {
        const email = this.generalTokenDecode(token, 'email');
        if (!email) {
            throw new NotFoundException('token not found');
        } else {
            const userObj: User = await this.UserModel.findOneAndUpdate(
                { email },
                { $set: { verified: true } },
                { new: true }) as User;
            return userObj ? true : false;
        }
    }
    public async resendVerificationByEmail(email: string, password: string): Promise<boolean> {
        const userObj: User = await this.UserModel.findOne({ email }) as User;
        const userWithToken = await this.validatedUser(userObj, password);
        if (userWithToken) {
            const token = this.generalTokenEncode({ email: userObj.email });
            await this.sendVerificationEmail(token);
            return true;
        } else {
            throw new BadRequestException('invalid user');
        }
    }

    /**
     * Step 1 / 4
     * get phone number and create verfication code
     * we will use verfication code to complete signup
     * @param phone string
     */
    public async signinByPhoneNumber(phone: string): Promise<VerificationCodeOutout> {
        const { code, codeLength, codeType } = PhoneVerfication.randomCode;
        const expires = moment().add(phoneConstants.expirationInterval, 'minutes').toDate();
        const newVerification = new this.PhoneVerificationModel({
            code,
            expires,
            phone,
            codeType,
        });
        await newVerification.save();
        // TODO turned off for development
        // const sms = await PhoneVerfication.sendSmsByKavenegar(phone, code);
        return {
            codeType,
            codeLength,
            expires,
        };
    }
    public async signinByPhoneCode(phone: string, code: string): Promise<UserWithToken> {
        const phoneVerfication = await this.PhoneVerificationModel.findOne({ phone });
        if (!phoneVerfication) {
            throw new ForbiddenException();
        } else if (moment(phoneVerfication.expires).isBefore(Date.now())) {
            throw new HttpException('your code is expired try to send phone number again', 400);
        } else if (phoneVerfication.code === code) {
            await this.PhoneVerificationModel.findOneAndRemove({ phone });
            const existsUser = await this.UserModel.findOne({ phone });
            if (existsUser) {
                return await this.createTokenResponse(existsUser);
            } else {
                const newUser = new this.UserModel(
                    Object.assign({ phone }, { verified: true }),
                );
                const savedUser = await newUser.save() as User;
                await this.authorizationProvider.initScopes(savedUser._id, [UserScopes.ME, UserScopes.READ]);

                return await this.createTokenResponse(savedUser);
            }
        } else {
            throw new HttpException('invalid code', 400);
        }
    }

    public async signinByGoogle(
        googleAccessToken: string,
        os: OS,
    ): Promise<UserWithToken> {

        const google = new Google(os, googleAccessToken);
        const googleUser = await google.getUserInfo();

        // google account is found Or not so
        if (googleUser) {
            const existsUser = await this.UserModel.findOne({
                $or: [
                    { google: googleUser.google },
                    { gmail: googleUser.google },
                ],
            }) as User;
            /**
             * if existsUser is null
             * we should create new user
             * if userWithGoogle or userWithGmail return true
             * we just have to update record
             */

            const userWithGoogle = existsUser && existsUser.google === googleUser.google;
            const userWithVerifiedGmail = existsUser && existsUser.email === googleUser.google && existsUser.verified;

            if (!existsUser) {
                const newUser = new this.UserModel(
                    Object.assign(googleUser, { verified: true }),
                );
                const savedUser = await newUser.save() as User;
                await this.authorizationProvider.initScopes(savedUser._id, [UserScopes.ME, UserScopes.READ]);

                return await this.createTokenResponse(savedUser);

            } else if (userWithGoogle) {
                return await this.createTokenResponse(existsUser);
            } else if (userWithVerifiedGmail) {
                return await this.createTokenResponse(existsUser);
            } else {
                throw new HttpException(`
                gmail already exist but not verified plz verify it first
                if its not yours contanct support`
                    , 400);
            }

        } else {
            throw new HttpException('google user not found', 404);
        }

    }
}
