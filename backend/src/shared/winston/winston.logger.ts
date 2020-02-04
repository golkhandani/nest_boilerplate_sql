import * as winston from 'winston';
import { EmailTransport } from './email.transporter';
import { winstonConstants } from '@shared/constants';

class Logger {

    public logger: winston.Logger;

    private label: string = 'GENERAL';

    private color = winstonConstants.colors;

    private levelColorMap = {
        warn: this.color.BgYellow + this.color.FgBlack,
        error: this.color.BgRed + this.color.FgWhite,
        info: this.color.FgCyan,
    };

    constructor(serviceName: string = 'GENERAL') {
        const { combine, timestamp, label, printf } = winston.format;
        // tslint:disable-next-line: no-shadowed-variable
        const consoleFormat = printf(({ level, message, label, timestamp }) => {
            // tslint:disable-next-line:max-line-length
            return `${this.levelColorMap[level] || this.color.FgCyan}[${label}]\t${timestamp}${this.color.Reset}\t${this.levelColorMap[level] || this.color.Reset}${level.toUpperCase()}${this.color.Reset}:\t${message}`;
        });
        this.label = serviceName;
        this.logger = winston.createLogger({
            format: combine(
                winston.format.prettyPrint(),
                winston.format.metadata(),
                winston.format.json(),
                label({ label: this.label }),
                timestamp(),

            ),
            exitOnError: false,
            transports: [
                new winston.transports.File({
                    filename: 'errors.log',
                    level: 'error',
                }),
                new winston.transports.File({
                    filename: 'combined.log',
                    level: 'info',
                }), //
                new winston.transports.Console({ level: 'info', format: consoleFormat }),
                // new EmailTransport({ level: 'error', format: logFormat }),
                //  new winston.transports.Console({ format: consoleFormat }),
            ],
        });
        return this;
    }
}

export const Winston = (new Logger(winstonConstants.LOGGER_SERVICE_NAME)).logger;
