
import { Kavenegar } from '@services/authentication/helpers';
import { kavenegarConstants } from '@shared/constants';

export enum KavenegarSmsType {
    SENDER = 'SENDER',
    TEMPLATE = 'TEMPLATE',
}
export class KavenegarSMS {
    private kavenegar: any;
    private receptor: string;
    private message: string;
    private timeout: number = 10000;
    constructor(phone, message) {
        this.kavenegar = Kavenegar({ apikey: kavenegarConstants.apiKey });
        this.receptor = phone;
        this.message = message;
        this.timeout = kavenegarConstants.timeout;
    }
    async send(type) {
        switch (type) {
            case 'SENDER':
                return this.sendByNumber();
            case 'TEMPLATE':
                return this.sendByTemplate();
            default:
                return this.sendByTemplate();
        }
    }
    sendByNumber(sender = kavenegarConstants.sender) {
        return new Promise((resolve, reject) => {
            this.kavenegar.Send({
                message: this.message,
                sender,
                receptor: this.receptor,
            }, (response, status) => {
                setTimeout(() => { reject(new Error('KVN...')); }, this.timeout);
                if (status === 200) {
                    resolve({ response, status });
                } else {
                    reject(new Error('KVN...' + status));
                }

            });
        });
    }
    sendByTemplate(template = kavenegarConstants.template) {
        return new Promise((resolve, reject) => {
            this.kavenegar.VerifyLookup({
                token: this.message,
                receptor: this.receptor,
                template,
            }, (response, status) => {
                setTimeout(() => { reject(new Error('KVN...')); }, this.timeout);
                if (status === 200) {
                    resolve({ response, status });
                } else {
                    reject(new Error('KVN...' + status));
                }
            });
        });
    }
}
