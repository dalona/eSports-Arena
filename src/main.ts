import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
// Basic Swagger configuration
const config = new DocumentBuilder()
.setTitle('API e-Sports Arena')
.setDescription('The system allows to manage tournaments and players.')
.setVersion('1.0')
//.addTag('') // You can add labels to organize your endpoints
.addBearerAuth(
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
  'JWT', // Security scheme name
)
.build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document, {
  swaggerOptions: {
    authAction: {
      JWT: {
        name: 'JWT',
        schema: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: '',
        },
        value: 'Bearer <token>',
      },
    },
  },
});
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Delete properties that are not in the DTO
    forbidNonWhitelisted: true, // Throws an error if there are unwanted properties
    transform: true, // Transforms types (e.g. strings to numbers)
  }));
  await app.listen(3000);
  console.log(`App running in: ${await app.getUrl()}`);
  console.log(`Swagger Documentation available in: ${await app.getUrl()}/api-docs`);
}
bootstrap();
