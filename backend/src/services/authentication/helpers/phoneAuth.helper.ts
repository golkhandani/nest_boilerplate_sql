import { KavenegarSMS, KavenegarSmsType } from '@services/authentication/helpers';

export enum CodeType {
    NUMBER = 'NUMBER',
    STRING = 'STRING',
}
export class PhoneVerfication {
    public static get randomCode() {
        const high = 9999;
        const low = 1000;
        let code = '1111';
        code = (Math.floor(Math.random() * (high - low) + low)).toString();
        return {
            code,
            codeLength: code.toString().length,
            codeType: CodeType.NUMBER,
        };
    }

    public static async sendSmsByKavenegar(phone, message) {
        const kavenegar = new KavenegarSMS(phone, message);
        const knr = await kavenegar.send(KavenegarSmsType.TEMPLATE);
        return knr;
    }
}
