import 'module-alias/register';

import { AppModule } from './app.module';
import {
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { rateLimitConstants } from '@shared/constants/rateLimitConstants';
import { TransformInterceptor } from '@shared/interceptors/api.interceptor';
import { WLogger } from '@shared/winston/winston.ext';
import { useContainer } from 'class-validator';
import * as compression from 'compression';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { join } from 'path';

// import * as session from 'express-session';
// import * as cookieParser from 'cookie-parser';
// import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new WLogger(),
  });

  const swaggerOptions = new DocumentBuilder()
    .setTitle('TITLE')
    .setDescription('The MRZG API description')
    .setVersion('1.0')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, swaggerDoc);

  // For sake of same level dependencies (providers)
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // app.enableCors();

  app.use(helmet());

  // app.use(session({ secret: jwtConstants.general_key }));
  // app.use(cookieParser());
  // app.use(new csurf({ cookie: true }));

  app.use(new rateLimit(rateLimitConstants));

  //#region GLOBAL PIPES
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,
    forbidUnknownValues: true,
    whitelist: true,
  }));
  //#endregion

  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(morgan(`:method :url :status :response-time`));

  app.useStaticAssets(join(__dirname, '..'));

  app.use(compression());

  await app.listen(3000);
}
bootstrap();
