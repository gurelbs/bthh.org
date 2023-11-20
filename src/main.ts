import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { table } from 'console';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Record<string, string>>);

  const adminConfig: admin.ServiceAccount = {
    projectId: configService.getOrThrow('project_id'),
    privateKey: configService.getOrThrow('private_key').replace(/\\n/g, '\n'),
    clientEmail: configService.getOrThrow('client_email'),
  };
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: configService.getOrThrow('databaseURL'),
  });
  const config = new DocumentBuilder()
    .setTitle('Israeli Hostages API')
    .setDescription('description')
    .setVersion('1.0')
    .addTag('persons')
    .build();
  const options: SwaggerDocumentOptions = {};
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app
    .useGlobalFilters(new HttpExceptionFilter())
    .listen(3000, () =>
      table(
        `NestJS server app with swagger is up and running on http://localhost:3000/api`,
      ),
    );
}

bootstrap();
