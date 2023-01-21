import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CorsMiddleware } from './middleware/cors.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const options = new DocumentBuilder()
  //   .setTitle('API')
  //   .setDescription('API description')
  //   .setVersion('1.0')
  //   .addTag('API')
  //   .build();
  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.use(new CorsMiddleware().use);
  // app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
