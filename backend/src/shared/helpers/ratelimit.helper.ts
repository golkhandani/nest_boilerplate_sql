import { HttpStatus, HttpException } from '@nestjs/common';

export const rateLimitHandler = (req, res) => {
    return res.status(HttpStatus.TOO_MANY_REQUESTS).send({
        error: 'too many requst',
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
    });
};
