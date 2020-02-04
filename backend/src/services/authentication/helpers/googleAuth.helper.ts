import * as axios from 'axios';

import { OS } from '@shared/enums/os.enum';
import { User } from '@shared/models/users.model';

export interface GoogleUser {
    sub: string;
    name: string;
    email: string;
    picture: string;
}
export class Google {
    private os: OS;
    private url: string;
    private params: any;
    private token: string;
    constructor(os: OS, token) {
        this.os = os.toUpperCase() as OS;
        this.token = token;
        this.createGoogleRequest();
        return this;
    }
    createGoogleRequest() {
        switch (this.os) {
            case OS.ANDROID:
                this.url = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
                this.params = {
                    id_token: this.token,
                };
                break;
            default:
                this.url = 'https://www.googleapis.com/oauth2/v3/userinfo';
                this.params = {
                    access_token: this.token,
                };
                break;
        }
    }
    async getUserInfo(): Promise<User> {
        const response = await axios.default.get<GoogleUser>(this.url, {
            params: this.params,
        });
        const { sub, name, email, picture } = response.data;
        const user = {
            name,
            google: email,
            picture,
        } as User;

        return user;
    }
}
