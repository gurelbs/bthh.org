import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { table } from 'console';
import { ServiceAccount, initializeApp, credential } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { get }: ConfigService = app.get(ConfigService);
  const adminConfig: ServiceAccount = {
    projectId: get('_project_id'),
    privateKey: get('_private_key').replace(/\\n/g, '\n'),
    clientEmail: get('_client_email'),
  };
  initializeApp({
    credential: credential.cert(adminConfig),
    databaseURL: get('_databaseURL'),
  });
  const config = new DocumentBuilder()
    .setTitle('Israeli Hostages API')
    .setDescription(get('_desc'))
    .setVersion('1.0')
    .addTag('persons')
    .build();
  const options: SwaggerDocumentOptions = {};
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app
    .useGlobalFilters(new HttpExceptionFilter())
    .listen(get('PORT'), () =>
      table(
        `NestJS server app with swagger is up and running on http://localhost:${get(
          'PORT',
        )}/api`,
      ),
    );
}

bootstrap();
