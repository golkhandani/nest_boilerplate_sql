import { Controller, Get, Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Controller()
export class AppController {
  constructor(@Inject('winston') private readonly logger: Logger) {
    // console.log(this.logger);
  }

  @Get('ping')
  ping(): string {
    this.logger.info('EDwqe');
    // Winston.error('error');
    // Winston.info('info');
    // Winston.warn('info');
    return 'pong';
  }

}
