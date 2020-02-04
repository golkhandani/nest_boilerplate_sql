import * as nodemailer from 'nodemailer';
import * as Transport from 'winston-transport';
import { winstonConstants } from '@shared/constants';
export class EmailTransport extends Transport {
    private account = {
        user: winstonConstants.LOGGER_EMAIL_USER,
        pass: winstonConstants.LOGGER_EMAIL_PASSWORD,
    };
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: this.account.user,
            pass: this.account.pass,
        },
    });
    constructor(opts: Transport.TransportStreamOptions) {
        super(opts);
    }
    log(info: any, callback: () => void) {
        if (winstonConstants.CRITICAL_ERROR_LEVELS.indexOf(info.level) !== -1) {
            const mailOptions = {
                from: '"log"',
                to: winstonConstants.LOGGER_RECEIVER_EMAIL,
                subject: info.level,
                text: `
            ${info.message}
            _______________________
            ${JSON.stringify(info)}
            `,
            };
            this.transporter.sendMail(mailOptions);
        }
        callback();
    }
}
