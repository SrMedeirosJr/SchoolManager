import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://school-manager-sand.vercel.app'], // Permite requisições apenas do seu frontend na Vercel
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // Se necessário para cookies/autenticação
  });

  await app.listen(3000);
}
bootstrap();
