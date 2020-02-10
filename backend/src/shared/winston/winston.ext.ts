import { Logger, LoggerService } from '@nestjs/common';
import { WinstonLogger as Winston } from '@shared/winston/winston.logger';

export class WLogger extends Logger {
    static error(message: string) {
        Winston.log('error', `${message} `);
        super.error(message);
    }

}
