import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { config as dotenv } from 'dotenv';
import { table } from 'console';
// Import firebase-admin
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  dotenv();
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  // Set the config options
  const adminConfig: ServiceAccount = {
    projectId: configService.get<string>('projectId'),
    privateKey: configService.get<string>('apiKey').replace(/\\n/g, '\n'),
    clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
  };
  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: 'https://xxxxx.firebaseio.com',
  });
  const config = new DocumentBuilder()
    .setTitle('Israeli Hostages API')
    .setDescription(process.env.desc)
    .setVersion('1.0')
    .addTag('persons')
    .build();
  const options: SwaggerDocumentOptions = {};
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app
    .useGlobalFilters(new HttpExceptionFilter())
    .listen(process.env['PORT'] || 3000, () =>
      table(
        `NestJS server app with swagger is up and running on http://localhost:3000/api`,
      ),
    );
}

bootstrap();
