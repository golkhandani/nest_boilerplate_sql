import * as RedisStore from 'rate-limit-redis';
import { redisConstants } from '.';
import { rateLimitHandler } from '@shared/helpers';
import { HttpStatus } from '@nestjs/common';

export const rateLimitConstants = {
    store: new RedisStore(redisConstants),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    handler: rateLimitHandler,
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
};
