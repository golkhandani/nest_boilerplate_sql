import { Controller, Get } from '@nestjs/common';
import { Winston } from '@shared/winston/winston.logger';

@Controller()
export class AppController {
  constructor() { }

  @Get('ping')
  ping(): string {
    Winston.error('error');
    Winston.info('info');
    Winston.warn('info');
    return 'pong';
  }

}
