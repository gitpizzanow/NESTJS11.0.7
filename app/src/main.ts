import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as rfs from 'rotating-file-stream';
import * as session from 'express-session';
import * as morgan from 'morgan';
import * as fs from 'fs';
import * as path from 'path';
import './utils/prototypes/array';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Global API prefix
  const apiPrefix = config.get<string>('API_PREFIX') || '';
  app.setGlobalPrefix(apiPrefix);

  // Ensure log directory exists
  const logDir = config.get<string>('LOG_DIRECTORY') || path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Access Logger
  const accessLogStream = rfs.createStream('access.log', {
    size: config.get<string>('ACCESS_LOGGER_FILE_SIZE') || '10M',
    interval: config.get<string>('ACCESS_LOGGER_FILE_INTERVAL') || '1d',
    compress: 'gzip',
    path: logDir,
  });
  app.use(morgan('combined', { stream: accessLogStream }));

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: config.get<false | Record<string, unknown>>('HELMET_CONTENT_SECURITY_POLICY') || false,
    }),
  );

  // CORS
  app.enableCors({
    origin: config.get<string | string[]>('CORS_ORIGINS') || '*',
    credentials: true,
  });

  // Swagger / OpenAPI
  const isProd = config.get<boolean>('PRODUCTION') === true;
  if (!isProd) {
    const openAPIConfig = new DocumentBuilder()
      .setTitle(config.get<string>('OPENAPI_TITLE') || 'API')
      .setDescription(config.get<string>('OPENAPI_DESCRIPTION') || '')
      .setVersion(config.get<string>('OPENAPI_VERSION') || '1.0')
      .build();
    const document = SwaggerModule.createDocument(app, openAPIConfig);
    SwaggerModule.setup(config.get<string>('OPENAPI_PATH') || 'docs', app, document);
  }

  // Session
  app.use(
    session({
      secret: config.get<string>('SESSION_SECRET') || 'default_secret',
      resave: config.get<boolean>('SESSION_RESAVE') || false,
      saveUninitialized: config.get<boolean>('SESSION_SAVE_UNINITIALIZED') || false,
      cookie: {
        maxAge: config.get<number>('SESSION_COOKIE_MAX_AGE') || 86400000,
        httpOnly: config.get<boolean>('SESSION_COOKIE_HTTP_ONLY') || true,
        secure: config.get<boolean>('SESSION_COOKIE_SECURE') || false,
      },
    }),
  );

  // Start server
  const port = config.get<number>('PORT') || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
  if (!isProd) {
    Logger.log(
      `📚 OpenAPI docs available at: http://localhost:${port}/${config.get<string>('OPENAPI_PATH') || 'docs'}`,
    );
  }
}

(async()=>{
await bootstrap();
})()

