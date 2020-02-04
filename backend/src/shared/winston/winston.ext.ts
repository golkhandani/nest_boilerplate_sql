import { Logger, LoggerService } from '@nestjs/common';
import { Winston } from './winston.logger';

export class WLogger extends Logger {
    static error(message: string) {
        Winston.log('error', `${message} `);
        super.error(message);
    }

}
